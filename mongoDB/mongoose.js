const mongoose = require('mongoose');

const Product = require('./models/product');

mongoose.connect(
    'mongodb://localhost:27017/products_test'
).then(()=>{
    console.log('Connected to mongo successfully');
}).catch((er)=>{
    console.log(er.message)
});

const createProduct = async (req, res, next) => {
    const createdProduct = new Product({
        name: req.body.name,
        price: req.body.price
    });
    const result = await createdProduct.save();
    res.json(result);
}

const getProducts = async (req, res, next) => {
    const products = await Product.find().exec()
    res.json(products)
}
exports.createProduct = createProduct;
exports.getProducts = getProducts;