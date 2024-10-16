const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type:String} ,
    position: {type:String},
    salary:{type:Number} 
})

module.exports=  mongoose.model('employees',employeeSchema);