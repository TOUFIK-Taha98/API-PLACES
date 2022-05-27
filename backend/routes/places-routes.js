const express = require("express");

const router = express.Router();

router.get('/', (req, res, next) => {
    console.log('GET REQUEST in Places');
    res.json({message: "IT WORKS!"})
})

module.exports = router;