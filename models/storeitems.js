var mongoose = require('mongoose');

var storeitemsSchema = mongoose.Schema({
    storeid : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }],
    productid : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    createdon : { type: Date, default: Date.now }
});

module.exports = mongoose.model('Storeitems', storeitemsSchema);
