const axios = require('axios');
const HttpError = require('../models/http-error');
const API_KEY = 'AIzaSyAeowJ4ZqxFkWR3SWFtwP5mxwsYbZDclrg';


async function getCoordsForAdress(address){
    const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}` ;
    const response = await axios.get( URL )

    const data = response.data;

    if(!data || data.status === "ZERO_RESULTS"){
        const error = HttpError(
            "Could not find location for the specified address.",
            422
        )
        throw error;
    }

    const coordinates = data.results[0].geometry.location;

    return coordinates;
}

module.exports = getCoordsForAdress;

