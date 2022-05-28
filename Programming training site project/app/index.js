const express = require("express");
const app = express();
const http = require("http");
const chalk = require("chalk");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const validator = require("express-validator");
const session = require("express-session");
const mongoose = require("mongoose");
const passPort = require("passport");
const flash = require("connect-flash");
const morgan = require("morgan");
const helpers = require('./helpers');
const rememberLogin = require('app/http/middleware/rememberLogin');

//>----------------------module export

module.exports = class Application {
    constructor() {
        this.setupExpress(); //set setup express.JS
        this.setMongoConnection(); //set mongoDB connection
        this.setConfig(); //set config project
        this.setConfigMorgan(); //set config PG morgan
        this.setRouter(); //set router app
    }

    //>-------------------- method setup express

    setupExpress() {

        const server = http.createServer(app);
        server.listen(config.port, () => {
            console.log(chalk.bgCyan(`Listening on port ${config.port}`));
        });

    }

    //>---------------------- set mongoDB connection

    setMongoConnection() {

        mongoose.Promise = global.Promise;
        mongoose.connect(config.database.url);

    }

    //>---------------------- set router app

    setRouter() {
        app.use(require("app/routers/api"));
        app.use(require("app/routers/web"));
    }

    //>---------------------- set config PG morgan

    setConfigMorgan() {
        const log = (req, res, next) => {
            console.log(chalk.bgBlue("Logging routes" + req.originalUrl));
            next();
        }
        app.use(log);
        app.use(morgan("dev"));
    }

    //>---------------------- method set config express

    setConfig() {

        require('app/passport/passport-local');
        require('app/passport/passport-google');

        app.use(express.static(config.layout.public_drc)); // set static file in folder public(example image,...)
        app.set('view engine', config.layout.view_engin); // template engine install ejs
        app.set('views', config.layout.view_drc); // set view file in folder views
        app.use(config.layout.ejs.expressLayouts); //set master page layouts
        app.set('layout', config.layout.ejs.master); //set page layout
        app.set("layout extractScripts", config.layout.ejs.expressScripts);
        app.set("layout extractStyles", config.layout.ejs.expressStyles);

        app.use(bodyParser.json()); //adjust the bodyParser 
        app.use(bodyParser.urlencoded({ extended: true })); //set urlencoded : true 
        app.use(validator()); //set middleware of validator
        app.use(session({ ...config.session }));
        app.use(cookieParser(config.cookieSecretKey)); //set middleware of cookieParser
        app.use(flash()); //set middleware of flash
        app.use(passPort.initialize());
        app.use(passPort.session());
        app.use(rememberLogin.handle);

        //>--------------------- creat middleware for checking the login user

        app.use((req, res, next) => {
            app.locals = new helpers(req, res).getObjects();
            next();
        });


    }
}