import Coin from "../models/coin.js";


export const addNewCoin = async(req,res) => {
    try {

        const {
            name,
            description,
            material,
            image,
            auctionStartDateAndTime,
            auctionDuration,
            initialPrice
        } = req.body;

        const newCoin = new Coin({
            name,
            description,
            material,
            image,
            auctionStartDateAndTime : new Date(auctionStartDateAndTime),
            auctionDuration,
            initialPrice,
            isAcceptedByAdmin:true
        })


        const savedCoin = await newCoin.save();

        return res.status(200).json({
            success : true,
            message : 'New coin added Successfully',
            coin : savedCoin
        })
        
    } catch (error) {
        console.error('Error adding new coin:', error);
        res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
        });
    }
}


export const getUpCommingAuctions = async(req,res) => {
    try {
        const upCommingAllCoins = await Coin.find({isUpcoming:true,isAcceptedByAdmin:true}).sort({auctionStartDateAndTime:1});

        // const data = upCommingAllCoins;
        const data = upCommingAllCoins.filter((coin) => {
            const [hours, minutes] = coin.auctionDuration.split(':').map(Number);
            const scheduledTime = new Date(coin.auctionStartDateAndTime);

            scheduledTime.setTime(scheduledTime.getTime() + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000));

            if (scheduledTime < new Date()) {
                Coin.findByIdAndUpdate(coin._id,{isUpcoming:false});
                return false;
            }
            return true;
        });


        return res.status(200).json({
            success: true,
            message: 'Upcoming coins fetched successfully',
            data: data,
        })
    } catch (error) {
        console.error('Error fetching upcoming coins:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
}