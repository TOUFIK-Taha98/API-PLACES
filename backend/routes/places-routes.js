const express = require("express");


const router = express.Router();

const placesControllers = require('../controllers/places-controllers')


router.get('/:id', placesControllers.getPlaceById)

router.get('/user/:uid', placesControllers.getPlacesByUserId)

router.post('/', placesControllers.addNewPlace)

router.patch('/:id', placesControllers.updatePlace)

router.delete('/:id', placesControllers.deletePlace)

module.exports = router;