import React, { useEffect, useState } from 'react';
import Coin from '../components/Coin';
import axios from 'axios';
import { getUpCommingAuctions } from '../utils/Routes.js';
import {showErrorToast} from '../utils/Toast.js';


const Coins = () => {

  const [coins,setCoins] = useState([]);

  useEffect(() => {
    const getUpcommingAuctions = async() =>{
      const response = await axios.get(`${getUpCommingAuctions}`);
      if (response.data.success) {
        setCoins(response.data.data);
      } else {
        showErrorToast("Unable to fetch upcomming auction details.");
      }

    }

    getUpcommingAuctions();
  },[])

  return (
    <div className="album py-5 bg-body-tertiary">
      <div className="container">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          {coins.map((coin, index) => (
            <div className="col" key={index}>
              <Coin
                id={coin._id}
                image={coin.image}
                name={coin.name}
                description={coin.description}
                startTime={new Date(coin.auctionStartDateAndTime).toString().substring(0,24)}
                duration={coin.auctionDuration}
                material={coin.material}
                startingBid={coin.initialPrice}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Coins;
