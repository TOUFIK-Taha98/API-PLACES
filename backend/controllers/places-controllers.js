const uuid = require('uuid').v4;

const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error');
const getCoordsForAdress = require('../util/location')

const Place = require('../models/place');

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

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.id;
    console.log(placeId)
    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError(
            'something went wrong, count not find a place.',
            500
        );
        return next(error)
    }

    if(!place){
        const error = new HttpError(
            'Could not find a place for the provided Id.', 
            404
        );
        return next(error)
    }
    
    res.json({ place : place.toObject( {getters: true})})
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

const addNewPlace = async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors);
        next( new HttpError("Invalid inputs passed, please check your data", 422));
    }
    
    const {title, description, address, creator} = req.body;

    let coordinates;
    try {
        coordinates = await getCoordsForAdress(address)
    } catch (error) {
        return next(error);
    }

    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: 'https://azurplus.fr/wp-content/uploads/Quest-ce-quune-URL-Uniform-Resource-Locator.png',
        creator
    })
    try {
        await createdPlace.save();
    } catch (err) {
        const error = new HttpError(
            'Creating place failed, please try again',
            500
        );
        return next(error)
    }

    res.status(201).json(createdPlace)
}

const updatePlace= (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError("Invalid inputs passed, please check your data", 422);
    }
    
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
    if(!DUMMY_PLACES.find(p => p.id === placeId)){
        throw new HttpError("Could not find the place for that id", 404);
    }
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.placeId !== placeId);

    res.status(200).json({message : 'Deleted place.'})
}
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.addNewPlace = addNewPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
