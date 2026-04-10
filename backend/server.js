import app from './app.js';
import dotenv from 'dotenv';
import { connectMongoDatabase } from './config/db.js';
import {v2 as cloudinary} from 'cloudinary';

dotenv.config({path:'backend/config/config.env'})
connectMongoDatabase();
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET

})
process.on('uncaughtException',(err)=>{
    console.log(`Error :${err.message}`);
    console.log(`server is shotting down due to uncaught exception errors`);
    process.exit(1);
})
const port =process.env.PORT || 3000;




const server= app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})

process.on('unhandledRejection',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Server is shutting Down, Due to unhandled promise rejection`);
    server.close(()=>{
        process.exit(1)
    })
})