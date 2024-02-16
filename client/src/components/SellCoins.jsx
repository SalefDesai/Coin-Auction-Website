import React, { useState } from 'react';
import styled from 'styled-components';
import { showErrorToast, showSuccessToast } from '../utils/Toast';
import axios from 'axios';
import { addNewCoin } from '../utils/Routes';

const SellCoins = () => {
  const [coinData, setCoinData] = useState({
    name: '',
    description: '',
    material: '',
    image: '',
    offer: ''
  });
  const[loading,setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoinData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const convertToBase64 = (event) => {
    const {name} = event.target;
    const file = event.target.files[0];

    if (file && file.size > 5 * 1024 * 1024) {
      showErrorToast("File should be less than 5 MB.");
      return;
    }

    var reader = new FileReader();
    if (file) reader.readAsDataURL(file);

    reader.onload = () => {
      setCoinData((prevData) => ({...prevData, [name]: reader.result }));
    };
    reader.onerror = error => {
      console.log("Error : ", error);
    }
}

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(coinData);
    // const currentDate = new Date();
    // const enteredDateTime = new Date(coinData.auctionStartDateAndTime);

    // if (enteredDateTime < currentDate) {
    //     showErrorToast("Please select a future date and time.")
    //     return;
    // }
    
    // try {
    //   setLoading(true);

    //     const response = await axios.post(`${addNewCoin}`,{...coinData},{withCredentials:true});

    //     if (response.data.success) {
    //       showSuccessToast("coin added successfully")
    //     } else {
    //         showErrorToast("Unable to add coin.");
    //     }
    // } catch (error) {
    //     console.log("errro : ", error);
    // } finally {
    //   setLoading(false);
    // }

    setCoinData({
        name: '',
        description: '',
        material: '',
        image: '',
        offer: '',
    });

    // Reset the file input value to clear the selected file
  document.getElementById('imageInput').value = '';

  };

  return (
    <FormContainer>
      <h1>Add New Coin</h1>
      <form onSubmit={handleSubmit}>
        <FormLabel>
          Name:
          <FormInput type="text" name="name" value={coinData.name} onChange={handleChange} />
        </FormLabel>
        <FormLabel>
          Description:
          <FormTextarea name="description" value={coinData.description} onChange={handleChange} />
        </FormLabel>
        <FormLabel>
          Material:
          <FormInput type="text" name="material" value={coinData.material} onChange={handleChange} />
        </FormLabel>
        <FormLabel>
          Coin Image:
          <FormInput type='file' name="image" id="imageInput" accept='image/*' onChange={convertToBase64} />
        </FormLabel>
        <FormLabel>
          Your Offer:
          <FormInput type="number" name="offer" value={coinData.offer} onChange={handleChange} />
        </FormLabel>
        <FormButton type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Make An Offer'}
        </FormButton>
      </form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 8px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const FormButton = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width : 100%
`;

export default SellCoins;
