import express from "express";
import { checkout, getKey, paymentVerification } from "../controllers/payment.js";
import { isAuthenitcated } from "../middlewares/auth.js";

const router = express.Router();



router.post('/checkout',isAuthenitcated, checkout);

router.route('/paymentverification').post(isAuthenitcated,paymentVerification)

router.route('/getkey').get(isAuthenitcated,getKey);



export default router; 