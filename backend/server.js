import express from "express";
import data from "./data.js";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import seedRouter from "./routes/seedRoutes.js";
import productRouter from "./routes/productRoutes.js";

dotenv.config();
console.log(process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to DB');
}).catch(err => {
    console.log("Error : ", err.message);
})


const app = express();
app.use('/api/seed', seedRouter);
app.use('/api/product', productRouter);

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 
}

app.get("/", (req,res) => {
    res.send("Server is up and running...");
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is up at http://localhost:${PORT}`);
})