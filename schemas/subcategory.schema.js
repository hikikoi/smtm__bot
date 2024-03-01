const {Schema, default: mongoose} =  require("mongoose");

const SubcategorySchema = new mongoose.Schema({
    id:{
        type: Number,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    category_id : {
        type: Number,
        required: true
    }
})

const Subcategory = mongoose.model("Subcategory", SubcategorySchema);
module.exports = Subcategory;