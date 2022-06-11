const validator = require('./validator');
const { check } = require('express-validator/check');
const Course = require('app/models/course');

class courseValidator extends validator {
    handle() {
        console.log('test');
        return [

            check('title').isLength({ min: 5 }).trim()
                .withMessage("فیلد عنوان نمی تواند کتر از 5 کارکتر باشد ")
                .custom(async value => {
                    const course = await Course.findOne({ slug: this.slug(value) })
                    if (course) throw new Error("چنین دوره ای با این عنوان قبلا در سایت قرارداده شده است");

                }),

            check('type').not().isEmpty()
                .withMessage("فیلد نوع دوره نمی تواند خالی باشد"),

            check('body').isLength({ min: 20 })
                .withMessage(" متن دوره نمیتواند کمتر از 20 کارکتر باشد"),

            check('price').not().isEmpty()
                .withMessage("فیلد قیمت دوره نمی تواند خالی باشد"),

            check('tags').not().isEmpty()
                .withMessage("فیلد تگ دوره نمی تواند خالی باشد"),
        ]

    }

    slug(title) {
        return title.replace(/([^0-9آ-یa-z0-9]|-)+/g, "-");
    }

}

module.exports = new courseValidator();



