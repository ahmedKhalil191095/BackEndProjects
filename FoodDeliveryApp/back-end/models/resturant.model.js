const mongoose = require('mongoose');

const resturantSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    description: {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    }
});

const Resturant = mongoose.model('Resturant', resturantSchema);
module.exports = Resturant;
