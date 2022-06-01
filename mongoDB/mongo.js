const e = require('express');

const MongoClient = require('mongodb').MongoClient;

const url =
  'mongodb+srv://toufik_taha98:XTJl4WCzkNoqdCeo@cluster0.osxrutg.mongodb.net/?retryWrites=true&w=majority';

const createProduct = async (req, res, next) => {
  const newProduct = {
    name: req.body.name,
    price: req.body.price
  };
  console.log(newProduct);
  const client = new MongoClient(url);
  
  try {
    await client.connect();
    const db = client.db();
    console.log(db.collection('products'));
    const result = db.collection('products').insertOne(newProduct);
  } catch (error) {
    return res.json({message: e.message});
  };
  client.close();

  res.json(newProduct);
};

const getProducts = async (req, res, next) => {};

exports.createProduct = createProduct;
exports.getProducts = getProducts;

