const express = require("express");


const router = express.Router();

const usersControllers = require('../controllers/users-controllers')


router.get('/:id', usersControllers.getUserById)


module.exports = router;