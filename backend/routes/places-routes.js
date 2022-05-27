const express = require("express");

const HttpError = require('../models/http-error');

const router = express.Router();

const placesControllers = require('../controllers/places-controllers')


router.get('/:id', placesControllers.getPlaceById)

router.get('/user/:uid', placesControllers.getPlaceByUserId)

module.exports = router;