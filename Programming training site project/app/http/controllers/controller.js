const chalk = require('chalk');
const autoBind = require("auto-bind");
const Recaptcha = require('express-recaptcha').RecaptchaV2
const { validationResult } = require('express-validator/check');

//>---------------------- module export
module.exports = class controller {
    constructor() {
        autoBind(this);
        this.recaptchaConfig();

    }

    //>---------------------- recaptcha config method

    recaptchaConfig() {
        this.recaptcha = new Recaptcha(
            config.service.recaptcha.client_key,
            config.service.recaptcha.secret_key,
            { ...config.service.recaptcha.options });
    }

    //>---------------------- recaptcha validation method 
    recaptchaValidation(req, res) {
        return new Promise((resolve, reject) => {
            this.recaptcha.verify(req, (err, data) => {
                if (err) {
                    req.flash('formData', req.body); // set and save data user in field
                    req.flash('errors', 'گزینه امنیتی مربوط به شناسایی ربات خاموش است، لطفا از فعال آن اطمینان حاصل نمایید و مجدد امتحان کنید ');
                    this.back(req, res);
                } else {
                    resolve(true);
                }
            })
        })
    }

    //>---------------------- method validationData login

    async validationData(req) {

        const result = validationResult(req);
        if (!result.isEmpty()) {

            const errors = result.array();
            const errorMsg = [];
            errors.forEach(err => errorMsg.push(err.msg));
            req.flash('errors', errorMsg);
            return true;
        }


        return false;

    }

    //>---------------------- creat method for redirect error back to page 
    back(req, res) {
        return res.redirect(req.header('Referer') || '/');
    }




}


