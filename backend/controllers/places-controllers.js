const uuid = require('uuid').v4;

const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error');


let DUMMY_PLACES = [
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

const getPlaceById = (req, res, next) => {
    const placeId = req.params.id;
    const place = DUMMY_PLACES.find(p => p.id === placeId)

    if(!place){
        throw new HttpError('Could not find a place for the provided Id.', 404);
    }
    
    res.json(place)
};

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;

    const places = DUMMY_PLACES.filter(p => p.creator === userId)
    
    if(!places || places.length === 0){
        return next(
            new HttpError('Could not find places for the provided User Id', 404)
        );
    }

    res.json(places)
};

const addNewPlace = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError("Invalid inputs passed, please check your data", 422);
    }
    
    const {title, description, coordinates, address, creator} = req.body;
    const createdPlace = {
        id: uuid(),
        title,
        description,
        location: {
            lat : coordinates.lat,
            lng : coordinates.lng
        },
        address,
        creator
    }
    DUMMY_PLACES.push(createdPlace);
    res.status(201).json(createdPlace)
}

const updatePlace= (req, res, next) => {
    const placeId = req.params.id
    const { title, description } = req.body;
    
    const updatedPlace = {...DUMMY_PLACES.find(p => p.id === placeId)};
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId)
    
    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMY_PLACES[placeIndex] = updatedPlace;

    res.status(200).json({place : updatedPlace});
}

const deletePlace = (req, res, next) => {
    const placeId = req.params.id;

    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.placeId !== placeId);

    res.status(200).json({message : 'Deleted place.'})
}
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.addNewPlace = addNewPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
