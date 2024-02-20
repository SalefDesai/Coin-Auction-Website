import express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import user from './routes/user.js';
import coins from './routes/coins.js';
import payment from './routes/payment.js'
import { auctionSocketio } from './socket/auctionSocket.js';
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware.js';
import Razorpay from 'razorpay';
import cron from 'node-cron';

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();
app.use(express.json({limit:'5mb'}));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
}));



const httpServer = createServer(app);
const io = new Server(httpServer
  , {
  cors:{
    origin :"http://localhost:3000",
    credentials:true,
    methods:["GET","HEAD","PUT","PATCH","POST","DELETE"]
  }
}
)


export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET
});


app.use("/userauth",user);
app.use("/coin",coins);
app.use("/api/payment",payment)


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("connected to mongodb..."))
.catch((error) => console.log("error : ", error));


auctionSocketio(io);

// cron.schedule('* * * * *',() => {
//   console.log("running/...................")
// }, {
//   scheduled: true,
//   timezone: "Asia/Kolkata"
// })


app.use(errorHandlerMiddleware);

httpServer.listen(port,() => console.log(`server is running on port ${port}`))
