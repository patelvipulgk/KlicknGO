var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var orderSchema = new Schema({
    customerId: String,
    total: Boolean,
    conversationId: String
},{
timestamps: true
});

module.exports = mongoose.model('order', orderSchema);