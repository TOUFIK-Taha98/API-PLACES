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

const getUserById = (req, res, next) => {
    const userId = req.params.id;
    const user = DUMMY_USERS.find(u => u.id === userId);

    if(!user){
        throw new HttpError("User doesn't exist!" , 404)
    }
    res.json(user)
}

exports.getUserById = getUserById;