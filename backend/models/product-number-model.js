const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productNR = new Schema({
    nr: {type:Number, required:true}
})

module.exports = mongoose.model('CurrentNr',productNR);
    