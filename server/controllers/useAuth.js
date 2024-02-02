import User from "../models/user.js";
import bcrypt from 'bcrypt';
import { sendCookie } from "../utils/features.js";
import Order from "../models/order.js";
import Coin from "../models/coin.js";


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
            userProfileImage,
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
        const {userId} = req.body;

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


export const UpdateUserProfile = async(req,res) => {
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