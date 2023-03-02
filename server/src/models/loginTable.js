const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://arunvt123:Arunvt2255@cluster0.7mjgbld.mongodb.net/lilacDB?retryWrites=true&w=majority')
const Schema = mongoose.Schema
const loginTableSchema = new Schema({
    mobileNumber:{type:String},
    password:{type:String}
})
var loginTable = mongoose.model('loginTable',loginTableSchema)
module.exports = loginTable