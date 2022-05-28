const express = require("express");
const router = express.Router();


//>---------------------- set master page for admin

router.use((req, res, next) => {
    res.locals.layout = 'admin/master';
    next();
})

//>---------------------- Controller

const adminController = require("app/http/controllers/admin/adminController");
const courseController = require("app/http/controllers/admin/courseController");

//>---------------------- Admin routes

router.get('/', adminController.index);

router.get('/course', courseController.index);
router.get('/course/create', courseController.create);


//>---------------------- module export
module.exports = router;