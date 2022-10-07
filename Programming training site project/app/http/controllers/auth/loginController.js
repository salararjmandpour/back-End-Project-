const controller = require('app/http/controllers/controller');
const passport = require('passport');
const { validationResult } = require('express-validator/check');

//>---------------------- the class extends of bind module

class loginController extends controller {
    showLoginForm(req, res) {
        res.render('auth/login', { errors: req.flash('errors'), recaptcha: this.recaptcha.render() });
    }

    //>---------------------- method Post login

    loginProcess(req, res, next) {
        this.recaptchaValidation(req, res)
            .then(result => this.validationData(req))
            .then(result => result ? res.redirect('/login') : this.login(req, res, next)).catch(error => console.log(error));
    }

    //>----------------------  creat method login for checking email and password

    login(req, res, next) {
        passport.authenticate('local.login', (err, user) => {
            if (!user) return res.redirect('/login');

            req.logIn(user, err => {

                if (req.body.remember) {
                    //>--------- set token
                    user.setRememberToken(res);
                }
                return res.redirect('/')
            })

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