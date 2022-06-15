const User = require('app/models/user');
const middleware = require("./middleware");
const fs = require('fs');


class convertFileToField extends middleware {

    handle(req, res, next) {
       

        if (!req.file) req.body.images = undefined;
        req.body.images = req.file.filename;

        next();

    }
}
module.exports = new convertFileToField(); 