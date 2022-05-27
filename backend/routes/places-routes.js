const express = require("express");


const router = express.Router();

const placesControllers = require('../controllers/places-controllers')


router.get('/:id', placesControllers.getPlaceById)

router.get('/user/:uid', placesControllers.getPlaceByUserId)

router.post('/', placesControllers.addNewPlace)

module.exports = router;