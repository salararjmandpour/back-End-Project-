const express = require("express");
const router = express.Router();
const passport = require('passport');


//>---------------------- Controller

const loginController = require("app/http/controllers/auth/loginController");
const registerController = require("app/http/controllers/auth/registerController");
const forgotPasswordController = require("app/http/controllers/auth/forgotPasswordController");
const resetPasswordController = require("app/http/controllers/auth/resetPasswordController");
//>---------------------- validator

const registerValidator = require("app/http/validator/registerValidator");
const loginValidator = require("app/http/validator/loginValidator");
const forgotPassValidator = require("app/http/validator/forgotPassValidator");
const resetPassValidator = require("app/http/validator/resetPassValidator");

//>---------------------- Login router

router.get('/login', loginController.showLoginForm);
router.post('/login', loginValidator.handle(), loginController.loginProcess);

//>---------------------- Register  router

router.get('/register', registerController.showRegisterForm);
router.post('/register', registerValidator.handle(), registerController.registerProcess);

//>---------------------- Forgot my password 

router.get('/password/reset', forgotPasswordController.showForgotPassword);
router.post('/password/email', forgotPassValidator.handle(), forgotPasswordController.passwordResetLink);

//>---------------------- reset my password 

router.get('/password/reset/:token', resetPasswordController.showResetPassword);
router.post('/password/reset', resetPassValidator.handle(), resetPasswordController.resetPasswordProcess);
//>---------------------- google account router

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/register' }));

//>---------------------- module export

module.exports = router;