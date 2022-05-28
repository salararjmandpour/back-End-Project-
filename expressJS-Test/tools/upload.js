const multer = require("multer");

const uploadTools = {};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './files')
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.originalname);
    }

})

uploadTools.upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if ((file.originalname.split(".")[file.originalname.split(".").length - 1]) != "jpg") {
            cb(new Error("Incorrect format 😱"));
            console.log("Incorrect format!");
        } else {
            cb(null, true);
            console.log(file.originalname.split(".")[file.originalname.split(".").length - 1]);
        }
    },
    limits: {

        fileSize: 1000 * 100
    }
});


module.exports = uploadTools;