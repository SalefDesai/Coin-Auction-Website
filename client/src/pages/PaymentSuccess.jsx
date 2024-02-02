import React from 'react';
import { useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
  const location = useLocation();
  const referenceId = new URLSearchParams(location.search).get('referenceId');

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.heading}>Order Successful</h1>
        <p style={styles.text}>Reference No. {referenceId}</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundcolor : 'lightgreen',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  content: {
    textAlign: 'center',
  },
  heading: {
    textTransform: 'uppercase',
    fontSize: '2em',
    marginBottom: '10px',
  },
  text: {
    fontSize: '1.2em',
  },
};

export default PaymentSuccess;
