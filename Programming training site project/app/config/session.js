const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const config = require('./index');

//>-------------------------- object config session

module.exports={
    secret: process.env.SESSION_SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: { expires: new Date(Date.now() + 50000) },
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/nodejscms" })
}