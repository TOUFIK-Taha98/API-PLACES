const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require('mongoose');
const cors = require('cors')
const placesRoutes = require('./routes/places-routes')
const usersRoutes = require('./routes/users-routes')
const HttpError = require('./models/http-error')
const app = express();

app.use(bodyParser.json())
app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Controll-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Request-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE');

    next();
})

app.use('/api/places', placesRoutes) 
app.use('/api/users', usersRoutes) 


app.use((req, res, next) => {
    const error = new HttpError('Could not find this route!.',404);
    throw error;
  });

app.use((error, req, res, next) => {
    if(res.headerSent){
        return next(error)
    }
    res.status(error.code || 500);
    res.json({message : error.message || 'An unknow error occured!'});
})

mongoose
    .connect('mongodb+srv://taha:taha123@cluster0.osxrutg.mongodb.net/places?retryWrites=true&w=majority')
    .then(() => {
        app.listen(5000, ()=> console.log('Connected to mongoose and listenning on 5000'))
    })
    .catch(err => {
        console.log(err)
    });
