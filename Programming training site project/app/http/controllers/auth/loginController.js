const controller = require('app/http/controllers/controller');
const passport = require('passport');
const { validationResult } = require('express-validator/check');

//>---------------------- the class extends of bind module

class loginController extends controller {
    showLoginForm(req, res) {
        const title = 'صفحه ورود';
        res.render('home/auth/login', { recaptcha: this.recaptcha.render(), title });
    }

    //>---------------------- method Post login

    async loginProcess(req, res, next) {

        try {

            await this.recaptchaValidation(req, res);
            let result = await this.validationData(req);
            
            if (result) {

                req.flash('formData', req.body); // set and save data user in field
                return res.redirect('/auth/login');
            }

            return this.login(req, res, next);

        } catch (error) { console.log(error); }

    }

    //>----------------------  creat method login for checking email and password

    login(req, res, next) {
        
        passport.authenticate('local.login', (err, user) => {
            
            if (!user) return res.redirect('/auth/login');

            req.logIn(user, err => {

                if (req.body.remember) {
                    //>--------- set token
                    user.setRememberToken(res);
                }
                
                return res.redirect('/')
            
            });

        })(req, res, next);
    }

    // login(req, res, next) {
    //     passport.authenticate('local.login', {
    //         successRedirect: '/',
    //         failureRedirect: '/login',
    //         failureFlash:true
    //     })(req, res, next);
    // }

}

//>---------------------- module export

module.exports = new loginController();