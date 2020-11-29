const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const mySchema = new Schema({
    redirect: {type: String, required: true},
    short: String,
    count: {type: Number, default: 0},
})
module.exports = mongoose.model("Shortener", mySchema);