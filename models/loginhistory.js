var mongoose = require('mongoose');

var loginSchema = mongoose.Schema({
    userid : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], //String,
    logintime : Date,
    logouttime : Date
});

module.exports = mongoose.model('Login', loginSchema);
