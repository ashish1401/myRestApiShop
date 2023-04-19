const express = require('express');
const productRoute = express.Router();
const Product = require("../models/products.js")
const multer = require('multer');
const checkAuth = require('../middleware/check-auth.js')
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads/')
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname)
    }
})

const fileFilter = function (req, file, callback) {
    if (file.mimetype == -'image/jpeg' || file.mimetype === 'image/png') {
        callback(null, true); //stores the file 
    } else {
        callback(null, false); //does not store the file 
    }
}

const upload = multer({ storage: storage });

//to add limits to the file being uploaded

// const upload = multer({storage:storage,limits:{fileSize:1024*1024*5,fileFilter:fileFilter}})

//sub package 
//allows us to reach various endpoints

//can remove .exec() 


//to enable authorization we use a middleware that check whether it makes sense to pass through a given route and process it 

productRoute.get('/', function (req, res, next) {
    Product.find({}, { __v: 0 }).exec().then(resp => {
        res.status(200).json({
            // message: "Handling GET Request",
            products: resp,
        })
    })
})
productRoute.post('/', checkAuth, upload.single('productImage'), function (req, res, next) {
    console.log(req.file);
    // console.log({
    //     "name": req.body.name,
    //     "price": req.body.price
    // })
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path, //courtsey multer
    });
    product.save()
        .then(function (resp) {
            console.log(resp);
            res.status(201).json({
                message: "Product Saved",
                product: product
            })
        })
        .catch(function (err) { res.status(500).json({ error: err }); })
})
productRoute.get('/:productID', function (req, res, next) {
    const id = req.params.productID;
    Product.findById(id).exec().then((resp) => {
        console.log(resp);
        if (resp) { //if the given id exists response is given
            res.status(200).json({
                // message: "Handling Get Request",
                product: resp,
            })
        }
        else { res.status(404).json({ message: 'No valid entry found for the given ID' }) }
    }).catch(err => { res.status(505).json({ error: err }) });

    // we may add a return statement in case another resoponse is to be added
})
productRoute.patch('/:productID', checkAuth, function (req, res, next) {
    const id = req.params.productID;
    //need to recieve an array of object with operations
    const patchOps = {};
    for (const ops of req.body) {
        //our goal is store the updated operations in form of an object and pass it to $set
        //we do this by taking patch req in form of an array
        //the body array will have objects having the propName to be changed and value to be changed
        //then we create key with the same propName in patchops and assign value to it
        //BODY EXAMPLE OF THE PATCH REQUEST
        // {propName:name,value:19}

        patchOps[ops.propName] = ops.value;
    }

    Product.updateOne({ _id: id }, { $set: patchOps }).then(resp => {
        if (resp.deletedCount === 0) {
            res.status(200).json(
                resp
            )
        } else (res.status(400).json({ error: "Invalid ID" }))
    }).catch(err => {
        res.status(500).json({
            error: err,
        })
    })
    // res.status(200).json({
    //     product_id: id,
    //     status: "updated",
    // })
    // we may add a return statement in case another resoponse is to be added
})
productRoute.delete('/:productID', function (req, res, next) {
    const id = req.params.productID;
    Product.deleteOne({ _id: id })
        .exec()
        .then(resp => {
            res.status(200).json(resp)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        })

    // res.status(200).json({
    //     product_id: id,
    //     status: "deleted",
    // })
    // we may add a return statement in case another resoponse is to be added
})

//wont post to a particular product
module.exports = productRoute;