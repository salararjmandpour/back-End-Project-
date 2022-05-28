const validator = require('./validator');
const { check } = require('express-validator/check');


class resetPassValidator extends validator {
    handle() {
        
        return [

            check('email').isEmail()
                .withMessage("فیلد ایمبل معتبر نیست"),
            
            check('password').isLength({ min: 8 })
                .withMessage("فیلد پسورد جدید نمیتواند کمتر از 8 کارکتر باشد"),
            
            check('token').not().isEmpty()
                .withMessage("فیلد توکن الزامی می باشد")
            
        ]

    } 

}

module.exports = new resetPassValidator();



