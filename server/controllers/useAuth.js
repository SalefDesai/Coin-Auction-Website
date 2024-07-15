import User from "../models/user.js";
import bcrypt from 'bcrypt';
import { sendCookie } from "../utils/features.js";
import Order from "../models/order.js";
import Coin from "../models/coin.js";
import { sendMail } from "../utils/sendMail.js";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


dotenv.config();

const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });


export const signup = async (req,res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            userProfileImage,
            gender,
            userType,
        } = req.body;

        const checkEmail = await User.findOne({email});

        if (checkEmail) {
            return res.json({
                sucess : false,
                error: "Email already exists",
                message: "The provided email is already registered. Please use a different email or try to log in."
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new User({
            name,
            email,
            password : hashedPassword,
            phone,
            userProfileImage:"",
            gender,
            userType
        });

        const savedUser = await newUser.save();

        const user = {
            userId : savedUser._id,
            name : savedUser.name,
            email : savedUser.email,
            gender : savedUser.gender,
            phone : savedUser.phone,
            userType : savedUser.userType
        }

        sendCookie(savedUser._id,res,"Registered Successfully",201,user);

    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
            message: "An error occurred during user registration. Please try again later."
        });
    }
}


export const signIn = async (req,res) => {
    try {
        const {email,password} = req.body;

        const checkUser = await User.findOne({email});

        if (!checkUser) {
            return res.json({
                success: false,
                error: "Unauthorized",
                message: "Invalid email address. Please try again.",
            });
        }

        const isMatch = await bcrypt.compare(password,checkUser.password);

        if (!isMatch) {
            return res.json({
                success: false,
                error: "Unauthorized",
                message: "Invalid password. Please try again.",
            });
        }
        
        const user = {
            userId : checkUser._id,
            name : checkUser.name,
            email : checkUser.email,
            gender : checkUser.gender,
            userType : checkUser.userType
        }
        
        sendCookie(checkUser._id,res,`Welcome back ${checkUser.name}`,200,user)

    } catch (error) {
        console.log("error : ", error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
            message: "An error occurred during user registration. Please try again later."
        });
    }
}


export const getProfile = async(req,res) => {
    try {

        const userData = await User.findById(req.user);

        const user = {
            userId : userData._id,
            name : userData.name,
            email : userData.email,
            userProfileImage : userData.userProfileImage,
            gender : userData.gender,
            userType : userData.userType,
            phone : userData.phone,
        }

        return res.status(200).json({
            success : true,
            user
        })

    } catch (error) {
        console.log("error : ", error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
            message: "An error occurred while getting profile. Please try again later."
        });
    }
}


export const checkAuth = async(req,res) => {
    try {
        if (req.user) {
            return res.status(200).json({
                success : true,
                message : "Authorized user"
            })
        } else {
            return res.json({
                success : false,
                message : "unAuthorized user"
            })
        }
    } catch (error) {
        
    }
}


export const getUsersCoin = async(req,res) => {
    try {
        const userId = req.user;

        const orders = await Order.find({userId,isPaymentDone:true});

        // console.log(orders);
        
        const data = await Promise.all(orders.map( async(element) => {
            const id = element.coinId
            // const coinInfo = Coin.find({_id:id},{_id:false,name:true});
            const coin = await Coin.findById(id).select(' name ');
            // const coinInfo = await Coin.findById(element.coinId).select('name description material image').lean();

            // console.log(coin);

            return {...element.toObject(),coinName:coin.name,coinId:coin._id}
        }))

        // console.log("data : ", data);

        return res.json({success : true,data})

    } catch (error) {
        console.log("error : ",error);
    }
}


export const getRemainingPayment = async(req,res) => {
    try {
        const {userId} = req.body;

        const orders = await Order.find({userId,isPaymentDone:false});
        
        const data = await Promise.all(orders.map( async(element) => {
            const id = element.coinId
            const coin = await Coin.findById(id).select('-_id name ');
            return {...element.toObject(),coinName:coin.name}
        }))

        return res.json({success : true,data})

    } catch (error) {
        console.log("error : ",error);
    }
}


export const updateUserProfile = async(req,res) => {
    try {
        const {userId, name, userProfileImage, gender, phone } = req.body;
        const user = await User.findByIdAndUpdate(userId, {name,userProfileImage,gender,phone},{new:true})
        // console.log(userId, name, userProfileImage, gender, phone);
        // console.log(user);

        if (user) {
            return res.status(200).json({
                success : true,
                message : 'user update',
                user,
            })
        } else {
            return res.json({
                success : false,
                message : 'unable to update user'
            })
        }
    } catch (error) {
        console.log("error : ", error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}


export const makeOffer = async(req,res) => {
    try {
        const userId = req.user;
        const {
            name,
            description,
            material,
            image,
            offer
        } = req.body;

        const data = new Coin({
            name,
            description,
            material,
            image,
            offer,
            isAcceptedByAdmin:false
        })
        

    } catch (error) {
        
    }
}


export const participateInAuction = async(req,res) => {

    try {    
    const {userName, userEmail, userId, coinId} = req.body;

    const coinData = await Coin.findById(coinId);

    if(coinData.participants.includes(userId)) {
        return res.json({
            success : true,
            message : "You have already participated in this auction."
        })
    }

    const text = `Dear ${userName},

    We are thrilled to confirm your participation in the upcoming auction for the following coin:
    
    Coin Name: ${coinData.name}
    Description: ${coinData.description}
    Start Time: ${coinData.auctionStartDateAndTime}
    Duration: ${coinData.auctionDuration}
    Material: ${coinData.material}
    Starting Bid: ${coinData.initialPrice}
    We hope you enjoy participating in the auction and wish you the best of luck! If you have any questions or need assistance, please do not hesitate to contact us.
    
    Best regards,
    Coin Auction Website Team`;

    const html = `<!DOCTYPE html>
    <html>
    <head>
        <title>Confirmation of Your Participation</title>
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
            <h1>Confirmation of Your Participation</h1>
            <p>Dear ${userName},</p>
            <p>We are thrilled to confirm your participation in the upcoming auction for the following coin:</p>
            <ul>
                <li><strong>Name:</strong> ${coinData.name}</li>
                <li><strong>Description:</strong> ${coinData.description}</li>
                <li><strong>Start Time:</strong> ${coinData.auctionStartDateAndTime}</li>
                <li><strong>Duration:</strong> ${coinData.auctionDuration}</li>
                <li><strong>Material:</strong> ${coinData.material}</li>
                <li><strong>Starting Bid:</strong> ${coinData.initialPrice}</li>
            </ul>
            <p>We hope you enjoy participating in the auction and wish you the best of luck! Should you have any questions or need assistance, please do not hesitate to contact us.</p>
            <p class="footer">Best regards,<br/>Coin Auction Website Team</p>
        </div>
    </body>
    </html>
    `;

    sendMail(userEmail,'Confirmation of Your Participation in the Coin Auction',text,html);

    const updatedCoin = await Coin.findByIdAndUpdate({_id:coinId}, {$push : {participants:userId}}, {new : true})

    if (!updatedCoin) {
        return res.status(404).json({ message: 'Coin not found' });
    }

    return res.status(200).json({
        success : true,
        message: "Thanks for participating in the auction, we will notify you 1 hour before the auction starts."
    })
    } catch (error) {
        console.log("error in adding participants : ", error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
            message: "An error occurred during user participation in auction. Please try again later."
        });
    }

}


export const getS3URLforPuttionObj = async(req,res) => {

    try {
        const { userId } = req.body;


        const command = new PutObjectCommand({
            Bucket: "aws-s3-image-storing",
            Key: `userProfileImages/${userId}.jpg`,
            ContentType:'image/jpeg'
        })
    
        const url = await getSignedUrl(s3Client,command);

        res.json({success : true, url})
        
    } catch (error) {
        console.error("error is : ", error)
        res.status(500).json({ success: false, message: 'Error generating URL', error: error.message });
    }
}


export const getS3URLforGettingObj = async(req,res) => {
    try {
        const { userId } = req.body;
        
        const command = new GetObjectCommand({
            Bucket: "aws-s3-image-storing",
            Key: `userProfileImages/${userId}.jpg`,
          });
          
          const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // Optional: Set expiration time
          res.json({success : true, url})
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error generating URL', error: error.message });
    }
}