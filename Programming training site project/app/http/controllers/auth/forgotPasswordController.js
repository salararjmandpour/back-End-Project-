const controller = require('app/http/controllers/controller');
const passport = require('passport');
const { validationResult } = require('express-validator/check');
const PasswordReset = require('app/models/password-reset');
const User = require('app/models/user');
const uniqueString = require('unique-string');
//>---------------------- the class extends of bind module

class forgotPasswordController extends controller {
    showForgotPassword(req, res) {

        const title = 'فراموشی رمز عبور';
        res.render('home/auth/passwords/email', { recaptcha: this.recaptcha.render(), title });
   
    }

    //>---------------------- method password reset link

    async passwordResetLink(req, res, next) {

        try {

            await this.recaptchaValidation(req, res);
            let result = await this.validationData(req);
            if (result) {

                return this.back(req, res); // set and save data user in field
            }

            return this.sendResetLink(req, res, next);

        } catch (error) { console.log(error); }

    }

    //>----------------------  method send reset link password

    async sendResetLink(req, res, next) {

        const user = await User.findOne({ email: req.body.email });

        if (!user) {

            req.flash('errors', "چنین کاربری وجود ندارد ");
            return this.back(req, res);
        
        }

        const newPasswordReset = new PasswordReset({

            email: req.body.email,
            token: uniqueString()
        
        });

        await newPasswordReset.save();

        // req.flash('success', 'ایمیل بازیابی رمز عبور با موفقیت ارسال شد');
        res.redirect('/');

    }



}

//>---------------------- module export

module.exports = new forgotPasswordController();