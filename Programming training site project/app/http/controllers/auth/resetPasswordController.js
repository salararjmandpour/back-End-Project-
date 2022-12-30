const controller = require('app/http/controllers/controller');
const passport = require('passport');
const { validationResult } = require('express-validator/check');
const PasswordReset = require('app/models/password-reset');
const User = require('app/models/user');
const uniqueString = require('unique-string');
//>---------------------- the class extends of bind module

class resetPasswordController extends controller {

    showResetPassword(req, res) {

        const title = 'بازیابی رمز عبور';
        res.render('home/auth/passwords/reset', {

            recaptcha: this.recaptcha.render(),
            title,

            token: req.params.token
        });

    }

    //>---------------------- method password reset link

    async resetPasswordProcess(req, res, next) {

        try {

            await this.recaptchaValidation(req, res);
            let result = await this.validationData(req);

            if (result) {

                return this.back(req, res); // set and save data user in field

            }

            return this.resetPassword(req, res, next);

        } catch (error) { console.log(error); }

    }

    //>----------------------  method send reset link password

    async resetPassword(req, res, next) {

        const field = await PasswordReset.findOne({ $and: [{ email: req.body.email }, { token: req.body.token }] });

        if (!field) {
            req.flash('errors', "اطلاعات وارد شده صحیح نمی باشد ");
            return this.back(req, res);
        }

        if (field.use) {

            req.flash('errors', "از این لینک قبلا برای بازیابی رمز عبور استفاده شده است");
            return this.back(req, res);

        }

        const user = await User.findOneAndUpdate({ email: field.email }, { $set: { password: req.body.password } });

        if (!user) {

            req.flash('errors', "اپدیت اطلاعات انجام نشد مجدد تلاش کنید");
            return this.back(req, res);

        }

        await field.update({ use: true });
        // return console.log("test");
        return res.redirect('/auth/login');

        

    }



}

//>---------------------- module export

module.exports = new resetPasswordController();