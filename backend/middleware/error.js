import HandleError from "../utils/handleError.js";

export default (err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "internal server Error";
    // CastError
    if(err.name==='CastError'){
        const message= `this is invalid server${err.path}`;
        err=new HandleError(message,404)
    }
    //duplicat key error
    if(err.code===11000){
        const message=`this ${Object.keys(err.keyValue)} already registered.please login to coninue`
        err=new HandleError(message,400);
    }
    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}