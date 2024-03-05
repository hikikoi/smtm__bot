const {Schema, default: mongoose, mongo, model} =  require("mongoose");

const ProductSchema = new mongoose.Schema({
    id:{
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    desc:{
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    subcategory_id:{
        type: Number,
        required: true
    } ,
    quantity: {
        type: String,
        required: true
    }
})

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;