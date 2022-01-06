const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/KhawaDawa_dot_com').then(()=>{
    console.log("Database is connected");
});

module.exports = {mongoose}