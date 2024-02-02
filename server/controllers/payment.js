import Razorpay from "razorpay";
import Order from "../models/order.js";
import crypto from 'crypto';

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
    console.log(req.body);

    const {razorpay_payment_id,razorpay_order_id,razorpay_signature} = req.body;
    // console.log(razorpay_payment_id,razorpay_order_id,razorpay_signature);

    const data =razorpay_order_id + "|" + razorpay_payment_id;

    const generated_signature = crypto.createHmac('sha256',process.env.RAZORPAY_API_SECRET)
    .update(data)
    .digest("hex");    

    if (generated_signature === razorpay_signature) {
        const updated = await Order.findOneAndUpdate({orderId:razorpay_order_id},{paymentId:razorpay_payment_id,isPaymentDone:true},{new:true})

        // console.log(updated);
        // console.log("payment is successful")

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