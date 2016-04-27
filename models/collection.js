var mongoose = require('mongoose');

var collectionSchema = mongoose.Schema({
    collectionname : String,
    ownerid : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], //String,
    createdon : String
});

module.exports = mongoose.model('Collection', collectionSchema);
