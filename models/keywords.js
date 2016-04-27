var mongoose = require('mongoose');

var keywordsSchema = mongoose.Schema({
    productid : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],//For ProductPage
    keyword : String,
    metadescription : String,
    searchpageid:String,
    resourcetype:String
});

module.exports = mongoose.model('Keywords', keywordsSchema);
