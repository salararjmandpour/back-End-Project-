const express = require('express');
const router = express.Router();
const weather = require("../tools/weather");
//----------------------------- has a function is for not search london------------------------//
const weatherPolicy = (req, res, next) => {
    if (req.params.city === "london") return res.sendStatus(403);
    next();
}
//-----------------------------method GET-------------------------------------//
router.get('/', async (req, res) => {
    const data = await weather.getWeather();
    res.render("weather", {
        title: "Weather Page",
        h1Title: "Get Weather"
        // content:`${data.location.name} temperature is "${data.current.temperature}" `
    });
});
//--------------------------method GET CITY----------------------------------//
router.get('/:city', weatherPolicy, async (req, res) => {
    const data_ = await weather.getWeather(req.params.city);
    res.send(data_);
    // res.render("basePage", {
    //     title: "Weather Page",
    //     h1Title: `Weather Of ${req.params.city}`,
    //     content:`${data_.location.name} temperature is "${data_.current.temperature}"`
    // });
});

//--------------------------------------------------------------------------------//
module.exports = router;