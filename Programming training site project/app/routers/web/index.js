const express = require("express");
const router = express.Router();

//>---------------------- middleware

const redirectAuthenticated = require("app/http/middleware/redirectAuthenticated");
const redirectNotAdmin = require("app/http/middleware/redirectNotAdmin");

//>---------------------- Admin route

const adminRouter = require("./admin");
router.use("/admin", redirectNotAdmin.handle, adminRouter);

//>---------------------- Home route

const homeRouter = require("./home");
router.use("/", homeRouter);

//>---------------------- Auth Router

const authRouter = require("app/routers/web/auth");
router.use('/auth', redirectAuthenticated.handle, authRouter);

//>---------------------- module export

module.exports = router;