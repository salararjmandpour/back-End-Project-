const express = require("express");
const router = express.Router();


//>---------------------- Controller

const adminController = require("app/http/controllers/admin/adminController");

//>---------------------- Admin routes

router.get('/', adminController.index);

router.get('/course', adminController.course);


//>---------------------- module export
module.exports = router;