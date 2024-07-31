// src/components/Settings.jsx
import React, { useState } from 'react'; // or useNavigate if using React Router v6
import { useNavigate } from 'react-router-dom';
import Profile from "../assets/Profile.png";
import Lock from "../assets/lock.png";
import Logout from "../assets/Logout.png";
import axios from 'axios';


const Settings = ({ setShowSettings }) => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState({
        userName: false,
        email: false,
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
        passwordMatch: false,
        incorrectOldPassword: false,
    });
     // or useNavigate if using React Router v6

    const navigate = useNavigate();
    const {setUser} = useUser();
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError({
            userName: !userName,
            email: !email,
            oldPassword: !oldPassword,
            newPassword: !newPassword,
            confirmPassword: !confirmPassword,
            passwordMatch: newPassword !== confirmPassword,
            incorrectOldPassword:false
        });

        if (!userName || !email || !oldPassword || !newPassword || newPassword !== confirmPassword) {
            return;
        }

        const userData = {
            userName,
            email,
            oldPassword,
            newPassword,
        };

        console.log(userData);
        // Add your API call here to update user details

        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                console.error('User ID is missing from localStorage');
                return;
            }
            const backendUrl = process.env.REACT_APP_FORMBOT_BACKEND_URL;
                if (!backendUrl) {
                    throw new Error('Backend URL is not defined');
                }
            const response = await axios.put(`${backendUrl}/user/updateUser/${userId}`, userData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
      
            console.log('User updated successfully', response.data);
            navigate('/workspace');
            setError({
                userName: false,
                email: false,
                oldPassword: false,
                newPassword: false,
                confirmPassword: false,
                passwordMatch: false,
                incorrectOldPassword: false, // Reset error state on success
            });
      
            // Optionally clear the form fields
        } catch (error) {
            console.error('Error submitting form', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }
            if (error.response.status === 400 && error.response.data.message === 'Incorrect old password') {
                setError((prevError) => ({
                    ...prevError,
                    incorrectOldPassword: true,
                }));
            } else {
                setError((prevError) => ({
                    ...prevError,
                    general: error.response.data.message || 'Please try again.',
                }));
            } 
            if (error.request) {
                console.error('Request data:', error.request);
                setError((prevError) => ({
                    ...prevError,
                    general: 'No response received from the server. Please try again.',
                }));
            } else {
                console.error('Error message:', error.message);
                setError((prevError) => ({
                    ...prevError,
                    general: `Failed to create account: ${error.message}. Please try again.`,
                }));
            }

        }
      };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        navigate('/'); // or navigate('/signin') if using React Router v6
    };


    return (
        <div style={{
            width: '1440px', height: '900px', margin: '0 auto',
            background: 'linear-gradient(0deg, #121212, #121212), linear-gradient(0deg, #18181B, #18181B)',
            position: 'relative', fontFamily: 'Open Sans, sans-serif', fontSize: '22px', fontWeight: '600', lineHeight: '29.96px'
        }}>
            <p style={{ color: '#FFFFFF', left: '45%', position: 'absolute' ,width:'86px',height:'30px'}}>Settings</p>
            <form onSubmit={handleSubmit} style={{
                width: '493.39px', height: '484.92px', top: '145px', left: '473px', borderRadius: '12px', position: 'absolute', gap: '44px',
                fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: '500', lineHeight: '21px', letterSpacing: '0.03em', textAlign: 'center'
            }}>
                <div style={{ position: 'relative', marginBottom: '10px' }}>
                    <img src={Profile} alt="Profile" style={{
                        position: 'absolute', width: '25px', height: '25px', top: '8px', left: '95px'
                    }} />
                    <input
                        style={{
                            width: '280px', height: '41.31px', borderRadius: '12px', border: '1px solid #FFFFFF29', paddingLeft: '40px',
                            background: 'linear-gradient(0deg, #121212, #121212), linear-gradient(0deg, #18181B, #18181B)', color: '#FFFFFF'
                        }}
                        id="username"
                        type="text"
                        name="userName"
                        autoComplete='off'
                        placeholder="Name"
                        value={userName}
                        onInput={(e) => setUserName(e.target.value)}
                    />
                </div>
                {error.userName && <p style={{ color: 'red' }}> ! Please enter a valid name </p>}
                
                <div style={{ position: 'relative', marginBottom: '10px' }}>
                    <img src={Lock} alt="Lock" style={{
                        position: 'absolute', width: '25px', height: '25px', top: '8px', left: '95px'
                    }} />
                    <input
                        style={{
                            width: '280px', height: '41.31px', borderRadius: '12px', border: '1px solid #FFFFFF29', paddingLeft: '40px',
                            background: 'linear-gradient(0deg, #121212, #121212), linear-gradient(0deg, #18181B, #18181B)', color: '#FFFFFF'
                        }}
                        id="email"
                        type="email"
                        name="email"
                        autoComplete='off'
                        placeholder="Update Email"
                        value={email}
                        onInput={(e) => setEmail(e.target.value)}
                    />
                    {error.email && <p style={{ color: 'red' }}> ! Please enter a valid Email </p>}
                </div>
                <div style={{ position: 'relative', marginBottom: '10px' }}>
                    <img src={Lock} alt="Lock" style={{
                        position: 'absolute', width: '25px', height: '25px', top: '8px', left: '95px'
                    }} />
                    <input
                        style={{
                            width: '280px', height: '41.31px', borderRadius: '12px', border: '1px solid #FFFFFF29', paddingLeft: '40px',
                            background: 'linear-gradient(0deg, #121212, #121212), linear-gradient(0deg, #18181B, #18181B)', color: '#FFFFFF'
                        }}
                        id="oldPassword"
                        name="oldPassword"
                        type="password"
                        autoComplete='off'
                        placeholder="Old Password"
                        value={oldPassword}
                        onInput={(e) => setOldPassword(e.target.value)}
                    />
                    {error.oldPassword && <p style={{ color: 'red' }}> ! Please enter a Password</p>}
                    {error.incorrectOldPassword && <p style={{ color: 'red' }}>Old password is incorrect</p>}
                </div>
                <div style={{ position: 'relative', marginBottom: '10px' }}>
                    <img src={Lock} alt="Lock" style={{
                        position: 'absolute', width: '25px', height: '25px', top: '8px', left: '95px'
                    }} />
                    <input
                        style={{
                            width: '280px', height: '41.31px', borderRadius: '12px', border: '1px solid #FFFFFF29', paddingLeft: '40px',
                            background: 'linear-gradient(0deg, #121212, #121212), linear-gradient(0deg, #18181B, #18181B)', color: '#FFFFFF'
                        }}
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        autoComplete='off'
                        placeholder="New Password"
                        value={newPassword}
                        onInput={(e) => setNewPassword(e.target.value)}
                    />
                    {error.newPassword && <p style={{ color: 'red' }}> ! Please enter a New Password</p>}
                </div>
                <div style={{ position: 'relative', marginBottom: '10px' }}>
                    <img src={Lock} alt="Lock" style={{
                        position: 'absolute', width: '25px', height: '25px', top: '8px', left: '95px'
                    }} />
                    <input
                        style={{
                            width: '280px', height: '41.31px', borderRadius: '12px', border: '1px solid #FFFFFF29', paddingLeft: '40px',
                            background: 'linear-gradient(0deg, #121212, #121212), linear-gradient(0deg, #18181B, #18181B)', color: '#FFFFFF', marginTop: '20px'
                        }}
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete='off'
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onInput={(e) => setConfirmPassword(e.target.value)}
                    />
                    {error.confirmPassword && <p style={{ color: 'red' }}> ! Please confirm your Password</p>}
                    {error.passwordMatch && <p style={{ color: 'red' }}>enter same password in both fields</p>}
                </div>
                <button style={{ 
                    width: '313.97px', height: '41.31px', borderRadius: '12px',
                    boxShadow: '0px 4px 10px 0px #E9444B40', background: '#1A5FFF', color: '#FFFFFF', marginTop: '20px'
                }}>Update</button>
            </form>
            <img onClick={logout} src={Logout}style={{
                width: '99px', height: '24px',top:'806px',left:'67px',
                 cursor: 'pointer',position:'absolute'
            }}/>
        </div>
    );
}

export default Settings;
