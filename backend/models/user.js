const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {type : String, require:true},
    email : {type : String, require:true, unique: true},
    password : {type : String, require:true, minlength: 6},
    image : {type : String, require:true},
    places : {type : String, require:true},
});

module.exports = mongoose.model('User', userSchema);