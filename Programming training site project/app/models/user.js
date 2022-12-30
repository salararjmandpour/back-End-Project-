const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueString = require('unique-string');


//>----------------------- create model of user

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: 0
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rememberToken: {
        type: String,
        default: null
    }

}, { timestamps: true });

//>------------------------ Generate a hashed password register form

userSchema.pre('save', async function (next) {
    if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 10);
    next();
});
//>------------------------ Generate a hashed password reset password

userSchema.pre('findOneAndUpdate', function (next) {

    this.getUpdate().$set.password = bcrypt.hashSync(this.getUpdate().$set.password, 10);
    next();
});

//>------------------------ check compare password : method 

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

//>------------------------ set remember token for user : method

userSchema.methods.setRememberToken = function (res) {
    const token = uniqueString();
    res.cookie('remember_token', token, { maxAge: 1000 * 60 * 60 * 24 * 1, httpOnly: true, signed: true });
    this.updateOne({ rememberToken: token }, err => {
        if (err) console.log(err);
    })
}


//>----------------------- export model user by schema method

module.exports = mongoose.model('User', userSchema);