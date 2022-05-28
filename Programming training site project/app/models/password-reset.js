const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueString = require('unique-string');


//>----------------------- creat model of user

const passwordReset = mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    token: {
        type: String,
        require: true
    },
    use: {
        type: Boolean,
        default:false
    }


}, { timestamps: { updatedAt: false } });



//>----------------------- export model user by schema method

module.exports = mongoose.model('PasswordReset', passwordReset);