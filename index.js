const http = require('http');
const { dirname } = require('path');
const port = process.env.PORT || 3000;
const app = require(__dirname + '/app.js')
const server = http.createServer(app);
//creates a web server where app is a request  handler function 
//we pass a listener --> a fucntion  executed when we enter a new request and it sends a response
//exprss fucntion app acts as a request handler -->request is send to http and express confirms if one is recieved or not 

//CREATE A HTTP SERVER
// const myServer = http.createServer(function(req,res){
//     console.log("New Req Rcvd");
// })

//CREATE A MULTI ROUTE SETUP USING NODEJS : switch case n use req.url  
server.listen(port) 