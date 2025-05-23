const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;

const dbConnect = ()=>{
  mongoose.connect(MONGO_URI).then(()=>{
    console.log('MongoDB connected Successfully');
  }).catch(()=>{
    console.log('Error connecting to MongoDB');
  })
}

module.exports = dbConnect