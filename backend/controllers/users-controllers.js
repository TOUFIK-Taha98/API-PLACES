const uuid = require('uuid').v4;

const HttpError = require('../models/http-error');


let DUMMY_USERS = [
    {
        id: 'u1', 
        name :'Taha',
        age : 23,
    },
    {
        id: 'u2', 
        name :'YASSIN',
        age : 33,
    },
    {
        id: 'u3', 
        name :'Amine',
        age : 30,
    }
]
const getUsers = (req, res, next) => {
    if(!DUMMY_USERS){
        throw new HttpError("No users" , 404)
    }
    res.json({users : DUMMY_USERS});
}

const getUserById = (req, res, next) => {
    const userId = req.params.id;
    const user = DUMMY_USERS.find(u => u.id === userId);

    if(!user){
        throw new HttpError("User doesn't exist!" , 404)
    }
    res.json(user)
}

const signup = (req, res , next) => {
    const { name, email, password } = req.body;

    const hasUser = DUMMY_USERS.find(e => e.email === email);
    if(hasUser){
        throw new HttpError("Could not create user, email alredy exists!", 422);
    }

    const createdUser = {
        id : uuid(),
        name,
        email,
        password
    }
    DUMMY_USERS.push(createdUser);

    res.status(201).json(createdUser);
}

const login = (req, res, next) => {
    const {email, password} = req.body;

    const identifiedUser = DUMMY_USERS.find(u => u.email === email)
    if(!identifiedUser || identifiedUser.password != password){
        throw new HttpError("Could not identify user, credentials seem to be wrong", 404);
    }
    res.json({message : "Logged in!"})
}
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.signup = signup;
exports.login = login;