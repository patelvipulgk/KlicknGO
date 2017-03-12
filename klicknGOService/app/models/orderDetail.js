var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var orderDetailSchema = new Schema({
    productId: String,
    quantity: String,
    orderId: String,
    price: String
},{
timestamps: true
});

module.exports = mongoose.model('orderDetail', orderDetailSchema);