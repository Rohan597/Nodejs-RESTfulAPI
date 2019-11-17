const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },        // ref to  configure this type hold the string with the name of the model you wanna connect this model to.
    quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model('Order', orderSchema);