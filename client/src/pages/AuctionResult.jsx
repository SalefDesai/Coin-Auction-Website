import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { checkout, getkey } from '../utils/Routes';

const AuctionResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { topTenBidders, currentUser, coinInfo } = location.state;
  const winner = topTenBidders[0];
  const [showProceedButton, setShowProceedButton] = useState(false);
  const [order,setOrder] = useState();

  
  const checkOut = async() => {

    const {data:{order}} = await axios.post(`${checkout}`, {
        amount : winner.bidAmount,
        coinId : coinInfo.id,
        userId : currentUser.userId
      })

    setOrder(order);
    
  }

  useEffect(() => {    
    setShowProceedButton(currentUser && winner && currentUser.userId === winner.userId);

    if (currentUser && winner && currentUser.userId === winner.userId) {
      try {
        checkOut();
      } catch (error) {
       console.log("error : ", error); 
      }
    }
  }, [currentUser, winner]);

  const handleProceed = async() => {

    try {
      const {data:{key}} = await axios.get(`${getkey}`,{withCredentials:true});

      const options = {
        key, // Enter the Key ID generated from the Dashboard
        amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Salef Desai",
        description: "Test Transaction",
        image: "",
        order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        callback_url: "http://localhost:5000/api/payment/paymentverification",
        prefill: {
            name: currentUser.name,
            email: currentUser.email,
            contact: "9000090000"
        },
        notes: {
            address: "Razorpay Corporate Office"
        },
        theme: {
            color: "#3399cc"
        }
      };
      const razor = new window.Razorpay(options);
      razor.open();
      

    } catch (error) {
      console.log("error : ",  error);
    }

    console.log("Proceeding with Order and Payment...");
  };

  return (
    <ResultsContainer>
      <ResultsTitle>Auction Results</ResultsTitle>
      <ContentContainer>
        <LeftContainer>
          <CoinInfoContainer>
            <CoinImage src={coinInfo.image} alt={coinInfo.name} />
            <CoinDetails>
              <h2>{coinInfo.name}</h2>
              <p>Description: {coinInfo.description}</p>
              <p>Material: {coinInfo.material}</p>
            </CoinDetails>
          </CoinInfoContainer>
          <WinnerInfoContainer>
            {winner && order &&(
              <>
                <h4> Winner is of auction is <UserName>{winner.userName}</UserName> with the highest bid <UserName>{'\u20B9'}{winner.bidAmount}</UserName> </h4>
              </>
            )}
            {showProceedButton && <ProceedButton onClick={handleProceed}>Proceed with Payment</ProceedButton>}
          </WinnerInfoContainer>
        </LeftContainer>
        <TopBiddersList>
          <h5><UserName> Top Bidders </UserName></h5> 
          {topTenBidders.slice(1).map((bidder, index) => (
            <BidderItem key={index}>
              <Rank>{index + 2}</Rank>
              <BidderInfo>
                <UserName>{bidder.userName}</UserName>
                <p>{bidder.bidAmount} Rs</p>
              </BidderInfo>
            </BidderItem>
          ))}
        </TopBiddersList>
      </ContentContainer>
      {!showProceedButton && 
      <BackToHomeButton onClick={() => {navigate('/')}}>
      Back to Home
    </BackToHomeButton>
    }
    </ResultsContainer>
  );
};

const ResultsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const ResultsTitle = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LeftContainer = styled.div`
  flex: 1;
  margin-right: 20px;
`;

const CoinInfoContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const CoinImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 20px;
`;

const CoinDetails = styled.div`
  flex: 1;
`;

const WinnerInfoContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const TopBiddersList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  flex: 1;
`;

const BidderItem = styled.li`
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

const BidderInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: bold;
`;

const ProceedButton = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
`;

const BackToHomeButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
`;


export default AuctionResult;
