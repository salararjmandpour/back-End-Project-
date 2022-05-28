
const accessController = {};

accessController.checkAdminRoleMiddleware = (req, res, next) => {
    if (req.user.role === "admin") {
        return next();
    }

    return res.sendStatus(403);
}
//-----middleware for  delete and update  all user by admin and delete and update client by for client------//
accessController.checkUserRoleAccessForDeleteAndUpdateUserData = (req, res, next) => {
    if (req.user.role !== "admin" && req.params.id === "me") {
        res.locals.userId = req.user._id;
        return next();
    } if (req.user.role === "admin") {
        res.locals.userId = req.params.id;
        return next();
    }

    return res.sendStatus(403);
}

module.exports = accessController;