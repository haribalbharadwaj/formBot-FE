import React, { useState } from "react";
import Polygon from "../assets/Group 2.png";
import Back from "../assets/arrow_back.png";
import Ellipse1 from "../assets/Ellipse 1.png";
import Ellipse2 from "../assets/Ellipse 2.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState({
    userName: false,
    email: false,
    password: false,
    confirmPassword: false,
    passwordMatch: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newError = {
      userName: !userName,
      email: !email,
      password: !password,
      confirmPassword: !confirmPassword,
      passwordMatch: password !== confirmPassword,
    };

    setError(newError);

    if (Object.values(newError).includes(true)) {
      console.log("Error exists in the form");
      return;
    }

    const userData = {
      userName,
      email,
      password,
      confirmPassword,
    };

    try {
      const backendUrl = process.env.REACT_APP_FORMBOT_BACKEND_URL;
      if (!backendUrl) {
        throw new Error('Backend URL is not defined');
      }

      const response = await axios.post(`${backendUrl}/user/register`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const userId = response.data.userId;
      if (userId) {
        localStorage.setItem('userId', userId);
        console.log('User ID stored in localStorage:', userId);
        
        // Redirect to workspace after successful signup
        navigate('/workspace');
      } else {
        console.error('User ID not found in response');
      }

      console.log('Form submitted successfully', response.data);
      setSuccess('Account created successfully!');
      setError({
        userName: false,
        email: false,
        password: false,
        confirmPassword: false,
        passwordMatch: false,
      });
      
    } catch (error) {
      console.error('Error submitting form', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        setError({ ...error, global: `Failed to create account: ${error.response.data.message || 'Please try again.'}` });
      } else if (error.request) {
        console.error('Request data:', error.request);
        setError({ ...error, global: 'No response received from the server. Please try again.' });
      } else {
        console.error('Error message:', error.message);
        setError({ ...error, global: `Failed to create account: ${error.message}. Please try again.` });
      }
      setSuccess('');
    }
  };

  return (
    <div
      style={{
        width: '1440px',
        height: '900px',
        margin: '0 auto',
        background: 'linear-gradient(0deg, #121212, #121212), linear-gradient(0deg, #18181B, #18181B)',
        position: 'relative',
      }}
    >
      <img
        src={Polygon}
        alt="Polygon"
        style={{
          width: '283.27px',
          height: '273.61px',
          top: '381.57px',
          left: '44px',
          transform: 'rotate(21.45deg)',
          position: 'absolute',
        }}
      />
      <img
        src={Back}
        alt="Back"
        onClick={() => navigate(-1)}
        style={{
          width: '30px',
          height: '30px',
          top: '70px',
          left: '66px',
          position: 'absolute',
        }}
      />
      <img
        src={Ellipse1}
        alt="Ellipse1"
        style={{
          width: '229px',
          height: '114.5px',
          top: '785px',
          left: '70%',
          position: 'absolute',
        }}
      />
      <img
        src={Ellipse2}
        alt="Ellipse2"
        style={{
          width: '114.5px',
          height: '229px',
          top: '178px',
          left: '92%',
          position: 'absolute',
        }}
      />
      <form
        onSubmit={handleSubmit}
        style={{
          width: '314.97px',
          top: '257px',
          left: '563px',
          borderRadius: '12px',
          position: 'absolute',
          fontFamily: 'Poppins,sans-serif',
          fontSize: '14px',
          fontWeight: '500',
          lineHeight: '21px',
          letterSpacing: '0.03em',
          textAlign: 'center',
        }}
      >
        <div>
          <p style={{ width: '42.34px', height: '21.69px', color: '#FFFFFF' }}>Username</p>
          <input
            style={{
              width: '313.97px',
              height: '41.31px',
              borderRadius: '12px',
              border: '1px 0px 0px 0px',
              background: 'linear-gradient(0deg, #121212, #121212), linear-gradient(0deg, #18181B, #18181B)',
              color: '#FFFFFF',
            }}
            id="username"
            type="text"
            name="userName"
            autoComplete='off'
            placeholder="Enter a username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          {error.userName && <p style={{ color: 'red' }}> ! Please enter a valid name </p>}
        </div>
        <div>
          <p style={{ width: '42.34px', height: '21.69px', color: '#FFFFFF' }}>Email</p>
          <input
            style={{
              width: '313.97px',
              height: '41.31px',
              borderRadius: '12px',
              border: '1px 0px 0px 0px',
              background: 'linear-gradient(0deg, #121212, #121212), linear-gradient(0deg, #18181B, #18181B)',
              color: '#FFFFFF',
            }}
            id="email"
            type="email"
            name="email"
            autoComplete='off'
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error.email && <p style={{ color: 'red' }}> ! Please enter a valid Email </p>}
        </div>
        <div>
          <p style={{ width: '42.34px', height: '21.69px', color: '#FFFFFF' }}>Password </p>
          <input
            style={{
              width: '313.97px',
              height: '41.31px',
              borderRadius: '12px',
              border: '1px 0px 0px 0px',
              background: 'linear-gradient(0deg, #121212, #121212), linear-gradient(0deg, #18181B, #18181B)',
              color: '#FFFFFF',
            }}
            id="password"
            name="password"
            type="password"
            autoComplete='off'
            placeholder="**********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error.password && <p style={{ color: 'red' }}> ! Please enter a Password</p>}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left', color: error.passwordMatch ? 'red' : '#FFFFFF', marginTop: '10px' }}>
            <p style={{ margin: 0 }}>Confirm Password</p>
          </div>
          <input
            style={{
              width: '313.97px',
              height: '41.31px',
              borderRadius: '12px',
              border: '1px 0px 0px 0px',
              background: 'linear-gradient(0deg, #121212, #121212), linear-gradient(0deg, #18181B, #18181B)',
              color: '#FFFFFF',
            }}
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete='off'
            placeholder="**********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error.confirmPassword && <p style={{ color: 'red' }}> ! Please enter a Confirm Password </p>}
          {error.passwordMatch && <p style={{ color: 'red' }}> ! Passwords do not match </p>}
        </div>
        <div>
          <button
            type="submit"
            style={{
              width: '313.97px',
              height: '41.31px',
              background: '#F4B15F',
              borderRadius: '12px',
              border: 'none',
              color: '#FFFFFF',
              fontFamily: 'Poppins,sans-serif',
              fontSize: '14px',
              fontWeight: '500',
              lineHeight: '21px',
              letterSpacing: '0.03em',
              textAlign: 'center',
              cursor: 'pointer',
              marginTop: '20px',
            }}
          >
            Create Account
          </button>
          {success && <p style={{ color: 'green' }}>{success}</p>}
          {error.global && <p style={{ color: 'red' }}>{error.global}</p>}
        </div>
      </form>
    </div>
  );
}

export default Signup;
