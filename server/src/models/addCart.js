const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://arunvt123:Arunvt2255@cluster0.7mjgbld.mongodb.net/lilacDB?retryWrites=true&w=majority')
const Schema = mongoose.Schema
const cartSchema = new Schema({
    cartId:{type:Schema.Types.ObjectId,ref:"productTable"},
})
var cartTable = mongoose.model('cartTable',cartSchema)
module.exports = cartTable