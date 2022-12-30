const multer = require('multer');
const mkdirp = require('mkdirp');
const fs = require('fs');

//>------------------------- set public folder by date

const getDirImage = () => {

    let yare = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let day = new Date().getDay();
    return `./public/uploads/images/${yare}/${month}/${day}`;
}

const ImageStorage = multer.diskStorage({

    destination: (req, file, cb) => {

        let dir = getDirImage();

        mkdirp(dir).then(err => cb(null, dir));

    },

    filename: (req, file, cb) => {
        // console.log(file);
        let filePath = getDirImage() + '/' + file.originalname;
        if (!fs.existsSync(filePath)) return cb(null, file.originalname);
        cb(null, file.originalname + '-' + Date.now());


    },
});

const uploadImage = multer({ 

    storage: ImageStorage,
    limits: {
        fileSize: 1024 * 1024 * 20
    }
});


module.exports = uploadImage;
