# Shop - REST API

An E-Commerce Restful API that can be integrated with a frontend to create an Organized database of listed products as well as orders with certain routes being protected from the client.
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`JWT_KEY`

`MONGO_URL`


## Tech Stack

**Client:** None

**Server:** Node, Express, MongoDB

**Dependencies/Other Frameworks:** Mongoose, Multer, Body Parser, Morgan, JWT, bcrypt .....


## API Reference
After running the system on your Localhost, send the following API Requests via Postman
#### Get all products

```http
  GET /products
```



#### Get item

```http
  GET /products/${id}
```

and so on...


