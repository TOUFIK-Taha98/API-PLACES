const express = require("express");

const HttpError = require('../models/http-error');

const router = express.Router();

const DUMMY_PLACES = [
    {
        id: 'p1', 
        title :'Empire State Building',
        description : 'One of the most famous sky scrapers in the World!',
        location : {
            lat : 40.7484474,
            lng: -73.9871516
        },
        address : '20 W 34th St, New York, NY 10001',
        creator: 'u1'
    }
]

router.get('/', (req, res, next) => {
    console.log('GET REQUEST in Places');
    res.json({message: "IT WORKS!"})
})
router.get('/:id', (req, res, next) => {
    const placeId = req.params.id;
    const place = DUMMY_PLACES.find(p => p.id === placeId)

    if(!place){
        throw new HttpError('Could not find a place for the provided Id.', 404);
    }
    
    res.json(place)
})

router.get('/user/:uid', (req, res, next) => {
    const userId = req.params.uid;

    const place = DUMMY_PLACES.find(p => p.creator === userId)
    
    if(!place){
        return next(
            new HttpError('Could not find a place for the provided User Id', 404)
        );
    }

    res.json(place)
})
module.exports = router;