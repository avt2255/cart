const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://arunvt123:Arunvt2255@cluster0.7mjgbld.mongodb.net/lilacDB?retryWrites=true&w=majority')
const Schema = mongoose.Schema
const registerSchema = new Schema({
    login_id:{type:Schema.Types.ObjectId,ref:"loginTable"},
    fullName:{type:String},
    mobileNumber:{type:String},
    password:{type:String}
})
var registerTable = mongoose.model('registerTable',registerSchema)
module.exports = registerTable