const validator = require('./validator');
const { check } = require('express-validator/check');


class registerValidator extends validator {
    handle() {
        return [

            check('name').not().isEmpty()
                .withMessage("فیلد نام نمیتواند خالی بماند").isLength({ min: 5 })
                .withMessage("فیلد نام نمیتواند کمتر از 5 کارکتر باشد "),

            check('email').not().isEmpty()
                .withMessage("فیلد ایمیل نمیتواند خالی بماند").isEmail()
                .withMessage("فیلد ایمبل معتبر نیست"),

            check('password').not().isEmpty()
                .withMessage("فیلد پسورد نمیتواند خالی بماند").isLength({ min: 8 })
                .withMessage("فیلد پسورد نمیتواند کمتر از 8 کارکتر باشد")
        ]

    }

}

module.exports = new registerValidator();





