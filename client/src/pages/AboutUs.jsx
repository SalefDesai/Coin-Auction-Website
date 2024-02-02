import React, { useEffect, useState } from 'react'
import Modal from '../components/Modal.jsx';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);


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

    const navigate = useNavigate();

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const dummyTopTenBidders = [
      { userId: '65b3a1c390417bca7629cd16', userName: 'John Doe', bidAmount: 500 },
      { userId: '2', userName: 'Jane Smith', bidAmount: 450 },
      { userId: '3', userName: 'Bob Johnson', bidAmount: 400 },
      { userId: '4', userName: 'Alice Williams', bidAmount: 350 },
      { userId: '5', userName: 'Charlie Brown', bidAmount: 300 },
      { userId: '6', userName: 'Eva Davis', bidAmount: 250 },
      { userId: '7', userName: 'Frank Wilson', bidAmount: 200 },
      { userId: '8', userName: 'Grace Lee', bidAmount: 150 },
      { userId: '9', userName: 'Henry Taylor', bidAmount: 100 },
      { userId: '10', userName: 'Ivy Martin', bidAmount: 50 },
    ];

    const dummyCoinInfo = {
      id: "65b3bf645d2ac7215cc5e7a4",
      image: 'https://th.bing.com/th/id/OIP.CgyD_XJAOLmXJdqKyuwFOAHaHa?rs=1&pid=ImgDetMain',
      name: 'Gold Coin',
      description: 'A beautiful gold coin with intricate designs.',
      material: 'Gold',
    };
    
    
    const handleClick = () => {
      navigate('/auctionresults',{
        state:{
          topTenBidders : dummyTopTenBidders,
          currentUser,
          coinInfo : dummyCoinInfo
        }
      }) 
    }
  
    return (
      <div>
        <button onClick={()=> {}}>Open Modal</button>
        <Modal isOpen={isModalOpen} onClose={closeModal} />
      </div>
    );
}

export default AboutUs;







// // Button.js
// import React, { useState } from 'react';
// import Modal from './Modal';

// const ButtonWithModal = () => {
  
// };

// export default ButtonWithModal;
