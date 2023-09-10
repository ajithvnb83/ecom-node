const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgon = require("morgan");
const mongoose = require("mongoose");

// middleware
app.use(bodyParser.json());
app.use(morgon("tiny"));

const productSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: {type:Number, required:true},
});

const productModel = mongoose.model("product", productSchema);

require("dotenv/config");

const api = process.env.API_URL;
mongoose
    .connect(process.env.CONNECT)
    .then(() => {
        console.log("Database connected");
    })
    .catch((e) => {
        console.log("something went wrong");
    });

app.post(`${api}/products`, (req, res) => {
    const product = productModel({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock,
    });
    product
        .save()
        .then((createdProduct) => {
            res.status(201).json(createdProduct);
        })
        .catch((e) => {
            res.status(500).json({
                error: e,
                success: false,
            });
        });
});

app.get(`${api}/getproducts`, async(req, res)=>{
    const productList = await productModel.find();
    res.status(200).json(productList);
});

app.listen(3000, () => {
    console.log(api);
    console.log("something");
});
