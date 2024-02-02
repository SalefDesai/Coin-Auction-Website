import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const isAuthenitcated = async (req,res,next) => {

    const {Coin_Auction_token} = await req.cookies;

    // console.log("Coin_Auction_token : ", Coin_Auction_token);

    if (!Coin_Auction_token) {
        return res.json({
            success : false,
            message : "login first",
        })
    }

    jwt.verify(Coin_Auction_token,process.env.JWT_SECRET, async(err,decodedToken) => {
        if (err) return res.json({
            success : false,
            message : "Invalid token",
        })

        else {
            // console.log("decoded token : ", decodedToken);
            req.user = decodedToken._id;
            // console.log(" user in req while auth ",req.user);
            next();
        }
    });
    


}