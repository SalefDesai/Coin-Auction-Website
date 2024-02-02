import express from 'express';
import { addNewCoin, getUpCommingAuctions } from '../controllers/coins.js';
import { isAuthenitcated } from '../middlewares/auth.js';


const router = express.Router();

router.post("/addnewcoin",isAuthenitcated,addNewCoin);
router.get("/getupcommingauction",getUpCommingAuctions);


export default router;