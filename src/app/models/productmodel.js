const mongoose = require('mongoose');

const producSchema = new mongoose.Schema({
 
    productName: {
        type: String,
        required: true
    },
    costPrice: {
        type: Number,
        required: true
    },
    salePrice: {
        type: Number,
        required: true
    },
    count: {
        type: Number,
        required: true
    },
    sold:{
        type: Number
    },
    active: {
        type: Boolean,
    },
});

const Products =  mongoose.models.products || mongoose.model("products", producSchema);

module.exports = Products;
