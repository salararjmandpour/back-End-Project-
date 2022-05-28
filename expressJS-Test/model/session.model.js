var validator = require('validator');
const mongoose = require("mongoose");
const chalk = require("chalk");
//----------------------------------insert model Session------------------------------//
const Session = mongoose.model("Session", {
    session: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.ObjectId,
        ref: "User",
        required:true
    }
});
//----------------------------------------------------------------------------------------------------//
module.exports = Session;