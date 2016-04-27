var mongoose = require('mongoose');

var storeSchema = mongoose.Schema({
    storename : String,
    ownerid : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],// String,
    isverified : { type: String, default: '0' },
    isclaimed : { type: String, default: '0' },
    createdon : String,
    favicon : String,
    stdescription : String,
    stdisplayname : String
});

module.exports = mongoose.model('Store', storeSchema);
