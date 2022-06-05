const express = require("express");

const { check } = require("express-validator");

const router = express.Router();

const placesControllers = require('../controllers/places-controllers')

const checkAuth = require('../middleware/check-auth');

router.get('/', placesControllers.getAllplaces)
router.get('/:id', placesControllers.getPlaceById)

router.get('/user/:uid', placesControllers.getPlacesByUserId)

// after the two first routes we want to implement middleware to check token validation
router.use(checkAuth);

// All the routes that are in the bottom are protected and can 
// only be reached with a valid token

router.post('/', [
    check('title').not().isEmpty(),
    check('description').isLength({min:5}),
    check('address').not().isEmpty()
    ], 
    placesControllers.addNewPlace)

router.patch('/:id', [
    check('title').not().isEmpty(),
    check('description').isLength({min:5}),
    ], placesControllers.updatePlace)

router.delete('/:id', placesControllers.deletePlace)

module.exports = router;