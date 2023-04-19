const mongoose = require('mongoose');
const ProductSchema = {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    productImage: { type: String, required: true }
}
const Product = mongoose.model("product", ProductSchema);

module.exports = Product;