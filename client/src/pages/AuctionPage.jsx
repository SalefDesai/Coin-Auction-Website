import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { io } from 'socket.io-client';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { hostForAuction } from '../utils/Routes.js';
import { showErrorToast } from '../utils/Toast.js';
import Timer from '../components/Timer.jsx';

const AuctionPage = ({}) => {
  

  const navigate = useNavigate();
  const socket = useRef();
  const location = useLocation();
  const { id, image, name, description, startTime, duration, material, startingBid } = location.state;

  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [highestBid, setHighestBid] = useState(startingBid);
  const [time,setTime] = useState();


  useEffect(() => {

    const setUserFromLocalStorage = async() => {
      const user = await JSON.parse(localStorage.getItem('coin-auction'));
      setCurrentUser(user);
    }
        
    setUserFromLocalStorage(); 
    return () => {
      setCurrentUser(null);
    }
  }, [])

  

  useEffect(() => {

    if (!currentUser) return;

    socket.current = io(hostForAuction);

    socket.current.on("connect_error", (error) => {
      console.error("Error connecting to the socket:", error);

      showErrorToast("Error in connecting")
      navigate("/coins");
    });

    console.log("current user : ",currentUser);

    const newUser = {
      userId : currentUser.userId,
      auctionId : id,
      userName : currentUser.name,
      startTime,
      duration
    }

    console.log("new user " , newUser)

    socket.current.emit("new-user", newUser);

    socket.current.on('time',(time) => {
      setTime(time);
      console.log("start time is : ",time);
    })

    socket.current.on("user-list", (list) => {
      setUsers(list);
      if (list[0]?.bidAmount > highestBid) setHighestBid(list[0].bidAmount);
      
    })

    socket.current.on('end-auction',(list) => {
      setUsers(list);
      navigate('/auctionresults',{
        state:{
          topTenBidders : list,
          currentUser,
          coinInfo : {id, image, name, description, material}
        }
      }) 
    })

    return () => {
      // socket.current.emit('user-disconnect',id);
      socket.current.disconnect();
    }
  }, [currentUser]);

  const handleBid = () => {

    // Check if bidAmount is a valid number
    const bidAmountNumber = parseFloat(bidAmount);

    // if (isNaN(bidAmountNumber)) showErrorToast("Invalid bid amount. Please enter a valid number.");
    // else if (bidAmountNumber <= highestBid) showErrorToast("Invalid bid amount. Please amount more than highest bid")
    // else 
    if (!isNaN(bidAmountNumber) && bidAmountNumber > highestBid) {
      socket.current.emit("place-bid",{
        bidAmount:bidAmountNumber,
        auctionId:id,
        userId:currentUser.userId
      });
    } else {
      showErrorToast("Invalid bid amount. Please enter a valid number and more than highest bid.")
    }
    setBidAmount('');
  }


  

  return (
    <>  
    { time && <Timer targetTime={new Date(time)} onTimeout={() => {setTime(null); console.log("time is over")}} />}
      <HighestBid>
        <span>Highest Bid: {highestBid} Rs</span>
      </HighestBid>
    <AuctionContainer>
      
      <RankingContainer>
        <h2>User In Auction</h2>
        <RankList>
          {users?.map((user, index) => (
            <RankItem key={index}>
              <Rank>{index + 1}</Rank>
              <UserInfo>
                <UserName>{user.userName}</UserName>
                <SocketId>{user.socketId}</SocketId>
                <SocketId>{user.bidAmount}</SocketId>
              </UserInfo>
            </RankItem>
          ))}
        </RankList>
      </RankingContainer>

      <BidContainer>
        <BidInput
          type="number"
          placeholder="Enter bid amount"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
        />
        <BidButton onClick={handleBid}>Place Bid</BidButton>
      </BidContainer>
    </AuctionContainer>
    </>
  );
};

const AuctionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
`;

const HighestBid = styled.div`
  margin-bottom: 20px;
`;

const RankingContainer = styled.div`
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 5px;
  width: 60%;
`;

const RankList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const RankItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Rank = styled.div`
  width: 30px;
  height: 30px;
  background-color: #007bff;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: bold;
`;

const SocketId = styled.span`
  font-size: 12px;
  color: #888;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const BidContainer = styled.div`
  background-color: #007bff;
  padding: 20px;
  border-radius: 5px;
  width: 35%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BidInput = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  width: 80%;
  border: none;
  border-radius: 5px;
  font-size: 16px;
`;

const BidButton = styled.button`
  background-color: #fff;
  color: #007bff;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
`;

export default AuctionPage;
