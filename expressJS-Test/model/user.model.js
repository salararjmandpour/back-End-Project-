var validator = require('validator');
const mongoose = require("mongoose");
const chalk = require("chalk");
const bcrypt = require("bcryptjs");
const Task = require('./task.model');
const Session = require('./session.model');
//----------------------------------insert model User------------------------------//
const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "client"],
        default: "client",
        required: true
    },
    age: {
        type: Number,
        min: [0, "Path age is less than minimum allowed value (0)"],
        max: [100]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        minLength: 4,
        trim: true,
        lowercase: true,
        validate(value) {
            if (value.toLowerCase().includes("admin") || value.toLowerCase().includes("root")) {
                throw new Error(chalk.red("userName includes invalid words "));
            }
            return true;
        }
        // validate: {
        //     validator: (userName) => {
        //         if (userName.length > 4) {
        //             return true
        //         } else {
        //             throw new Error(chalk.red("userName is lower than 5 characters..."));
        //         }
        //     }
        // }
    },
    email: {

        type: String,
        required: true,
        validate: {
            validator: (email) => {
                if (!validator.isEmail(email)) {
                    throw new Error(chalk.red("email format is not Correct :("));
                }
                return true;
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        trim: true
    }

},
    {
        toJSON: {
        virtual:true
        },
        timestamps:true
    }
    
);

//------------------------------to json js and deleted privet method--------------------------------//
UserSchema.methods.toJSON =  function () {
    const objectData = this.toObject();
    delete objectData.__v;
    delete objectData.isActive;
    delete objectData.password;
    return objectData;
}
//-------------------------------------------hash password save--------------------------------------//
UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 10);
    next();
});
//-------------------------------------------hash password update--------------------------------------//
UserSchema.pre("findOneAndUpdate", async function (next) {
    console.log(this._update);
    if (this._update.password && this._update.password.trim().length > 7) {
        this._update.password = await await bcrypt.hash(this._update.password, 10);
    }
    else {
        delete this._update.password;
    }
    next();
});
//----------------------------------delete the task after the user deleted--------------------------------//
UserSchema.post('findOneAndDelete', async function (deletedUser){
    await Task.deleteMany({ user: deletedUser._id });
    await Session.deleteMany({ user: deletedUser._id });
})
//-------------------------------------check password whit hash password----------------------------------//
UserSchema.statics.findForLogin = async function (userName, password) {
    const user = await this.findOne({ userName });
    if (!user) return;
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) throw new Error(chalk.red("User and Password is not Matched :("));
    return user;
}

//--------------------------------------------------------------------------------------------
UserSchema.virtual('tasks', {
    ref: "Tasks",
    localField: '_id', // Of task collection
    foreignField:'user' // Of user collection
})
//----------------------------------------------------------------------------------------------------//
module.exports = mongoose.model("User", UserSchema); 