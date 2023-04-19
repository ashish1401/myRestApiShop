const express = require('express');
const bodyParser = require('body-parser');
require("dotenv").config();
const app = express();
const productRoute = require(__dirname + '/api/routes/products');
const orderRoute = require(__dirname + '/api/routes/orders');
const userRoute = require(__dirname + '/api/routes/users');
const morgan = require('morgan');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL);
//we create a middle ware of express sucht that all the incoming requests are passed throught the express server 
//any request recieved forces the server (http) to send it to the express server 

//morgan calls the next function and console logs the https request
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static("uploads")); //is publically available only to urls statring with /upload

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization "
    );
    if (req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE ')
    }
    next();
})


//Routes which should handle requests
app.use('/products', productRoute); //middleware
app.use('/orders', orderRoute);     //middleware
app.use("/users", userRoute)
//TWO CASES ARE POSSIBLE 
// either the route passes through the middlewares
// or the route fails to enter them totally 
//in both cases the below statement would filter all the routes
//which are error hence we target all of them and console log a json

app.use(function (req, res, next) {
    const error = new Error('Not Found Anywhere'); //added message to error
    error.status = 404;
    next(error);
})
//for previously defined errors or database thrown errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message //all automatically gen errors wil have an message 
        }
    })
})


module.exports = app;