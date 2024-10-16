const mongoose = require('mongoose')

const db = mongoose.connect('mongodb+srv://root:root@cluster0.y97dq.mongodb.net/abcCompany?retryWrites=true&w=majority&appName=Cluster0',
{ useNewUrlParser:true,useUniFiedTopology:true})

    .then(() => console.log('Connected!')); 

    module.exports= db