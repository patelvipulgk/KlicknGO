var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var orderSchema = new Schema({
    customerId: String,
    total: String,
    conversationId: String
},{
timestamps: true
});

module.exports = mongoose.model('order', orderSchema);