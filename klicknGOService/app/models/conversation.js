var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var conversationSchema = new Schema({
    from_id: String,
    to_id: String,
    con_id: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Conversation', conversationSchema);;