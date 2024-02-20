import Razorpay from "razorpay";
import Order from "../models/order.js";
import crypto from 'crypto';
import User from "../models/user.js";
import { sendMail } from "../utils/sendMail.js";
import Coin from "../models/coin.js";

export const checkout = async(req,res) => {
    try {

        const instance = new Razorpay({ key_id: process.env.RAZORPAY_API_KEY , key_secret: process.env.RAZORPAY_API_SECRET })
        
        const {coinId,userId,amount,orderId} = req.body

        const checkisNew = await Order.findOne({orderId})

        console.log(checkisNew);

        if (checkisNew) {
            await Order.findByIdAndDelete(checkisNew._id);
        }

        // console.log(coinId,userId,amount,orderId);
        const options = {
            amount: Number(amount * 100),
            currency: "INR",
        };

        const order = await instance.orders.create(options);

        await Order.create({
            coinId,
            userId,
            orderId:order.id,
            amount,
            isPaymentDone:false
        })

        return res.status(200).json({
            success : true,
            order
        })

    } catch (error) {
        console.log(error);
    }
}


// export const paymentVerification = async(req,res) => {

//     console.log(req.body);

//     const {razorpay_payment_id,razorpay_order_id,razorpay_signature} = req.body;

//     console.log(razorpay_payment_id,razorpay_order_id,razorpay_signature);

//     const data = razorpay_order_id + "|" + razorpay_payment_id;

//     const generated_signature = crypto.createHmac('sha256',process.env.RAZORPAY_API_SECRET)
//     .update(data)
//     .digest("hex");
    

//     if (generated_signature === razorpay_signature) {

//         // await Payment.create({
//         //     razorpay_order_id,
//         //     razorpay_payment_id,
//         //     razorpay_signature,
//         //   });
        
//         console.log("payment is successful")

//         res.redirect(`http://localhost:3000/paymentsuccess?referenceId=${razorpay_payment_id}`)
//     }
//     else{
//         res.redirect(`http://localhost:3000/paymentfailure`)
//     }
    
// }

export const paymentVerification = async(req,res) => {
    // console.log(req.body);

    const {razorpay_payment_id,razorpay_order_id,razorpay_signature} = req.body;
    // console.log(razorpay_payment_id,razorpay_order_id,razorpay_signature);

    const data =razorpay_order_id + "|" + razorpay_payment_id;

    const generated_signature = crypto.createHmac('sha256',process.env.RAZORPAY_API_SECRET)
    .update(data)
    .digest("hex");    

    if (generated_signature === razorpay_signature) {
        const updated = await Order.findOneAndUpdate({orderId:razorpay_order_id},{paymentId:razorpay_payment_id,isPaymentDone:true},{new:true})

        // console.log(updated);

        const coinData = await Coin.findById(updated.coinId,{name:true,description:true,material:true});
        const userData = await User.findById(updated.userId,{name:true,email:true});

        const text = `Dear ${userData.name},

        We are delighted to inform you that we have received your payment for the auctioned coin. The coin will be delivered to you within the next few days. Please find below the details of your purchase:
        
        Coin Name: ${coinData.name}
        Description: ${coinData.description}
        Material: ${coinData.material}
        Your Winning Bid: ${updated.amount}
        Payment Id: ${updated.paymentId}
        Delivery Address: address
        
        Thank you for your participation and congratulations on your winning bid! Should you have any questions or require further assistance, please do not hesitate to contact us.
        
        Best regards,
        Coin Auction Website Team`;

        const html = `<!DOCTYPE html>
        <html>
        <head>
            <title>Payment Confirmation and Delivery Details</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
        
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 5px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
        
                h1 {
                    color: #333333;
                }
        
                p {
                    color: #555555;
                    margin-bottom: 10px;
                }
        
                ul {
                    list-style-type: none;
                    padding: 0;
                }
        
                li {
                    margin-bottom: 5px;
                }
        
                .footer {
                    margin-top: 20px;
                    text-align: center;
                    color: #999999;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Payment Confirmation and Delivery Details</h1>
                <p>Dear ${userData.name},</p>
                <p>We are delighted to inform you that we have received your payment for the auctioned coin. The coin will be delivered to you within the next few days. Please find below the details of your purchase:</p>
                <ul>
                    <li><strong>Name:</strong> ${coinData.name}</li>
                    <li><strong>Description:</strong> ${coinData.description}</li>
                    <li><strong>Material:</strong> ${coinData.material}</li>
                    <li><strong>Your Winning Bid:</strong> ${updated.amount}</li>
                    <li><strong>Payment Id:</strong> ${updated.paymentId}</li>
                    <li><strong>Delivery Address:</strong> address</li>
                </ul>
                <p>Thank you for your participation and congratulations on your winning bid! Should you have any questions or require further assistance, please do not hesitate to contact us.</p>
                <p class="footer">Best regards,<br/>Coin Auction Website Team</p>
            </div>
        </body>
        </html>
        `;

        sendMail(userData.email,' Payment Confirmation and Delivery Details',text,html);
        
        res.redirect(`http://localhost:3000/paymentsuccess?referenceId=${razorpay_payment_id}`)
    }
    else{
        return res.json({
            success :false
        })
    }
    
}


export const getKey = (req,res) => {
    return res.status(200).json({
        key : process.env.RAZORPAY_API_KEY
    })
}