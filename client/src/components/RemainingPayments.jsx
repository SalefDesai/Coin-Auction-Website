import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { checkout, getRemainingPayment, getkey } from '../utils/Routes';


const RemainingPayments = () => {
  const [orders, setOrders] = useState();
  const [user,setUser] = useState();
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const setUserFromLocalStorage = async () => {
      setUser(await JSON.parse(localStorage.getItem('coin-auction')));
    };

    setUserFromLocalStorage();
  }, []); 

  useEffect(() => {
    const fetchData = async() => {
      try {
        setLoading(true); 
        const response = await axios.post(`${getRemainingPayment}`, { userId: user.userId });
        setOrders(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false); 
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
            <h3>No Remainig payments.</h3>
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

const OrderCard = ({ order, user }) => {
  const { coinName, createdAt, amount, orderId, coinId } = order;

  const handleShowDetails = () => {
    // Implement logic to show detailed information for the order
    // console.log('Show details for order:', id);
  };

  const handlePayNow = async() => {

    const {data:{order}} = await axios.post(`${checkout}`, {
      amount,
      coinId,
      userId : user.userId,
      orderId
    })

    try {
      const {data:{key}} = await axios.get(`${getkey}`);

      const options = {
        key, // Enter the Key ID generated from the Dashboard
        amount: amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Salef Desai",
        description: "Test Transaction",
        image: "",
        order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        callback_url: "http://localhost:5000/api/payment/paymentverification",
        prefill: {
            name: user.name,
            email: user.email,
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
      <p>Order Date: {new Date(createdAt).toString().substring(0, 16)}</p>
      <p>Amount : {amount}</p>
      <p>Order Id: {orderId}</p>
      <button
        style={{
          backgroundColor: '#007bff',
          color: '#fff',
          padding: '8px',
          margin: '4px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={handleShowDetails}
      >
        Show Details
      </button>
      <button
        style={{
          backgroundColor: '#28a745',
          color: '#fff',
          padding: '8px',
          margin: '4px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={handlePayNow}
      >
        Pay Now
      </button>
    </div>
  );
};

export default RemainingPayments;
