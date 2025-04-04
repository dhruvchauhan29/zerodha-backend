const {Schema}=require("mongoose");

const OrdersSchema=new Schema({
    name: String,
    quantity: Number,
    price: Number,
    mode: String,
});

module.exports={OrdersSchema};