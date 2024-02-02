import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { showErrorToast } from '../utils/Toast';
import axios from 'axios';
import {signUpRoute} from '../utils/Routes.js'
// import {signInRoute, signUpRoute} from '../utils/APIRoutes.js';


const RegistrationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
`;

const Logo = styled.img`
  width: 100px; /* Adjust as needed */
  height: auto;
  margin-bottom: 20px;
`;

const RegistrationForm = styled.form`
  max-width: 400px;
  width: 100%;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
`;

const Label = styled.label`
  display: block;
  margin-top: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const GenderContainer = styled.div`
  margin-top: 10px;
`;

const RadioButtonLabel = styled.label`
  margin-right: 10px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
`;

const AlreadyHaveAccount = styled.p`
  margin-top: 10px;
  text-align: center;

  a {
    color: #007bff;
    text-decoration: none;
  }
`;

const PhoneNumber = styled(Input)` /* You can customize the style further if needed */`;


const RegistrationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    userProfileImage: '',
    gender: '',
    userType: 'user'    
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
      setFormData((prevData) => ({ ...prevData, [name]: reader.result }));
    };
    reader.onerror = error => {
      console.log("Error : ", error);
    }
}

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (formData.password.length < 8 ) showErrorToast("Password shoud atlest have 8 characters");
    else if (formData.password !== formData.confirmPassword) {
      showErrorToast("Password and confirm Password should be same");
      setFormData((prevData) => ({
        ...prevData,
        confirmPassword:''
      }))
    } else if (formData.name.length < 3) showErrorToast("User name should have more than 3 character.");


    try {
      const response = await axios.post(`${signUpRoute}`,{...formData},{withCredentials:true})

      if (!response.data.success) showErrorToast(response.data.message);
      else {
        navigate("/");
        localStorage.setItem("coin-auction",JSON.stringify(response.data.user));
      }

    } catch (error) {
      console.log("error : ", error);
      showErrorToast("Error in signing up.");
    }
  };

  return (
    <RegistrationContainer>
      <Logo src="path/to/your/logo.png" alt="Website Logo" />
      <RegistrationForm onSubmit={handleSubmit}>
        <Title>Register</Title>

        <Label htmlFor="name">Name:</Label>
        <Input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />

        <Label htmlFor="email">Email:</Label>
        <Input type="email" id="email" name="email" autoComplete='new-password' value={formData.email} onChange={handleChange} required />

        <Label htmlFor="password">Password:</Label>
        <Input type="password" id="password" name="password" autoComplete='new-password' value={formData.password} onChange={handleChange} required />

        <Label htmlFor="confirmPassword">Confirm Password:</Label>
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          autoComplete='new-password'
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <Label htmlFor="phoneNumber">Phone Number:</Label>
        <PhoneNumber type="tel" id="phoneNumber" name="phone" value={formData.phone} onChange={handleChange} />


        <Label htmlFor='userProfileImage'>Profile Image</Label>
        <Input type="file" name='userProfileImage' placeholder="Upload your profile image" accept='image/*' onChange={convertToBase64} />

        <GenderContainer>
          <Label>Gender:</Label>
          <div>
            <RadioButtonLabel>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleChange}
                required
              />
              Male
            </RadioButtonLabel>
            <RadioButtonLabel>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleChange}
              />
              Female
            </RadioButtonLabel>
          </div>
        </GenderContainer>

        <Label htmlFor="userType">User Type:</Label>
        <Select id="userType" name="userType" value={formData.userType} onChange={handleChange}>
          <option value="user">User</option>
          <option value="Seller">Seller</option>
        </Select>

        <Button type="submit">Register</Button>
        <AlreadyHaveAccount>ALREADY HAVE AN ACCOUNT ? <Link to={"/login"}>LOGIN.</Link></AlreadyHaveAccount>
      </RegistrationForm>
    </RegistrationContainer>
  );
};

export default RegistrationPage;
