import mongoose from 'mongoose';

const coinSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  material: {
    type: String,
    required: true,
  },
  image : String,
  auctionStartDateAndTime: {
    type: Date,
    required: true,
  },
  auctionDuration: {
    type: String,
    required: true,
  },
  initialPrice: {
    type: Number,
    required: true,
  },
  seller :{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  offer : {
    type: Number,
  },
  isAcceptedByAdmin: {
    type: Boolean,
    default: false,
  },
  isUpcoming: {
    type: Boolean,
    default: true,
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', 
  },
  noOfparticipatedUsers : Number,
  topTenBidders: {
    type: [
      {
        // _id: false, // <-- This prevents Mongoose from adding _id to subdocuments
        bidder: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users', 
        },
        bidAmount: {
          type: Number,
          required: true,
        },
      },
    ],
    validate: [(arr) => arr.length <= 10, '{PATH} exceeds the limit of 10'],
  },
  participants:[String
      // {
      //   participant: {
      //     type : mongoose.Schema.Types.ObjectId,
      //     ref:'users',
      //   }
      // }
      ],
});

const Coin = mongoose.model('Coin', coinSchema);

export default Coin;
