const MongoClient = require('mongodb').MongoClient;
require('dotenv').config({ path: './.env' });
const MONGO_PASS = encodeURIComponent(process.env.password);
const MONGO_USER = encodeURIComponent(process.env.user);
const cluster = encodeURIComponent(process.env.cluster);
const MONGO_DATABASE = encodeURIComponent(process.env.db_name);
const URL_DB = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${cluster}.osxrutg.mongodb.net/${MONGO_DATABASE}?retryWrites=true&w=majority`;

const createProduct = async ( req, res, next) => {
    const newProduct = {
        name: req.body.name,
        price: req.body.price
    };

    const client = new MongoClient(URL_DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect(); // Se connecter à la BD 
        console.log('Connected correctly to server');
        const db = client.db(); // Récupérer la BD
        console.log(db);
        const result = db.collection('products').insertOne(newProduct); // Inserer dans la BD

    } catch (error) {
        return res.json({message: error.message})
    }
    client.close(); // Fermer la connexion

    res.json(newProduct);
};

const getProducts = async ( req, res, next) => {

};

exports.createProduct = createProduct;
exports.getProducts = getProducts;