var mongoose = require('mongoose');

var productSchema = mongoose.Schema({
    sourceurl : String,
    image : String,
    title : String,
    description : String,
    details : String,
    category : String,
    categorytype : String,
    parentcategory : String,
    currency : String,
    oldprice : String,
    price : String,
    discount : String,
    sizes : String,
    addedby : String, //String,
    keywords : String, //String,
    addedon : String
});

module.exports = mongoose.model('Product', productSchema);



// 1 SourceURL
// 2 Product Image url
// 3 Title
// 4 Description
// 5 Details
// 6 Category
// 7 Category Type
// 8 Parent Category
// 9 Currency
// 10  Old Price
// 11  New Price
// 12  Discount
// 13  Sizes
// 14  addedby
// 15  keywords
// 16  addedon
