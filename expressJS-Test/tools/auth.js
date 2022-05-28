const Session = require("../model/session.model");
const jwt = require("jsonwebtoken");
const appConfig = require("../configs/app");
const uuid = require("uuid");
const { token } = require("morgan");
const RefreshToken = require("../model/refreshToken.model");
const chalk = require("chalk");
//-----------------------------------------async , await--------------------------------------------//
const isLoginBySession = async (req, res, next) => {
    // console.log(req.cookies.session);
    try {

        if (!req.cookies.session) {
            return res.sendStatus(401);
        }
        const session = await Session.findOne({ session: req.cookies.session }).populate('user', '_id role isActive')
        if (!session) {
            return res.sendStatus(401);
        }
        req.user = session.user;
        return next();

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};
//---------------------------------------------isLoginByJwt-----------------------------------//
const isLoginByJwt = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.sendStatus(401);
        }
        const user = await jwt.verify(req.headers.authorization, appConfig.JWTsecret, async (err, token) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    if (!req.cookies.session) {
                        throw {
                            status: 423,
                            message: "Your Token Expired 😵"
                            // originError:err
                        }
                    }
                    const refreshToken = await RefreshToken.findOne({ refreshToken: req.cookies.session }).populate('user');
                    if (!refreshToken) {
                        throw {
                            status: 423,
                            message: "Your Token Expired 😵"
                            // originError:err
                        }
                    }
                    console.log(chalk.bgRed("create new token"));
                    refreshToken.refreshToken = uuid.v4();
                    refreshToken.token = createToken(refreshToken.user);
                    await refreshToken.save();
                    res.cookie('session', refreshToken.refreshToken, { maxAge: appConfig.sessionTime });
                    res.setHeader("authorization", refreshToken.token);
                    return refreshToken.user;
                } else {
                    throw {
                        status: 403,
                        message: "Invalid Token 😵"
                    }
                }
            } else {
                return token.user;
            }
        });
        req.user = user;
        return next();
    } catch (err) {
        console.table(err);
        return next(err);
    }
}
//-------------------------------------------------------------------------------------------//
const createTokenForLogin = async (user, res) => {
    try {
        const token = createToken(user);
        const refreshToken = new RefreshToken({
            refreshToken: uuid.v4(),
            token,
            user: user._id
        });
        await refreshToken.save();
        res.cookie("session", refreshToken.refreshToken, { maxAge: appConfig.sessionTime });
        res.setHeader("authorization", refreshToken.token);
        // return refreshToken;
    } catch (err) {
        throw err;
    }
}
//------------------------------------------------------------------------------------------//
const createToken = (user) => {

    return jwt.sign({ user }, appConfig.JWTsecret, { expiresIn: appConfig.jwtTime });

}
//--------------------------------------------No populate------------------------------------//
// User.findById(session.user).exec((err, user) => {
//     if (err) {
//         console.log(err);
//         return res.sendStatus(500);
//     }
//     if (!user) {
//         return res.sendStatus(401);
//     }
//     // console.log(session);
//     req.user = user;
//     return next();
//     
// });



module.exports = {
    isLoginBySession,
    isLoginByJwt,
    createTokenForLogin
};