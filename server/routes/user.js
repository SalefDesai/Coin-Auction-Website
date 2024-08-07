import express from 'express';
import { checkAuth, getProfile, getRemainingPayment, getS3URLforGettingObj, getS3URLforPuttionObj, getUsersCoin, makeOffer, participateInAuction, signIn, signup, updateUserProfile } from '../controllers/useAuth.js';
import { isAuthenitcated } from '../middlewares/auth.js';
import { logout } from '../utils/features.js';



const router = express.Router();


router.post("/signup",signup);

router.post("/signin",signIn);

router.get("/getProfile",isAuthenitcated,getProfile);

router.get("/checkisauth",isAuthenitcated,checkAuth);

router.get("/logout",logout);

router.get("/getuserscoin",isAuthenitcated,getUsersCoin);

router.post("/remainingpayment",isAuthenitcated,getRemainingPayment);

router.post("/updateuserprofile",isAuthenitcated,updateUserProfile);

router.post("/makeOffer",isAuthenitcated,makeOffer)

router.post("/participateinauction",isAuthenitcated,participateInAuction)

router.post("/urlforputtingobjinS3",getS3URLforPuttionObj);

router.post("/urlforgettingobjfroms3",getS3URLforGettingObj);





export default router;