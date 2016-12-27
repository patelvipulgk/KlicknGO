var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// set up a mongoose model
var IndividualUserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
	created: {
		type : Date
	},
	modified : {
		type : Date, 
		default: Date.now
	}
});
 
IndividualUserSchema.pre('save', function (next) {
    var individualUser = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(individualUser.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                individualUser.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});
 
IndividualUserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};
 
module.exports = mongoose.model('IndividualUser', IndividualUserSchema);