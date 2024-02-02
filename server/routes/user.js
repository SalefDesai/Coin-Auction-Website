import express from 'express';
import { UpdateUserProfile, checkAuth, getProfile, getRemainingPayment, getUsersCoin, signIn, signup } from '../controllers/useAuth.js';
import { isAuthenitcated } from '../middlewares/auth.js';
import { logout } from '../utils/features.js';



const router = express.Router();


router.post("/signup",signup);

router.post("/signin",signIn);

router.get("/getProfile",isAuthenitcated,getProfile);

router.get("/checkisauth",isAuthenitcated,checkAuth);

router.get("/logout",logout);

router.post("/getuserscoin",getUsersCoin);

router.post("/remainingpayment",getRemainingPayment);

router.post("/updateuserprofile",UpdateUserProfile);






export default router;