import express from "express";
import { checkout, getKey, paymentVerification } from "../controllers/payment.js";

const router = express.Router();



router.post('/checkout',checkout);

router.route('/paymentverification').post(paymentVerification)

router.route('/getkey').get(getKey);



export default router; 