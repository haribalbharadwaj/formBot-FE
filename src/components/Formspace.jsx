import { useState, useEffect } from "react";
import React from 'react';
import axios from 'axios';
import Text from '../assets/New folder/Text.png';
import Image from '../assets/New folder/Image.png';
import Video from '../assets/New folder/Video.png';
import Gif from '../assets/New folder/Gif.png';
import InputText from '../assets/New folder/inputText.png';
import Number from '../assets/New folder/Number.png';
import Email from '../assets/New folder/Email.png';
import Date from '../assets/New folder/Date.png';
import Rating from '../assets/New folder/Rating.png';
import Buttons from '../assets/New folder/Buttons.png';
import Phone from '../assets/New folder/Phone.png';
import Close from "../assets/close.png";
import Start from "../assets/startLogo.png";
import Delete from "../assets/delete.png";
import { useNavigate, useParams } from 'react-router-dom';
import { useFormContext } from "../components/FormContext";

function Formspace() {
    const [formName, setFormName] = useState('');
    const [inputs, setInputs] = useState([]);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [activeButton, setActiveButton] = useState(null);
    const { formId } = useParams();
    const navigate = useNavigate();
    const { setSelectedFormId } = useFormContext();

    useEffect(() => {
        if (formId) {
            console.log('Setting formId in context:', formId);
            setSelectedFormId(formId);
        }
    }, [formId, setSelectedFormId]);

    const performSave = async (event) => {
        if (event && event.preventDefault) {
            event.preventDefault();
        }

        const token = localStorage.getItem('token');
        console.log("Retrieved token:", token);

        if (!token) {
            setError('Authentication token not found. Please log in again.');
            setSuccess('');
            return;
        }

        const assignSerialNumbers = (inputs) => {
            let serialNo = 1;
            return inputs.map(input => {
                return { ...input, serialNo: serialNo++ };
            });
        };

        const formData = {
            formName,
            textInputs: assignSerialNumbers(inputs.filter(input => input.type === 'text')),
            imageInputs: assignSerialNumbers(inputs.filter(input => input.type === 'image')),
            videoInputs: assignSerialNumbers(inputs.filter(input => input.type === 'video')),
            gifInputs: assignSerialNumbers(inputs.filter(input => input.type === 'gif')),
            numberInputs: assignSerialNumbers(inputs.filter(input => input.type === 'number')),
            emailInputs: assignSerialNumbers(inputs.filter(input => input.type === 'email')),
            dateInputs: assignSerialNumbers(inputs.filter(input => input.type === 'date')),
            phoneInputs: assignSerialNumbers(inputs.filter(input => input.type === 'phone')),
            ratingInputs: assignSerialNumbers(inputs.filter(input => input.type === 'rating')),
            buttonInputs: assignSerialNumbers(inputs.filter(input => input.type === 'button'))
        };

        console.log("Form submitted with data:", formData);

        try {
            const backendUrl = process.env.REACT_APP_FORMBOT_BACKEND_URL;
            if (!backendUrl) {
                throw new Error('Backend URL is not defined');
            }

            const response = await axios.post(`${backendUrl}/form/addForm`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Form added successfully:', response.data);
            setSuccess('Form added successfully');
            setError('');

            setFormName('');
            setInputs([]);
            localStorage.setItem('userId', response.data.data._id);

            console.log('formId:', response.data.data._id);
            return response.data.data._id;

        } catch (error) {
            console.log('Error adding form:', error.response ? error.response.data : error.message);
            setError('Error adding form. Please try again');
            setSuccess('');
        }
    };

    const handleSave = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        const formId = await performSave();
        console.log('Form ID:', formId);

        if (formId) {
            return formId;
        } else {
            console.error('Form ID is not defined or was not returned.');
            return null;
        }
    };

    const handleShare = async () => {
        const formId = await handleSave();
        if (formId) {
            const formLink = `${window.location.origin}/form/${formId}`;
            try {
                await navigator.clipboard.writeText(formLink);
                console.log('Link copied to clipboard:', formLink);
                alert('Link copied to clipboard');
            } catch (err) {
                console.error('Failed to copy link:', err);
                alert('Failed to copy link');
            }
        } else {
            console.error('Failed to retrieve form ID');
            alert('Failed to retrieve form ID');
        }
    };

    const handleInputClick = (type) => {
        setInputs([...inputs, { id: inputs.length + 1, type, value: '', visible: true }]);
    };

    const handleDeleteClick = (id) => {
        setInputs(inputs.filter(input => input.id !== id));
    };

    const handleInputChange = (id, value) => {
        setInputs(inputs.map(input => input.id === id ? { ...input, value } : input));
    };

    const handleCancel = () => {
        setFormName('');
        setInputs([]);
    };

    const buttonStyle = {
        width: '58px',
        height: '32px',
        padding: '7.1px 13px 7.9px 13px',
        borderRadius: '6px 6px 6px 6px',
        background: 'transparent',
        color: '#FFFFFF',
        cursor: 'pointer'
    };

    const inputStyle = {
        width: 'calc(50% - 5px)',
        height: '39px',
        top: '29px',
        padding: '9px 17px 9px 17px',
        borderRadius: '8px',
        border: '1px',
        flex: '0 0 calc(50% - 10px)'
    };

    const sectionStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    };

    const itemsContainerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px'
    };

    const activeButtonStyle = {
        ...buttonStyle,
        color: '#7EA6FF',
        border: '1px solid #7EA6FF'
    };

    const handleClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    const handleResponseClick = (formId) => {
        console.log('formId:', formId);
        handleClick('Response');
        navigate(`/response/${formId}`);
    };

    const handleThemeClick = () => {
        handleClick('Theme');
        navigate('/theme');
    };

    const handleFlowClick = () => {
        handleClick('Flow');
        navigate(`/formspace/${formId}`);
    };

    return (
        <div style={{
            width: '1440px',
            height: '900px',
            margin: '0 auto',
            background: 'linear-gradient(0deg, #121212, #121212), linear-gradient(0deg, #18181B, #18181B)',
            position: 'relative'
        }}>
            <div style={{
                width: '1440px',
                height: '56px',
                border: '0px 0px 1px 0px',
                background: '#18181B',
                borderBottom: '1px solid #FFFFFF29',
                fontFamily: 'Open Sans,sans-serif',
                fontSize: '12px',
                fontWeight: '600',
                lineHeight: '21px',
                textAlign: 'left'
            }}>
                <div>
                    <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Enter Form Name"
                        style={{
                            width: '222px',
                            height: '23px',
                            borderRadius: '6px',
                            background: '#37373E',
                            color: '#FFFFFF',
                            fontSize: '14px',
                            fontWeight: '400',
                            lineHeight: '21px',
                            border: 'none',
                            top: '17px',
                            left: '19px',
                            position: 'absolute'
                        }}
                    />
                    {error.name && <p style={{ color: 'red' }}>{error.name}</p>}
                </div>
                <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', marginTop: '2px' }}>
                    <span onClick={handleFlowClick} style={activeButton === 'Flow' ? activeButtonStyle : buttonStyle}>Flow</span>
                    <span onClick={handleThemeClick} style={activeButton === 'Theme' ? activeButtonStyle : buttonStyle}>Theme</span>
                    <span onClick={() => handleResponseClick(formId)} style={activeButton === 'Response' ? activeButtonStyle : buttonStyle}>Response</span>
                </div>
                <div style={{ left: '82%', position: 'absolute', top: '0%', display: 'flex', flexDirection: 'row', gap: '30px', alignItems: 'center' }}>
                    <img src={Start} alt="Start" style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                    <img src={Delete} alt="Delete" style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                    <img src={Close} alt="Close" style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                </div>
            </div>
            <div style={{
                width: '1440px',
                height: '844px',
                background: '#1E1E22',
                padding: '20px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h1 style={{ color: '#FFFFFF', margin: '0' }}>Form Inputs</h1>
                    <button onClick={handleShare} style={{ backgroundColor: '#7EA6FF', color: '#FFFFFF', borderRadius: '5px', border: 'none', cursor: 'pointer', padding: '10px 20px' }}>
                        Share Form
                    </button>
                </div>
                <div style={itemsContainerStyle}>
                    {inputs.map(input => (
                        <div key={input.id} style={sectionStyle}>
                            {input.type === 'text' && (
                                <input
                                    type="text"
                                    value={input.value}
                                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                                    placeholder="Enter text"
                                    style={inputStyle}
                                />
                            )}
                            {input.type === 'image' && (
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleInputChange(input.id, e.target.files[0])}
                                    style={inputStyle}
                                />
                            )}
                            {input.type === 'video' && (
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => handleInputChange(input.id, e.target.files[0])}
                                    style={inputStyle}
                                />
                            )}
                            {input.type === 'gif' && (
                                <input
                                    type="file"
                                    accept="image/gif"
                                    onChange={(e) => handleInputChange(input.id, e.target.files[0])}
                                    style={inputStyle}
                                />
                            )}
                            {input.type === 'number' && (
                                <input
                                    type="number"
                                    value={input.value}
                                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                                    placeholder="Enter number"
                                    style={inputStyle}
                                />
                            )}
                            {input.type === 'email' && (
                                <input
                                    type="email"
                                    value={input.value}
                                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                                    placeholder="Enter email"
                                    style={inputStyle}
                                />
                            )}
                            {input.type === 'date' && (
                                <input
                                    type="date"
                                    value={input.value}
                                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                                    placeholder="Enter date"
                                    style={inputStyle}
                                />
                            )}
                            {input.type === 'phone' && (
                                <input
                                    type="tel"
                                    value={input.value}
                                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                                    placeholder="Enter phone number"
                                    style={inputStyle}
                                />
                            )}
                            {input.type === 'rating' && (
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={input.value}
                                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                                    placeholder="Enter rating (1-5)"
                                    style={inputStyle}
                                />
                            )}
                            {input.type === 'button' && (
                                <input
                                    type="button"
                                    value={input.value}
                                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                                    style={inputStyle}
                                />
                            )}
                            <button onClick={() => handleDeleteClick(input.id)} style={{ backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', padding: '5px 10px' }}>Delete</button>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <button onClick={handleCancel} style={{ backgroundColor: 'gray', color: 'white', borderRadius: '5px', border: 'none', cursor: 'pointer', padding: '10px 20px' }}>Cancel</button>
                    <button onClick={handleSave} style={{ backgroundColor: '#4CAF50', color: 'white', borderRadius: '5px', border: 'none', cursor: 'pointer', padding: '10px 20px' }}>Save Form</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                    <button onClick={() => handleInputClick('text')} style={buttonStyle}><img src={Text} alt="Text" /></button>
                    <button onClick={() => handleInputClick('image')} style={buttonStyle}><img src={Image} alt="Image" /></button>
                    <button onClick={() => handleInputClick('video')} style={buttonStyle}><img src={Video} alt="Video" /></button>
                    <button onClick={() => handleInputClick('gif')} style={buttonStyle}><img src={Gif} alt="Gif" /></button>
                    <button onClick={() => handleInputClick('number')} style={buttonStyle}><img src={Number} alt="Number" /></button>
                    <button onClick={() => handleInputClick('email')} style={buttonStyle}><img src={Email} alt="Email" /></button>
                    <button onClick={() => handleInputClick('date')} style={buttonStyle}><img src={Date} alt="Date" /></button>
                    <button onClick={() => handleInputClick('phone')} style={buttonStyle}><img src={Phone} alt="Phone" /></button>
                    <button onClick={() => handleInputClick('rating')} style={buttonStyle}><img src={Rating} alt="Rating" /></button>
                    <button onClick={() => handleInputClick('button')} style={buttonStyle}><img src={Buttons} alt="Buttons" /></button>
                </div>
            </div>
        </div>
    );
}

export default Formspace;
