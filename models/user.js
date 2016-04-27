// app/models/user.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        displayName  : String,
        firstName    : String,
        lastName     : String,
        gender       : String,
        picture      : String
    },
    dateofcreation: { type: Date, default: Date.now },
    status: { type: String, default: '1' },//  [ 0-Deleted 1-Active 2-Inactive 3-Banned ]
    role: { type: String, default: '1' },// [ 0-Admin 1-User ]
    displayimage : String,
    displayname : String,
    primaryemail : String
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
