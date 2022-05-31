const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const URL_DB = process.env.URL_DB;

const createProduct = async ( req, res, next) => {

};

const getProducts = async ( req, res, next) => {

};

exports.createProduct = createProduct;
exports.getProducts = getProducts;