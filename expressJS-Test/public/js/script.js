// const { response } = require("express");
// console.log("hello word!");
const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const locationPlace = document.querySelector('#location');
const temperature = document.querySelector('#temperature');
weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const location = search.value;
    locationPlace.textContent = `Searching for ${location} weather`;
    fetch(`${window.location.href}/${location}`).then((response) => {
        if (response.ok) {
            response.json().then((result) => {
                locationPlace.textContent = `Weather of ${result.location.name} is: ${result.current.weather_descriptions[0]}`;
                temperature.textContent = `Temperature is "${result.current.temperature}"`;
                document.getElementById('icon').src = result.current.weather_icons[0];
                console.log(result);
            })
        } else {
            locationPlace.textContent = `Permission denied for weather ${location}`;
        }

    })

})