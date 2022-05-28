const chalk = require("chalk");
const express = require('express');
const path = require("path");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");
const appConfig = require("./configs/app");
const weather = require("./tools/weather");
const morgan = require("morgan"); 
const indexRouter = require("./router/index");
const app = express()
require("./configs/db");
const port = process.env.PORT || appConfig.port;
const publicDirectoryPath = path.join(__dirname, "/public");
const viewDirectoryPath = path.join(__dirname, "/template");
const partialDirectoryPath = path.join(viewDirectoryPath, "/partials");
//--------------------------------------------------------------------------//
app.use(express.static(publicDirectoryPath));
app.set('view engine', 'hbs');
app.set("views", viewDirectoryPath);
app.use(express.json());
app.use(cookieParser());
//------------------------------------------------------//
const log = (req, res, next) => {                        //
    console.log(chalk.bgBlue("Logging routes" + req.originalUrl));//-- middleware--
    next();                                              //
}                                                        //
//-------------------------------------------------------//
//*************************************************************************//
app.use(log);                                                           //
//*************************************************************************//
//-----------------------------------------//
app.use(morgan('dev'));                            //--morgan--
//-----------------------------------------//
//*************************************************************************//
console.log(chalk.red.bgWhite("app test"));
hbs.registerPartials(partialDirectoryPath);

app.use("/", indexRouter);

//-------------------------------Error handling------------------------------//
app.use((err, req, res, next) => {
    res.status(err.status ? err.status : 500).json({
        status: err.status ? err.status : 500,
        message: err.message ? err.message : "Something wrong ! Please rty again later..."
    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})