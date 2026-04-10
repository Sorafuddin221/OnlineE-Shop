import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModels.js';
import HandleError from '../utils/handleError.js';
import handleAsyncError from '../middleware/handleAsyncError.js';
import { response } from 'express';


//create new oreder
export const createNewOrder=handleAsyncError(async(req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo,itemPrice,
        taxPrice,shippingPrice,totalPrice}=req.body;
        const order=await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo:{
                status:'pending'
            },
            itemPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            user:req.user._id
        })
        res.status(201).json({
            success:true,
            order
        })
}) 

//getting single order

export const getSingleOrder=handleAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id).populate("user","name email")

    if(!order){
        return next(new HandleError("No order Found",400));
    }
    res.status(200).json({
        success:true,
        order
    })
})
//All my orders
export const allMyOrders=handleAsyncError(async(req,res,next)=>{
    const orders=await Order.find({user:req.user._id});
    if(!orders){
        return next(new  HandleError("no order found",400));

    }
    res.status(200).json({
        success:true,
        orders
    })
})

//getting all orders
export const getAllOrders=handleAsyncError(async(req,res,next)=>{
    const orders=await Order.find();
    let totalAmount=0;
    orders.forEach(order=>{
        totalAmount+=order.totalPrice
    })
    res.status(200).json({
        success:true,
        orders,
        totalAmount
    })
})

//update order status

export const updateOrderStatus=handleAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        return next(new HandleError("No order Found",404));
    }
    if(order.orderStatus==='Delivered'){
        return next(new HandleError ("This order is already deliverd",404));
    }
    await Promise.all(order.orderItems.map(item=>updateQuantity(item.product,item.quantity)))
    order.orderStatus=req.body.status;
    if(order.orderStatus==='Delivered'){
        order.deliveredAt=Date.now();
    }
    await order.save({validateBeforeSave:true})
    res.status(200).json({
        success:true,
        order
    })

})

// Update Order
export const updateOrder = handleAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new HandleError("No order Found", 404));
    }
    if (order.orderStatus === 'Delivered') {
        return next(new HandleError("This order is already delivered", 404));
    }
    order.orderStatus = req.body.orderStatus || order.orderStatus;
    if(req.body.paymentStatus) {
        order.paymentInfo.status = req.body.paymentStatus;
    }
    if (req.body.orderStatus === 'Delivered') {
        order.deliveredAt = Date.now();
        order.paymentInfo.status = 'succeeded'; 
    }
    await order.save({ validateBeforeSave: true });
    res.status(200).json({
        success: true,
        order
    });
});
async function updateQuantity(id,quantity) {
    const product=await Product.findById(id);
    if(!product){
    throw new Error("product not Found");

    }
    product.stock-=quantity
    await product.save({validateBeforeSave:false})
}

//Delete  Order
export const deleteOrder=handleAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        return next(new HandleError("NO order Found",404));
    }
    if(order.orderStatus==='Delivered'){
        return next(new HandleError("this order is already delivered and can not be deleted ",404));

    }
    await Order.deleteOne({_id:req.params.id});
    res.status(200).json({
        success:true,
        message:"Order Deleted Successfully"
    })
})

//Delete  My Order
export const deleteMyOrder=handleAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        return next(new HandleError("NO order Found",404));
    }

    if(order.user.toString() !== req.user._id.toString()){
        return next(new HandleError("You are not authorized to delete this order",401));
    }

    if(order.orderStatus!=='processing'){
        return next(new HandleError("this order is already being processed and can not be deleted ",404));

    }
    await Order.deleteOne({_id:req.params.id});
    res.status(200).json({
        success:true,
        message:"Order Deleted Successfully"
    })
})