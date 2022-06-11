const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueString = require('unique-string');
const schema = mongoose.Schema;

//>----------------------- create model of course

const courseSchema = schema({

    user: {
        type: schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        trim:true,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    images: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    tags: {
        type: String,
        required: true
    },
    time: {
        type: String,
        default: '00:00:00'
    },
    viewCount: {
        type: String,
        default: 0
    },
    commentCount: {
        type: String,
        default: 0
    },

}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);