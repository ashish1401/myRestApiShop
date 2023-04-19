const express = require('express');
const orderRoute = express.Router();
const mongoose = require('mongoose');
const Order = require("../models/orders.js");
const Product = require("../models/products");
const checkAuth = require("../middleware/check-auth.js");


orderRoute.get("/", checkAuth, function (req, res, next) {
    Order.find({}).populate("product", "name price").exec().then(resp => {
        res.status(200).json(
            {
                count: resp.length,
                orders: resp.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        link: "localhost:3000/products/" + doc.product._id
                    }
                })
            }
        );
    }).catch(err => {
        res.status(500).json({
            error: err,
        })
    })
})

orderRoute.post("/", function (req, res, next) {
    // let product = {};
    // (Product.findOne({ _id: req.body.productID }).then(resp => { product = resp; }));
    // console.log(product)

    //logic to make sure an order of invalid order id isnt posted 

    Product.findById(req.body.productID).then(
        product => {
            const order = new Order({
                quantity: req.body.quantity,
                product: req.body.productID,
            })
            return order.save().then(resp => {
                res.status(200).json({
                    message: 'Order Received',
                    newOrder: {
                        _id: resp._id,
                        product: resp.product,
                        quantity: resp.quantity,
                        message: {
                            type: "GET",
                            link: "localhost:3000/orders/" + resp._id
                        }

                    }
                })
            })
        }
    )
        .catch(err => {
            res.status(500).json({ message: 'Product not listed', error: err })
        })
    // res.status(200).json({
    //     order: order,
    // })
})

orderRoute.get("/:orderID", function (req, res, next) {
    Order.findById({ _id: req.params.orderID }, { __v: 0 }).populate("product").exec().then(resp => {
        if (!resp) {
            res.status(404).json({
                message: "Invalid Order Id"
            })
        }
        res.status(200).json(
            {
                orderId: resp._id,
                productId: resp.product,
                quantity: resp.quantity,

            }
        )
    }).catch(err => {
        res.status(500).json({ error: err })
    })
})

orderRoute.delete("/:orderID", function (req, res, next) {
    Order.deleteOne({ _id: req.params.orderID }).exec().then(resp => {
        res.status(200).json({
            result: resp,
            info: {
                type: "GET",
                url: "localhost/3000/orders",
                message: "order deleted successfully"
            }
        })
    }).catch(err => {
        res.status(500).json({
            error: err,
        })
    })
})

module.exports = orderRoute;
