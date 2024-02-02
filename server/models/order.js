import mongoose from 'mongoose';


const orderSchema = new mongoose.Schema({
    coinId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'coins'
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    orderId : {
        type : String,
        required : true
    },
    paymentId : {
        type : String,
    },
    amount : {
        type : Number,
        required : true
    },
    isPaymentDone : {
        type : Boolean,
        required : true
    }
},
{
    timestamps: true,
})

const Order = mongoose.model('order',orderSchema);

export default Order;