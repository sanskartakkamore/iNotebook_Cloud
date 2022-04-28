const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/inotebook?directConnection=true"
const connectToMongo = () => {
    mongoose.connect(mongoURI ,()=>{
        console.log("Conncted to Mongo Successfully");
    })
    
}
module.exports = connectToMongo;