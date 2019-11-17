const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');


exports.orders_get_all = (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product', 'name')        //name of the propert you wanna populate (the name of your ref property) //mongoose automatically populate alll of them
        .exec()
        .then(docs =>{
        //     res.status(200).json(docs);
        // })
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: "http://localhost:3000/orders/" + doc._id
                        }
                    }
                })

            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });

    // general get Router
    // res.status(200).json({
    //     mesage: 'Orders were fetched'

    // });
}


exports.orders_create_order = (req, res, next) => { 
    Product.findById(req.body.productId)
        .then(product => {
            if(!product) {
                return res.status(404).json({
                    message: 'Product Not Found'
                });
            };
            const order = new Order ({ 
                _id:mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
                // product: req.body.productId         // need to be the id of the product we're connect to
            // })
            return order
                .save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Orders Stored',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: "http://localhost:3000/orders/" + result._id
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

  // default dummy response used previously
    // router.post("/", checkAuth, (req, res, next) => {
    //     res.status(201).json({
    //     message: 'order was created',
    //     order: order
    // });   
    //  const order = new Order({
    //      _id:mongoose.Types.ObjectId(),
    //      quantity: req.body.quantity,
    //      product: req.body.productId
    //  });
    //  order
    //     .save()
    //     .then(result => {
    //         console.log(result);
    //         res.status(201).json({
    //             message: 'Order Created',
    //             CreatedOrder: {
    //                 _id: result._id,
    //                 product: result.Product,
    //                 quantity: result.quantity
    //             },
    //             request: {
    //                 type: 'GET',
    //                 url: "http://localhost:3000/orders/" + result._id
    //             }
    //         });
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.status(500).json({
    //             error: err
    //         });
    //     });


exports.orders_get_order = (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('product')
        .exec()
        .then(order => {
                if(!order) {
                    return res.status(404).json ({
                        message: 'Orders Not found'
                    });
                }
                res.status(200).json ({
                Order: order,
                request: {
                    type: 'GET',
                    url: "http://localhost:3000/orders"
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });

        });
    // res.status(200).json({
    //     mesage: 'Orders Details',
    //     orderId: req.params.orderId
    // });
}

exports.orders_delete_order = (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then(order => {
            res.status(200).json ({
                message: 'Order Deleted',
                request: {
                    type: 'POST',
                    url: "http://localhost:3000/orders",
                    body: {productId: 'ID', quantity: 'Number'}
                }
            });
        })    
        .catch(err => {
            res.status(500).json({
                error: err
            });

        });
    // res.status(200).json({
    //     message: 'Orders Deleted',
    //     orderID: req.params.orderID
    // });
}