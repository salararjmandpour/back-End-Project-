const express = require("express");
const router = express.Router();



//>---------------------- Controller

const homeController = require("app/http/controllers/homeController");
const loginController = require("app/http/controllers/auth/loginController");
const registerController = require("app/http/controllers/auth/registerController");

//>---------------------- middleware

const redirectAuthenticated = require("app/http/middleware/redirectAuthenticated");

//>---------------------- validator

const registerValidator = require("app/http/validator/registerValidator");
const loginValidator = require("app/http/validator/loginValidator");

//>---------------------- Home router

router.get('/', homeController.index);

//>---------------------- Login router

router.get('/login', redirectAuthenticated.handle, loginController.showLoginForm);
router.post('/login', redirectAuthenticated.handle, loginValidator.handle(), loginController.loginProcess);

//>---------------------- Register  router

router.get('/register', redirectAuthenticated.handle, registerController.showRegisterForm);
router.post('/register', redirectAuthenticated.handle, registerValidator.handle(), registerController.registerProcess);

//>---------------------- Logout router

router.get('/logout', (req, res) => {
    req.logout();
    res.clearCookie('remember_token');
    res.redirect('/');
});

//>---------------------- module export

module.exports = router;