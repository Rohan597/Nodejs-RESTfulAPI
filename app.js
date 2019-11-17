const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products'); 
const orderRoutes = require('./api/routes/orders'); 
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb+srv://Rohan_nodejs_shop_api:' + process.env.MONGO_ATLAS_PW + '@node-rest-shop-iyett.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
// mongoose.set('useUnifiedTopology', true);
// mongoose.set('useNewUrlParser', true);
mongoose.Promise = global.Promise;      
app.use(morgan('dev'));
app.use('/uploads/', express.static('uploads'));     // make the upload folder availabe to everyone
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Aceess-Control-Allow-Headers", "Origin, X-Requested, Content-Type, Accept, Authorization");
    if(req.method === 'OPTIONS') {
        res.header('Acces-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});

    }
    next();
});
// anythings starting with /products in the url wll beb forwrded to products.js router.get

// routes which should handle request
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);


app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
// app.use((req, res, next) => {
//     res.status(200).json ({
//         message : 'It Works!'
//     });
// });

 
module.exports = app;