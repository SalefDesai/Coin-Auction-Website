import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUsersCoin } from '../utils/Routes';
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';

const UsersCoin = ({user}) => {

  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    const fetchData = async() => {
      try {
        setLoading(true); // Set loading to true while fetching
        const response = await axios.get(`${getUsersCoin}`,{withCredentials:true});
        if (!response.data.success){
          navigate("/login");
        } 
        // console.log(response);
        setOrders(response.data.data);
        // console.log(response.data.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    user && fetchData();
  }, [user]);

  return (
    <div>
      <h1>Your Orders</h1>
      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {orders.length === 0 ? (
            <h3>You have not Orderd anything yet....</h3>
          ) : (
            orders.map((order, index) => (
              <OrderCard key={index} order={order} user={user} />
            ))
          )} 
        </div>
      )}
    </div>
  );
};

const OrderCard = ({ order }) => {
  const { coinName, updatedAt, amount, orderId } = order;
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {setModalOpen(true);}
  const closeModal = () => setModalOpen(false);

  return (
    <div
      style={{
        border: '2px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        margin: '16px',
        width: '250px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s',
        ':hover': {
          transform: 'scale(1.05)',
        },
      }}
    >
      <h3>{coinName}</h3>
      <p>Order Date: {new Date(updatedAt).toString().substring(0, 16)}</p>
      <p>Amount Paid: {'\u20B9'}{amount}</p>
      <p>Order Id: {orderId}</p>
      <button
        style={{
          backgroundColor: '#007bff',
          color: '#fff',
          padding: '8px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={openModal}
      >
        Show Details
      </button>
      <Modal

        isOpen={isModalOpen}
        onClose={closeModal}
        image={"image"}
        name={coinName}
        description={"description"}
        startTime={"startTime"}
        duration={"duration"}
        material={"material"}
        startingBid={"startingBid"}
      />
    </div>
  );
};

export default UsersCoin;
