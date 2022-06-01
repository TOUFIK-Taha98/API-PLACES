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

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let places;
    try {
        places = await Place.find({creator: userId}).exec();
    } catch (err) {
        const error = new HttpError(
            'Fetching places failed, please try again later',
            500
        );
        return next(error);
    }
    
    if(!places || places.length === 0){
        return next(
            new HttpError(
                'Could not find places for the provided User Id', 
                404
            )
        );
    }

    res.json({ places : places.map(place => place.toObject({getters: true}))})
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

const updatePlace= async (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError(
            'Invalid inputs passed, please check your data', 
            422
        );
    }
    
    const placeId = req.params.id
    const { title, description } = req.body;
    
    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update !',
            500
        )
        return next(error);
    }
    
    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update place',
            500
        )    
        return next(error);
    }

    res.status(200).json({place : place.toObject({getters: true})});
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
