const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://arunvt123:Arunvt2255@cluster0.7mjgbld.mongodb.net/lilacDB?retryWrites=true&w=majority')
const Schema = mongoose.Schema
const productSchema = new Schema({
    productName:{type:String},
    productDetails:{type:String},
    profileImg:{type:String},
    productPrice:{type:String},
    totalStocks:{type:String}
})
var productTable = mongoose.model('productTable',productSchema)
module.exports = productTable