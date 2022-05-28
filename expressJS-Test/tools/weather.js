const axios = require("axios");
const async = require("hbs/lib/async");
const apiKey = "763ba1857034f679e92de11c07138010";
const apiAddress = "http://api.weatherstack.com/current";
const getWeather = async (city = "Tehran") => {
    const data = await callApi(city);
    // console.log(data);
    return data;
    
}

const callApi = async (city) => {
    console.log(city);
    const endPoint = `${apiAddress}?access_key=${apiKey}&query=${city}`;
    const response = await axios.get(endPoint);
    return response.data;
    //  axios.get(endPoint).then((response) => {
    //     console.log(response.data);
    //     return response.data;
        
    // })
}

const weatherObj = {
    getWeather,
    callApi
};


module.exports = weatherObj;