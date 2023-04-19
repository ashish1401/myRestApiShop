const mongoose = require('mongoose');
const Product = require(__dirname + "/products.js");
const ProductSchema = {
    name: { type: String, required: true },
    price: { type: Number, required: true },
}
const OrderSchema = {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
    quantity: { type: Number, default: 1 },

}
const Order = mongoose.model("order", OrderSchema);
module.exports = Order;