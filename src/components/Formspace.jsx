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

    const activeButtonStyle = {
        ...buttonStyle,
        color: '#7EA6FF',
        border: '1px solid #7EA6FF'
    };

    const handleClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    const handleResponseClick = (formId) => {
        console.log('formId:', formId); // Log formId to verify it is correct
        handleClick('Response');
        navigate(`/response/${formId}`);
    };

    const handleThemeClick = () => {
        handleClick('Theme');
        navigate('/theme')
    };

    const handleFlowClick = () => {
        handleClick('Flow');
        navigate(`/formspace/${formId}`);
    };

    const renderInput = (input) => {
        switch (input.type) {
            case 'text':
                return (
                    <div key={input.id}>
                        <span>Text Input</span>
                        <input
                            type="text"
                            value={input.value}
                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                            placeholder="Enter text"
                        />
                        <button onClick={() => handleDeleteClick(input.id)}>Delete</button>
                    </div>
                );
            case 'number':
                return (
                    <div key={input.id}>
                        <span>Number Input</span>
                        <input
                            type="number"
                            value={input.value}
                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                            placeholder="Enter number"
                        />
                        <button onClick={() => handleDeleteClick(input.id)}>Delete</button>
                    </div>
                );
            case 'email':
                return (
                    <div key={input.id}>
                        <span>Email Input</span>
                        <input
                            type="email"
                            value={input.value}
                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                            placeholder="Enter email"
                        />
                        <button onClick={() => handleDeleteClick(input.id)}>Delete</button>
                    </div>
                );
            case 'phone':
                return (
                    <div key={input.id}>
                        <span>Phone Input</span>
                        <input
                            type="tel"
                            value={input.value}
                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                            placeholder="Enter phone number"
                        />
                        <button onClick={() => handleDeleteClick(input.id)}>Delete</button>
                    </div>
                );
            case 'date':
                return (
                    <div key={input.id}>
                        <span>Date Input</span>
                        <input
                            type="date"
                            value={input.value}
                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                        />
                        <button onClick={() => handleDeleteClick(input.id)}>Delete</button>
                    </div>
                );
            case 'rating':
                return (
                    <div key={input.id}>
                        <span>Rating Input</span>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={input.value}
                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                            placeholder="Enter rating (1-5)"
                        />
                        <button onClick={() => handleDeleteClick(input.id)}>Delete</button>
                    </div>
                );
            case 'button':
                return (
                    <div key={input.id}>
                        <span>Button</span>
                        <button
                            type="button"
                            onClick={(e) => handleInputChange(input.id, e.target.innerText)}
                        >
                            {input.value || 'Click me'}
                        </button>
                        <button onClick={() => handleDeleteClick(input.id)}>Delete</button>
                    </div>
                );
            case 'image':
                return (
                    <div key={input.id}>
                        <span>Image Input</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleInputChange(input.id, e.target.files[0].name)}
                        />
                        <button onClick={() => handleDeleteClick(input.id)}>Delete</button>
                    </div>
                );
            case 'video':
                return (
                    <div key={input.id}>
                        <span>Video Input</span>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleInputChange(input.id, e.target.files[0].name)}
                        />
                        <button onClick={() => handleDeleteClick(input.id)}>Delete</button>
                    </div>
                );
            case 'gif':
                return (
                    <div key={input.id}>
                        <span>GIF Input</span>
                        <input
                            type="file"
                            accept="image/gif"
                            onChange={(e) => handleInputChange(input.id, e.target.files[0].name)}
                        />
                        <button onClick={() => handleDeleteClick(input.id)}>Delete</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2 style={{ padding: '10px 0', color: 'white', fontSize: '14px', textAlign: 'center', position: 'absolute', left: '68px', top: '15px' }}>Flow</h2>
                <h2 style={{ padding: '10px 0', color: 'white', fontSize: '14px', textAlign: 'center', position: 'absolute', left: '154px', top: '15px' }}>Theme</h2>
                <h2 style={{ padding: '10px 0', color: 'white', fontSize: '14px', textAlign: 'center', position: 'absolute', left: '250px', top: '15px' }}>Response</h2>
                <div>
                    <button
                        style={{ position: 'absolute', left: '10px', top: '11px', ...activeButton === 'Flow' ? activeButtonStyle : buttonStyle }}
                        onClick={() => handleFlowClick(formId)}
                    >
                        Flow
                    </button>
                    <button
                        style={{ position: 'absolute', left: '94px', top: '11px', ...activeButton === 'Theme' ? activeButtonStyle : buttonStyle }}
                        onClick={handleThemeClick}
                    >
                        Theme
                    </button>
                    <button
                        style={{ position: 'absolute', left: '187px', top: '11px', ...activeButton === 'Response' ? activeButtonStyle : buttonStyle }}
                        onClick={() => handleResponseClick(formId)}
                    >
                        Response
                    </button>
                </div>
                <div style={{ padding: '10px 0', position: 'absolute', right: '30px', top: '11px' }}>
                    <button style={{ ...buttonStyle, background: '#7EA6FF' }} onClick={handleCancel}>Cancel</button>
                    <button style={{ ...buttonStyle, background: '#7EA6FF' }} onClick={handleSave}>Save</button>
                    <button style={{ ...buttonStyle, background: '#7EA6FF' }} onClick={handleShare}>Share</button>
                </div>
            </div>
            <div style={{ height: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: '1 1 25%', backgroundColor: '#1A202C', padding: '20px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img src={Text} alt="Text" onClick={() => handleInputClick('text')} />
                        <img src={Image} alt="Image" onClick={() => handleInputClick('image')} />
                        <img src={Video} alt="Video" onClick={() => handleInputClick('video')} />
                        <img src={Gif} alt="Gif" onClick={() => handleInputClick('gif')} />
                        <img src={InputText} alt="InputText" onClick={() => handleInputClick('text')} />
                        <img src={Number} alt="Number" onClick={() => handleInputClick('number')} />
                        <img src={Email} alt="Email" onClick={() => handleInputClick('email')} />
                        <img src={Date} alt="Date" onClick={() => handleInputClick('date')} />
                        <img src={Rating} alt="Rating" onClick={() => handleInputClick('rating')} />
                        <img src={Buttons} alt="Buttons" onClick={() => handleInputClick('button')} />
                        <img src={Phone} alt="Phone" onClick={() => handleInputClick('phone')} />
                    </div>
                </div>
                <div style={{ flex: '3 1 75%', backgroundColor: '#2D3748', padding: '20px', borderRadius: '8px', marginLeft: '10px' }}>
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <input
                            type="text"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            placeholder="Enter Form Name"
                            style={inputStyle}
                        />
                        <div style={{ marginTop: '20px', width: '100%', display: 'flex', flexDirection: 'column' }}>
                            {inputs.map(renderInput)}
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <button type="submit" style={{ ...buttonStyle, background: '#7EA6FF' }}>Save Form</button>
                        </div>
                    </form>
                </div>
            </div>
            {success && <p style={{ color: 'green' }}>{success}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default Formspace;
