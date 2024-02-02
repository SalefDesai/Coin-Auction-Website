import Coin from "../models/coin.js";

export const auctionSocketio = (io) => {

    var auctionUsersMap = new Map();
    var auctionUserCount = new Map();

    var auctionEndTimeMap = new Map();


    const auctionio = io.of("/auction");

    auctionio.on("connection",(socket) => {

        console.log("socket id : ",socket.id);


        socket.on('new-user',({userId,auctionId,userName,startTime,duration}) => {

            // console.log(userId,",,,,",auctionId,",,",userName,",,",duration,",,",startTime);

            socket.join(auctionId);
            // console.log("after  : ", auctionio.adapter.rooms);

            if (!auctionUsersMap.has(auctionId)) {
                auctionUsersMap.set(auctionId,new Map());
                auctionUserCount.set(auctionId,0);
                const startAuction = (auctionId,startTime,duration) => {

                    const [hours,minutes] = duration.split(':').map(Number);
                    const acutionEndTime = new Date(startTime.getTime()  + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000))
            
                    auctionEndTimeMap.set(auctionId,acutionEndTime);
            
                    const timeUntilEnd = acutionEndTime - new Date(); 
                    // here instead of firstUserJoin it should be new Date()
            
                    setTimeout(() => {
                        endAuction(auctionId);
                    },[new Date(timeUntilEnd).getTime()])
            
                }

                startAuction(auctionId,new Date(startTime),duration);
            }

            var currentAuctionMap = auctionUsersMap.get(auctionId);
            currentAuctionMap.set(userId,{
                socketId:socket.id,
                bidAmount:(currentAuctionMap.get(userId)?.bidAmount) ?? 0, 
                userName
            })
            // ?? :  nullish coalescing operator, returns its right-hand operand when its left-hand operand is null or undefined, and otherwise

            auctionUserCount.set(auctionId,auctionUserCount.get(auctionId)+1);

            // console.log("auction map : ", auctionUsersMap);

            socket.emit("time",auctionEndTimeMap.get(auctionId));
            auctionio.to(auctionId).emit('user-list',getUsersList(currentAuctionMap));
        })


        socket.on("place-bid",({bidAmount,auctionId,userId}) => {
            var currentAuctionMap = auctionUsersMap.get(auctionId);
            currentAuctionMap.set(userId,{socketId:socket.id,bidAmount,userName:currentAuctionMap.get(userId).userName});

            auctionio.emit('user-list',getUsersList(currentAuctionMap));
            
            // console.log(auctionUsersMap);
        });


        async function endAuction (auctionId) {
            const topTenList = getUsersList(auctionUsersMap.get(auctionId)).slice(0,10);

            auctionio.to(auctionId).emit('end-auction',topTenList);

            const topTenBidders = topTenList.map(element => {
                return {bidder : element.userId ,bidAmount:element.bidAmount}
            });
            const updateData = {
                isUpcoming : false,
                winner : topTenBidders[0].bidder,
                topTenBidders,
                noOfparticipatedUsers : auctionUsersMap.get(auctionId).size
            }

            const updatedCoin = await Coin.findByIdAndUpdate(auctionId,updateData,{new:true})

            // console.log("udpaded coin : ", updatedCoin);


            auctionUsersMap.delete(auctionId);
            auctionEndTimeMap.delete(auctionId);

            // console.log("after auction : ", auctionUsersMap);
            // console.log("after auction time map : ", auctionEndTimeMap);



        
        }



        // socket.on('user-disconnect',(id) => {
        //     auctionUserCount.set(id,auctionUserCount.get(id)-1);

        //     if(auctionUserCount.get(id) == 0) {
        //         // call a function;
        //         auctionUsersMap.get(id).clear();
        //     }
        // })


        socket.on('disconnect',()=>{
            console.log("user disconnect", socket.id);
            // auctionUsersMap.clear();
        })
    })


    function getUsersList(currentMap) {

        const entriesArray = Array.from(currentMap.entries());
      
        const resultArray = entriesArray.map(([userId,{ socketId, bidAmount, userName }]) => ({
          userId,
          userName,
          bidAmount,
          socketId,
        }));
      
        return resultArray.sort((a, b) => b.bidAmount - a.bidAmount);
    }

    


}