var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var productSchema = new Schema({
    name: String,
    availability: Boolean,
    conversationId: String
},{
timestamps: true
});

module.exports = mongoose.model('product', productSchema);