var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var conversationReplySchema = new Schema({
    reply: String,
    from_id: String,
    to_id: String,
    con_id: String,
	from_id_read: {type: Number, default: 0},
    to_id_read: {type: Number, default: 0},
    from_id_del: {type: Number, default: 0},
    to_id_del: {type: Number, default: 0},
    type: {
        type: String,
        enum: ['PRODUCT', 'DAFAULT'],
        default: 'DAFAULT'
    },
	created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ConversationReply', conversationReplySchema);