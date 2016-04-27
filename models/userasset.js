var mongoose = require('mongoose');

var userassetSchema = mongoose.Schema({
    userid : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], //String,
    productid : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],// String,
    collectionid : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],// String,
    storeid : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }] // String
});

module.exports = mongoose.model('Userasset', userassetSchema);
