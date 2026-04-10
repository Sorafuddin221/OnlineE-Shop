
import express from 'express';
import product from './routes/productRoutes.js';
import user from './routes/userRoutes.js';
import order from './routes/orderRoutes.js';
import payment from './routes/paymentRoutes.js';
import category from './routes/categoryRoutes.js';
import contact from './routes/contactRoutes.js';
import apiKey from './routes/apiKeyRoutes.js';
import fileUpload from 'express-fileupload';
import errorHandlemiddleware from './middleware/error.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors

dotenv.config({path:'backend/config/config.env'})

const app=express();
//middleware
app.use(cors()); // Use cors middleware
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser())
app.use(fileUpload())
//route
app.use("/api/v1",product)
app.use("/api/v1",user)
app.use("/api/v1",order)
app.use("/api/v1",payment)
app.use("/api/v1",category)
app.use("/api/v1",contact)
app.use("/api/v1",apiKey)



app.use(errorHandlemiddleware)
export default app;