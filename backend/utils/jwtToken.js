export const sendToken=(user,statusCode,res)=>{
    const token=user.getJWTToken();

    //option for cookies
    const options ={
        expires:new Date(Date.now()+parseInt(process.env.EXPIRE_COOKIE, 10)*24*60*60*1000),
        httpOnly:true
    }
    res.status(statusCode)
    .cookie('token',token,options)
    .json({
        success:true,
        user,
        token
    })
}