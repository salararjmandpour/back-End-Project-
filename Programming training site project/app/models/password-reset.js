const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueString = require('unique-string');


//>----------------------- creat model of user

const passwordReset = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    use: {
        type: Boolean,
        default:false
    }


}, { timestamps: { updatedAt: false } });



//>----------------------- export model user by schema method

module.exports = mongoose.model('PasswordReset', passwordReset);