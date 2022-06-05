const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error');
const getCoordsForAdress = require('../util/location')

const Place = require('../models/place');
const User = require ('../models/user');
const mongoose = require('mongoose');

const getAllplaces = async (req, res, next) =>{
    const places = await Place.find();
    res.json({places : places.map(p => p.toObject({getters: true}))})
}

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

    //let places;
    let userWithPlaces;
    try {
        //places = await Place.find({creator: userId}).exec();
        userWithPlaces = await User.findById(userId).populate('places');
    } catch (err) {
        const error = new HttpError(
            'Fetching places failed, please try again later',
            500
        );
        return next(error);
    }
    
    //if(!places || places.length === 0){
    if(!userWithPlaces || userWithPlaces.places.length === 0){
        return next(
            new HttpError(
                'Could not find places for the provided User Id', 
                404
            )
        );
    }

    res.json({ places : userWithPlaces.places.map(place => place.toObject({getters: true}))})
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
        creator: req.userData.userId
    })

    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError(
            'Creating place failed, please try again',
            500
        );
        return next(error);
    }

    if(!user){
        const error = new HttpError(
            'Could not find user for provided id',
            404
        );
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({session: sess});
        user.places.push(createdPlace); // Only add the place id
        await user.save({session: sess});
        await sess.commitTransaction();
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
        return next(
            new HttpError(
                'Invalid inputs passed, please check your data', 
                422
            )
        )
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
    //Manage if the user who want to edit is the user that created the place
    if(place.creator.toString() !== req.userData.userId){
        const error = new HttpError(
            'You are not allowed to edit this place',
            401
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

const deletePlace = async (req, res, next) => {
    const placeId = req.params.id;

    let place;
    try {
        place = await Place.findById(placeId).populate('creator'); // populate when we use  the link between the two collections
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete place',
            500
        );
        return next(error);
    }
    if(!place){
        const error = new HttpError(
            'Could not find the place for the id.',
            404
        );
        return next(error);
    }
    //Manage if the user who want to edit is the user that created the place
    if(place.creator.id !== req.userData.userId){
        const error = new HttpError(
            'You are not allowed to delete this place',
            401
        )
        return next(error);
    }
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({session : sess});
        place.creator.places.pull(place); //Remove the place id from the user 
        await place.creator.save({session : sess});
        await sess.commitTransaction();
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete place',
            500
        );
        return next(error);
    }
    res.status(200).json({message : 'Deleted place.'})
}
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.addNewPlace = addNewPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
exports.getAllplaces = getAllplaces;
