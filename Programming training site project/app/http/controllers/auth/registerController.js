const controller = require('app/http/controllers/controller');
const passport = require('passport');

//>---------------------- the class extends of bind module

class registerController extends controller {

    showRegisterForm(req, res) {
       
        const title = 'صفحه عضویت';
        res.render('home/auth/register', { recaptcha: this.recaptcha.render(), title});
   
    }

    //>---------------------- method Post register

    async registerProcess(req, res, next) {

        try {

            await this.recaptchaValidation(req, res);
            let result = await this.validationData(req);
            
            if (result) {

                return this.back(req, res); // set and save data user in field
                
            }

            return this.register(req, res, next);

        } catch (error) { console.log(error); }
   
    }

    //>----------------------  create method register for checking email and password
    register(req, res, next) {

        passport.authenticate('local.register', {
           
            successRedirect: '/',
            failureRedirect: '/auth/register',
            failureFlash: true
        
        })(req, res, next);
    }
}

//>---------------------- module export

module.exports = new registerController();