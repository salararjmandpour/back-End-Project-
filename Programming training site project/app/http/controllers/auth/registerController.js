const controller = require('app/http/controllers/controller');
const passport = require('passport');

//>---------------------- the class extends of bind module

class registerController extends controller {

    showRegisterForm(req, res) {
        res.render('auth/register', { errors: req.flash('errors'), recaptcha: this.recaptcha.render() });
    }

    //>---------------------- method Post register

    registerProcess(req, res, next) {
        this.recaptchaValidation(req, res)
            .then(result => this.validationData(req))
            .then(result => result ? res.redirect('/register') : this.register(req, res, next)).catch(error => console.log(error));
    }

    //>----------------------  creat method register for checking email and password
    register(req, res, next) {
        
        passport.authenticate('local.register', {
            successRedirect: '/',
            failureRedirect: '/register',
            failureFlash: true
        })(req, res, next);
    }
}

//>---------------------- module export

module.exports = new registerController();