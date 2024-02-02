import React, { useState } from 'react';
import styled from 'styled-components';

const DeliveryDetails = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  // Function to handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // You can use the formData object for further processing (e.g., sending to a server)
    console.log('Form Data:', formData);
  };

  return (
    <AddressFormContainer>
      <h2>Delivery Address Form</h2>
      <Form onSubmit={handleSubmit}>
        <Label>
          Full Name:
          <Input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </Label>
        <Label>
          Address Line:
          <Input
            type="text"
            name="addressLine"
            value={formData.addressLine}
            onChange={handleChange}
            required
          />
        </Label>
        <Label>
          City/Town/Village:
          <Input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </Label>
        <Label>
          State/Province/Region:
          <Input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </Label>
        <Label>
          Postal Code/ZIP Code:
          <Input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
          />
        </Label>
        <Label>
          Country:
          <Input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </Label>
        <ButtonContainer>
          <SkipButton type="button">Skip</SkipButton>
          <SubmitButton type="submit">Submit</SubmitButton>
        </ButtonContainer>
      </Form>
    </AddressFormContainer>
  );
};

// Styled components
const AddressFormContainer = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin: 10px 0;
`;

const Input = styled.input`
  padding: 8px;
  margin-top: 5px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const SkipButton = styled.button`
  background-color: #e0e0e0;
  color: #333;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

export default DeliveryDetails;
