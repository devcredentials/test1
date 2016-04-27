var mongoose = require('mongoose');

var userassetSchema = mongoose.Schema({
    userid : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    productid : {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    collectionid : {type: mongoose.Schema.Types.ObjectId, ref: 'Collection'},
    storeid : {type: mongoose.Schema.Types.ObjectId, ref: 'Store'}
});

module.exports = mongoose.model('Userasset', userassetSchema);
