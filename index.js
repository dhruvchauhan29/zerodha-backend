require("dotenv").config();

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const {HoldingsModel}=require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const bodyParser=require("body-parser");
const cors=require("cors");
const cookieParser = require("cookie-parser");
const authRoute= require("./Routes/AuthRoute");

const PORT=process.env.PORT || 3002;
const uri=process.env.MONGO_URL;

app.use(cors({
    origin: 'https://zerodha-dashboard-1.onrender.com', // Your front-end URL
    credentials: true // Allow credentials to be sent
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use("/", authRoute);

app.get("/allHoldings",async(req,res)=>{
    let allHoldings=await HoldingsModel.find({});
    res.json(allHoldings);
});
app.get("/allPositions",async(req,res)=>{
    let allPositions=await PositionsModel.find({});
    res.json(allPositions);
});
app.get('/test', (req, res) =>{
    res.send('Server is running');
});
console.log('MONGO_URL:', process.env.MONGO_URL);
app.listen(PORT,()=>{
    console.log("app started");
    try {
        
        mongoose.connect(uri);
        console.log("DB connected");
    } catch (error) {
        console.log(error.message);
    }
});