import React from "react";
import Polygon from "../assets/Group 2.png";
import Back from "../assets/arrow_back.png";
import Ellipse1 from "../assets/Ellipse 1.png";
import Ellipse2 from "../assets/Ellipse 2.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

function Signin() {
    const [email, setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [error, setError] = useState({
        email:false,
        password:false,
        message:''
    });
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setError((prevState) => {
            return{ 
                ...prevState,
                email:false,
                password:false,
                message: ''
            }
        })

        if(!email){
            setError((prevState)=>{
                return{
                ...prevState,
                email:true
                }
            })
        }

        if(!password){
            setError((prevState)=>{
                return{
                ...prevState,
                password:true
                }
            })
        }

        if(!email ||!password){
            console.log("Error in login")
            return;
        }

       
        console.log(email);
        

        const userData = {email,password}

        try {
          const backendUrl = process.env.REACT_APP_FORMBOT_BACKEND_URL;
              if (!backendUrl) {
                  throw new Error('Backend URL is not defined');
              }
          const response = await axios.post(`${backendUrl}/user/login`, userData, {
              headers: {
                  'Content-Type': 'application/json'
              }
          });

         

          console.log('Response data:', response.data);

          // Store or display the userName
          setUserName(response.data.userName);
          // Handle other response data like token
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userName',response.data.userName);
          localStorage.setItem('userId', response.data.userId); 

          console.log('userId:',response.data.userId);
          console.log("token:",response.data.token);

          console.log('User login successfully', response.data);
          setSuccess('Login successfully!');
          setError((prevState) => ({ ...prevState, message: '' }));

          navigate('/workspace');

          // Optionally clear the form fields
      } catch (error) {
          console.error('Error submitting form', error);
          if (error.response) {
            setError((prevState) => ({
              ...prevState,
              message: error.response.data.message || 'Failed to login. Please try again.'
          }));
          } else if (error.request) {
              console.error('Request data:', error.request);
              setError((prevState) => ({
                ...prevState,
                message: 'No response received from the server. Please try again.'
            }));
          } else {
              setError((prevState) => ({
                ...prevState,
                message: error.message || 'An error occurred. Please try again.'
            }));
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
        position: 'relative' // To ensure absolutely positioned elements are positioned relative to this div
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
          transform: 'rotate(21.45deg)', // Correct angle transform
          position: 'absolute'
        }} 
      />
      <img 
        src={Back} 
        alt="Back"
        onClick={()=>navigate(-1)} 
        style={{
          width: '30px',
          height: '30px',
          top: '70px',
          left: '66px',
          position: 'absolute'
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
          position: 'absolute'
        }} 
      />
      <img 
        src={Ellipse2} 
        alt="Ellipse2" 
        style={{
          width: '114.5px',
          height: '229px',
          top: '178px',
          left: '92%', // Correct left position to fit within 1440px width // Correct angle transform
          position: 'absolute'
        }} 
      />
      <form onSubmit={handleSubmit} 
      style={{
        width:'314.97px',height:'239.7px',top:'330px',left:'562px',padding:'0px',borderRadius:'12px 12px 12px 12px',border:'1px 0px 0px 0px',
        position:'absolute',fontFamily:'Poppins,sans-serif',fontSize:'14px',fontWeight:'500',lineHeight:'21px',letterSpacing:'0.03em',
        textAlign:'center'
        }}>
        <div>
            <h1 style={{width:'42.34px',height:'21.69px',top:'330px',left:'562px',color:'#FFFFFF'}}>Email</h1>
            <input
            id="email"
            placeholder="Enter your email"
            name='email'
            type='email'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            style={{
                width:'313.97px',height:'41.31px',borderRadius:'12px 12px 12px 12px',border:'1px 0px 0px 0px',color:'#FFFFFF',
                background: 'linear-gradient(0deg, #121212, #121212), linear-gradient(0deg, #18181B, #18181B)',           }}
            /><br/>
             {error.email && <p style={{color:'red'}}> ! Please enter a valid Email </p>}
             <br/>
        </div>
        <div>
            <h1  style={{width:'74.36px',height:'21.69px',top:'429.2px',left:'563px',color:'#FFFFFF'}}>Password</h1>
            <input
            id="password"
            placeholder="**********"
            name='password'
            type='password'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            style={{
                width:'313.97px',height:'41.31px',borderRadius:'12px 12px 12px 12px',border:'1px 0px 0px 0px',color:'#FFFFFF',
                background: 'linear-gradient(0deg, #121212, #121212), linear-gradient(0deg, #18181B, #18181B)'         }}
            /><br/>
            {error.password && <p style={{color:'red'}}> ! Please enter a valid Password</p>}
            <br/>

        </div>
        <button style={{width:'313.97px',height:'41.31px',top:'528.39px',left:'563px',borderRadius:'12px 12px 12px 12px',background:'#1A5FFF',
        color:'#FFFFFF'
            
        }}>
        Log In 
        </button>
        {error.message && <div style={{ color: 'red' }}>{error.message}</div>} {/* Display error message */}
        {userName && <div>Welcome, {userName}!</div>}
        <div
        style={{
          width: '259px',
          height: '17px',
          top:'320px',
          left:'20px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          fontWeight: '400',
          lineHeight: '16.94px',
          letterSpacing: '0.03em',
          textAlign: 'center',
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px'// Add gap between the text and link
        }}
      >
        <p style={{ color: '#FFFFFF', margin: 0 }}>Don’t have an account?</p>
        <Link to="/signup" style={{ color: '#7EA6FF', textDecoration: 'none' }}>Register now</Link>
      </div>
        
      </form>
    </div>
   
  )
}

export default Signin;
