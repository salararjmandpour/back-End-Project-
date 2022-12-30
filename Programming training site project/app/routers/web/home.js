const express = require("express");
const router = express.Router();


//>---------------------- Controller

const homeController = require("app/http/controllers/homeController");

//>---------------------- Home router

router.get('/', homeController.index);

//>---------------------- Logout router

router.get('/logout', (req, res) => {
    req.logout();
    res.clearCookie('remember_token');
    res.redirect('/');
});

//>---------------------- module export

module.exports = router;