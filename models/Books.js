const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    name: {type: String},
    author: {type: String},
    pages: {type : Number, min: 10},
    timeStamp: {type: Number}
});

module.exports = mongoose.model('book',bookSchema);