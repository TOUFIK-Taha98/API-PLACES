const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
    let users;

    try {
        users = await User.find({}, '-password'); // -password to get user without password
    } catch (err) {
        const error = new HttpError(
            'Fetching users failed, please try again later.',
            500
        );
        return next(error);
    }
    res.json({users : users.map(user => user.toObject({ getters: true}))});
}

const getUserById = async (req, res, next) => {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if(!user){
        throw new HttpError("User doesn't exist!" , 404)
    }
    res.json(user)
}



const signup = async (req, res , next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return next(
            new HttpError("Invalid inputs passed, please check your data", 422)
        );
    }

    const { name, email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({email : email});
    } catch (err) {
        const error = new HttpError(
            'Sign up failed, please try again later.',
            500
        )
        return next(error);
    }
    if(existingUser){
        const error = new HttpError(
            'User exists already, please login instead.',
            422
        )
        return next(error);
    }

    let hashedPassword;
    try{
        hashedPassword = await bcrypt.hash(password, 12);

    }catch(err){
        const error = new HttpError(
            'Could not create user, please try again.',
            500
        )
        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        image:'www.image.com/images',
        password: hashedPassword,
        places: []
    })
    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
            'Sigin up failed, please try again',
            500
        )
        return next(error);
    }

    let token;
    try{
        token = jwt.sign(
            {userId:createdUser.id, email:createdUser.email},
            "supersecret", 
            {expiresIn:'1h'}
        );
    }catch(err){
        const error = new HttpError(
            'Sigin up failed, please try again',
            500
        )
    }

    res.status(201).json({
        userId : createdUser.id, 
        email: createdUser.email, 
        token: token
    });
}

const login = async (req, res, next) => {
    const {email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email : email});
    } catch (err) {
        const error = new HttpError(
            'Logging failed, please try again later.',
            500
        )
        return next(error);
    }

    if(!existingUser){
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            403
        )
        return next(error);
    }

    let isValidPassword = false;
    try{
        isValidPassword = await bcrypt.compare(password, existingUser.password);

    }catch(err){
        const error = new HttpError(
            'Could not log you in, please check your credentials and try again',
            500
        )
        return next(error);
    }
    if(!isValidPassword){
        const error = new HttpError(
            'Could not log you in, please check your credentials and try again',
            401
        )
        return next(error);
    }
    
    let token;
    try{
        token = jwt.sign(
            {userId:existingUser.id, email:existingUser.email},
            "supersecret", 
            {expiresIn:'1h'}
        );
    }catch(err){
        const error = new HttpError(
            'Logging failed, please try again',
            500
        )
    }
    res.json({
        userId : existingUser.id,
        email : existingUser.email,
        token: token,
        name: existingUser.name
    })
}
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.signup = signup;
exports.login = login;