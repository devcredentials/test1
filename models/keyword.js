var mongoose = require('mongoose');

var keywordSchema = mongoose.Schema({
    productid : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],//For ProductPage
    searchpageid:String,
    l1keywords : String,
    l2keywords : String,
    l3keywords : String
});

module.exports = mongoose.model('Keyword', keywordSchema);
