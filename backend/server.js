import express from "express";
import data from "./data.js";
import cors from "cors";


const app = express();

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 
}

app.get("/", (req,res) => {
    res.send("Server is up and running...");
})

app.get("/api/product", (req,res) => {
    res.send(data.products);
})

app.get("/api/product/slug/:slug", (req,res) => {
    const product = data.products.find(pro => pro.slug === req.params.slug);
    if(product)
        res.send(product);
    else
        res.status(404).send({message: "Product not found"});
})
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is up at http://localhost:${PORT}`);
})