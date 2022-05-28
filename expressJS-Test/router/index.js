const express = require('express');
const jwt = require("jsonwebtoken");
const router = express.Router();
const weatherRouter = require("./weather");
const { isLoginBySession, isLoginByJwt } = require("../tools/auth");
const userRouter = require("./user");
const taskRouter = require("./task");
const authRouter = require("./auth");
const upload = require("../tools/upload").upload;
//-----------------------------------------------------------------------//
router.get('/', (req, res) => {
    res.render("basePage", {
        title: "HOME",
        h1Title: "Home Page",
        content: "Welcome To Home Page :)"
    });
});

router.get('/about', (req, res) => {
    res.render("basePage", {
        title: "About Me Page",
        h1Title: "About Me",
        content: "Hi!, I am Salar Arjmandpour :)"
    });
});

router.get('/contact', (req, res) => {
    // res.send("Contact Me");
    res.send([{
        name: "salar",
        email: "salararjmandpour@gmail.com"
    }, {
        name: "ali",
        email: "alimahdavi@gmail.com"
    }]);
});
//---------------------------------------------------------------------------//
router.use("/weather", weatherRouter);
router.use("/auth", authRouter);
//**************************************************//
router.use("/users", isLoginBySession, userRouter);
router.use("/tasks", isLoginBySession, taskRouter);
//------------------------------create token by jwt----------------------------------//
//--------------------------------encode token jwt------------------------------------//
router.get("/test", (req, res) => {
    if (!req.params.token) {
        const token = jwt.sign({ myName: "salAr" }, "Bootcamp", { algorithm: 'HS256' });
        res.json({ token });
    }
});

router.get("/test/auth", isLoginByJwt, (req, res) => {
    res.json(req.user);
})
//--------------------------------decode token jwt------------------------------------//
router.get("/test/:token", (req, res) => {
    const decode = jwt.decode(req.params.token);
    res.json({ decode });

});
//--------------------------------decode by verify token jwt------------------------------------//
router.get("/test/verify/:token", (req, res) => {
    const verify = jwt.verify(req.params.token, "Bootcamp");
    res.json({ verify });

});

//---------------------- Upload to Server
router.post("/upload", upload.single("myFile"), async (req, res) => {
    
        res.sendStatus(200);
})
//-------------------------------------------------------------------------------------//
router.get("*", (req, res) => {
    res.status(404);
    res.render("404Error", {
        title: "Not Found",
        h1Title: "404 Error , Not found Page",
        Error: "Page not found :("
    });
});

router.all("*", (req, res) => {
    res.sendStatus(404);
});

module.exports = router;
