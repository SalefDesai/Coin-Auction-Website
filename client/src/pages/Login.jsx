import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { showErrorToast } from '../utils/Toast.js';
import { signInRoute } from '../utils/Routes.js';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const showToast = (data) => {
    toast.error(data,{
      position : "top-right",
      autoClose : 2000
    })
  }
  

  const handleSignIn = async(e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${signInRoute}`,{email,password},{withCredentials:true});
      
      if (!response.data.success){
        showErrorToast(response.data.message)
      }
      else {
        localStorage.setItem("coin-auction",JSON.stringify(response.data.user));
        navigate("/");
      }
    } catch (error) {
      console.error('Error signing in:', error.message);
      showErrorToast('Error signing in');
    }

    // setEmail('');
    // setPassword('');

  };

  return (
    <Container>
      <Logo src="/your-logo-url.png" alt="Logo" />
      <Form>
        <Title>Login</Title>
        <InputLabel>Email</InputLabel>
        <Input
          type="email"
          value={email}
          autoComplete="username"
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputLabel>Password</InputLabel>
        <Input
          type="password"
          value={password}
          autoComplete="current-password" 
          onChange={(e) => setPassword(e.target.value)}
        />
        <SignInButton onClick={handleSignIn}>Sign In</SignInButton>
        <RegisterLink>DON'T HAVE AN ACCOUNT ? <Link to={"/register"}>REGISTER</Link>
        </RegisterLink>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Logo = styled.img`
  width: 150px;
  height: auto;
  margin-bottom: 20px;
`;

const Form = styled.form`
  width: 320px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
`;

const SignInButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  border: none;
  color: #fff;
  border-radius: 3px;
  cursor: pointer;
`;

const RegisterLink = styled.p`
  margin-top: 20px;
  text-align: center;

  a {
    color: #007bff;
    text-decoration: none;
  }
`;

export default Login;
