const validator = require('./validator');
const { check } = require('express-validator/check');


class forgotPassValidator extends validator {
    handle() {
        return [

            check('email').isEmail()
                .withMessage("فیلد ایمبل معتبر نیست")
            
        ]

    }

}

module.exports = new forgotPassValidator();



