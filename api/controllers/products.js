const mongoose = require('mongoose');
const Product = require('../models/product');

exports.products_get_all =(req, res, next) => {
    // res.status(200).json({
    //     message : 'handling GET requests to /products'
    // });
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then( docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                      return {
                          name: doc.name,
                          price: doc.price,
                          productImage: doc.productImage,
                          _id: doc._id,
                          request: {       //JSONbject 
                              type: 'GET',
                              url: "http://localhost:3000/products/" + doc._id
                          }
                      }
                })
            }
            // console.log(docs);
            // if (docs.length >=0 ) {
                res.status(200).json(response);
            
            // } else {
            //     res.status(404).json({
            //         message: 'no entries were found'
            //     });
            // }
            
        })
        .catch (err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
            
        });
}

exports.products_create_product = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
        .save()
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
        .then(result => {
            console.log(result);
            res.status(201).json ({
                message : 'Created Product Successfully',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: "http:localhost3000/products/" + result._id

                    }

                }
         })
        // .catch(err => {
        //     console.log(err);
        //     res.status(500).json({
        //         error: err
        //     });
        // });   
    });

}

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;

    // following comments are the dummy code to get te products you entered
    // if (id === 'special') {
    //     res.status(200).json ({
    //          message: 'you discovered a special id',
    //          id: id
    //         });
    //     } else {
    //         res.status(200).json({
    //             message:'you passed an ID'
    //         });
    //     }


    // using the Product model which is the object imported at the start line,
    //  so we wont have to create a new one instead have a statics methods on this Object called findBtId()

    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log("from Database", doc);
            if(doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                    Types: 'GET',
                    url: "http://localhost:3000/products"
                    }
                });
            } else {
                res.status(404).json({message: 'no valid entry found for provided ID'});
            }
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error : err
            });

        }); 
}

exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value; // this would give us the objct than in the end would have the following down code form req.body.newName/newPrice but only the operation which e want to perform
    }
    Product.update({_id: id}, { $set: updateOps //object which would have no key/value pairs if we somehow sent patch request without the payload then it shouldnt change anything 
        // we might just change the name or just the price
    //     {  // $set special property name which is a JSObject which describe how to update this (understood by mongoose) to then pass another object as a value to pass them where you descrbe key value pair how to update
    //     name: req.body.newName,
    //     price: req.body.newPrice
    // }
     })
        .exec()
        .then(result => {
            // console.log(result);
            res.status(200).json({
                message: 'product updated',
                request: {
                    type: 'GET',
                    url: "http://localhost:3000/products/" + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

}

exports.products_delete = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id : id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product Deleted',
                request: {
                    type: 'POST',
                    url: "http://localhost3000/products",
                    body: { name: 'String', price: 'Number'}
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}