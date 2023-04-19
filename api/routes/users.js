const express = require('express');
const bcrypt = require('bcrypt');
const userRoute = express.Router();
const mongoose = require('mongoose');
const Order = require("../models/orders.js");
const Product = require("../models/products");
const User = require("../models/users.js");
const jwt = require('jsonwebtoken');
require("dotenv").config();
userRoute.post("/signup", function (req, res, next) {
    User.find({ email: req.body.email })
        .exec()
        .then(resp => {
            if (resp.length >= 1) {
                res.status(409).json({
                    error: "User Already Exists",
                })
            } else {
                bcrypt.hash(req.body.password, 10, function (err, hash) {  //we either get the error or the hashed password
                    if (err) {
                        res.status(500).json({
                            error: err,
                        });
                    } else {
                        const entry = new User({
                            email: req.body.email,
                            password: hash,
                        })
                        entry.save()
                            .then(resp => {
                                console.log(resp);
                                res.status(201).json({
                                    message: "User Created",
                                })
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err,
                                })
                            });
                    }
                    //security flaw: password stored as it is in database if we use passwor:req.body.password
                    //and hence we need to decrypt it hence we hash it 
                })
            }
        })
}


)
userRoute.post("/login", function (req, res, next) {
    //id user logs in we create a jwt for em 
    User.find({ email: req.body.email })
        .then(user => {
            //the following method  avoids any brute forcr attacks by distinguishing unavailabilty of mail id as Auth failed , so pass could be wrong 
            if (user.length < 1) {
                // console.log(1);
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            }
            //we compare the newly recieved pasword with old hashed password as follows
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    console.log("x");
                    return res.status(401).json({
                        message: "Auth Failed"
                    });
                }
                if (result) {
                    // console.log(3);
                    const token = jwt.sign(
                        //payload
                        { email: user[0].email, userId: user[0].__id },
                        //secret key
                        process.env.JWT_KEY,
                        //options
                        { expiresIn: "1h" },
                        //callback function that returns are anonymous function --> can initialise the function instead 
                    )
                    return res.status(200).json({
                        //we want to return a web token here so we use node jsonwebtoken pkg
                        message: "Auth Successful",
                        token: token, //the token is encoded not encrypted 
                        //go to jwt.io for more!!!
                    });
                }
                // console.log(4);
                res.status(401).json({
                    message: 'Auth Failed'
                });
            })
        }
        )
})
userRoute.delete("/:userId", function (req, res, next) {
    User.deleteOne({ _id: req.params.userId }).exec() //safe as the userId can only be obtained on loggin in
        .then(resp => {
            res.status(200).json({
                message: "User deleted successfully",
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err,
            })
        })
})

module.exports = userRoute;