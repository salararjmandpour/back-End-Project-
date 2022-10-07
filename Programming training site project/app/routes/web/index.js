const express = require("express");
const router = express.Router();

//>---------------------- Amin route

const adminRouter = require("./admin");
router.use("/admin", adminRouter);

//>---------------------- Home route

const homeRouter = require("./home");
router.use("/", homeRouter);

//>---------------------- module export

module.exports = router;