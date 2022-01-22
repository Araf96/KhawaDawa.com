const _ = require('lodash')

const CONFIG = require('../config');
const {mongoose} = require('./../db/mongoose');
const utils = require('../utils/utils');

var FoodMenuObj = {
    merchantID : {
        type: String,
        required: [true, "Merchant ID missing"]
    },
    companyName: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: null
    },
    createdBy:{
        type: String,
        default: null
    },
    name:{
        type: String,
        required: [true, "You must provide a name of your menu"]
    },
    itemList:{
        type: Array,
        default: []
    },
    price:{
        type: Number,
        default: 0.00
    },
    tag:{
        type: String,
        default: null
    },
    isHidden:{
        type: Boolean,
        default: false
    },
    currency:{
        type: String,
        default: "BDT"
    }

}

var foodMenuSchema = mongoose.Schema(FoodMenuObj);

foodMenuSchema.methods.toJSON = function() {
    var menu = this;
    return _.pick(menu, ['_id','name', 'itemList', 'price', 'currency','tag']);
}

var FoodMenu = mongoose.model('FoodMenu', foodMenuSchema);

module.exports = {FoodMenu};