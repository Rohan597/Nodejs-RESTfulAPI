const express = require('express');

const router = express.Router();
// const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const ProductController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function(req, file, cb)  {      // destination properties which is the function which defines where to store the incoming files and
                                                //  & get access(req) to the folder request in this function to file(file) you callback(cb)
        cb(null, './uploads/');     //execute cb in the end and queue it to pass the potential err and the path where you wanna stores
    },
    filename: function(req, file, cb) {     // which how the file name should be named multer will execute this function whenever a file is recieved
        const now = new Date().toISOString();
        const date = now.replace(/:/g, '-');
        cb(null, date + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    // accept a file
        cb(null, true);
    } else {
    // reject a file
        cb(null, false);
    }           
}; 
const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});          //execute multer like this basically initialize it
// const Product = require('../models/product');

//not use /products as it'll then try to fit /products/products
//  following get method is general where we get all products we have

router.get("/", ProductController.products_get_all);  

router.post("/", checkAuth, upload.single('productImage'), ProductController.products_create_product); 

router.get("/:productId", ProductController.products_get_product); 


router.patch("/:productId", checkAuth, ProductController.products_update_product); 


router.delete("/:productId", checkAuth, ProductController.products_delete); 

module.exports = router; 