const express = require('express');
const jwt = require("jsonwebtoken");
const RefreshToken = require("../model/refreshToken.model");
const appConfig = require("../configs/app")
const router = express.Router();
const { isLoginBySession, createTokenForLogin, isLoginByJwt } = require("../tools/auth");
const Users = require("../model/user.model");
const uuid = require("uuid");
const chalk = require("chalk");
const Session = require('../model/session.model');
const bcrypt = require("bcryptjs");
//----------------------------method loginBySession user-----------------------------//
router.post("/login", async (req, res) => {
    try {
        // console.log(req.cookies); 
        if (!req.body || !req.body.password || !req.body.userName) return res.sendStatus(400);
        // const hashedString = await bcrypt.hash("02081374salAr", 10);
        // console.log("02081374salAr", hashedString);
        const user = await Users.findForLogin(req.body.userName, req.body.password);
        if (!user) return res.sendStatus(404);

        const session = uuid.v4();
        res.cookie("session", session, { maxAge: appConfig.sessionTime });
        const newSession = new Session({
            session,
            user: user._id
        });

        await newSession.save();
        res.json(user);

    } catch (error) {
        console.log(error);
        return res.status(500).send("Invalid Password 🙄");
    }

});

//-----------------------------------method logoutBySession user---------------------------------//
router.post("/logout", isLoginBySession, async (req, res, next) => {
    try {
        if (req.user) {
            await Session.findOneAndRemove({ user: req.user._id });
            res.clearCookie("session")
        }
        res.send("Logout User ➥ ").status(200);
    } catch (err) {
        next(err);
    }
})
//--------------------------------------method loginByJWT user------------------------------------//
router.post("/login/jwt", async (req, res) => {
    try {
        // console.log(req.cookies); 
        if (!req.body || !req.body.password || !req.body.userName) return res.sendStatus(400);
        // const hashedString = await bcrypt.hash("02081374salAr", 10);
        // console.log("02081374salAr", hashedString);
        const user = await Users.findForLogin(req.body.userName, req.body.password);
        if (!user) return res.sendStatus(404);

        await createTokenForLogin(user, res);
        // console.log(user);
        res.json(user);

    } catch (error) {
        console.log(error);
        return res.status(500).send("Invalid Password 🙄");
    }

});
//--------------------------------------method logoutByJWT user------------------------------------//
router.post("/logout/jwt", isLoginByJwt, async (req, res, next) => {
    try {
        if (req.user) {
            
            await RefreshToken.findOneAndRemove({ user: req.user._id });
            res.clearCookie("session");
            res.removeHeader("authorization");
            
        }
        res.send("Logout User ➥ ").status(200);
        console.log("Logout User ➥ ");
        res.status(200);

    } catch (err) {
        next(err);
    }
});
//--------------------------------------method POST Register--------------------------------//
router.post("/register", async (req, res) => {
    try {
        if (!req.body || !req.body.firstName || !req.body.lastName || !req.body.userName || !req.body.email || !req.body.password) return res.sendStatus(400);
        const updates = Object.keys(req.body);
        const AllowedToUpdate = ["age", "firstName", "lastName", "userName", "email", "password"];
        const isValidOperation = updates.every(update => AllowedToUpdate.includes(update));
        if (!isValidOperation) {
            console.log(chalk.bgRed("isValidOperation :" + isValidOperation));
            return res.status(400).send("invalid request! 😕");
        }
        const person = new Users(req.body);
        await person.save();
        console.log(person);
        res.send(person);
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send(error.message);
    }

})
//********************************************************************************************//

//--------------------------------------------------------------------------------------------//
module.exports = router;