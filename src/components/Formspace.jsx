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
        borderRadius: '6px',
        background: 'transparent',
        color: '#FFFFFF',
        cursor: 'pointer'
    };

    const inputStyle = {
        width: 'calc(50% - 5px)',
        height: '39px',
        padding: '9px 17px',
        borderRadius: '8px',
        border: '1px solid #ccc',
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
        <div style={{ width: '1440px', height: '900px', margin: '0 auto', background: 'linear-gradient(0deg, #121212, #121212), linear-gradient(0deg, #18181B, #18181B)',
            position: 'relative' }}>
            
            <div style={{ width: '1440px', height: '56px', border: '0px 0px 1px 0px', background: '#18181B', borderBottom: '1px solid #FFFFFF29',
                    fontFamily: 'Open Sans, sans-serif', fontSize: '12px', fontWeight: '600', lineHeight: '21px', textAlign: 'left' }}>
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
                            top: '17px', left: '19px',
                            position: 'absolute'
                        }}
                    />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
                <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', marginTop: '2px' }}>
                    <span onClick={handleFlowClick} style={activeButton === 'Flow' ? activeButtonStyle : buttonStyle}>Flow</span>
                    <span onClick={handleThemeClick} style={activeButton === 'Theme' ? activeButtonStyle : buttonStyle}>Theme</span>
                    <span onClick={() => handleResponseClick(formId)} style={activeButton === 'Response' ? activeButtonStyle : buttonStyle}>Response</span>
                </div>
                <div style={{ left: '82%', position: 'absolute', top: '0%', display: 'flex', flexDirection: 'row', gap: '30px' }}>
                    <button onClick={handleSave} style={{ width: '71px', height: '32px', borderRadius: '6px', background: '#4ADE80CC', color: '#FFFFFF', fontSize: '14px', fontWeight: '600',
                        lineHeight: '21px', border: 'none', marginTop: '10px' }} type="submit">Save</button>

                    <button onClick={handleCancel} style={{ width: '86px', height: '32px', borderRadius: '6px', background: '#18181B', color: '#FFFFFF', fontSize: '14px', fontWeight: '600',
                        lineHeight: '21px', border: '1px solid #FFFFFF', marginTop: '10px' }}>Cancel</button>

                    <button onClick={handleShare} style={{ width: '89px', height: '32px', borderRadius: '6px', background: '#2563EB', color: '#FFFFFF', fontSize: '14px', fontWeight: '600',
                        lineHeight: '21px', border: 'none', marginTop: '10px' }}>Share</button>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '20px' }}>
                <div style={{ width: '48%', display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '70px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '20px' }}>
                        <div>
                            <img src={Text} alt="Text" style={{ cursor: 'pointer' }} onClick={() => handleInputClick('text')} />
                        </div>
                        <div>
                            <img src={Image} alt="Image" style={{ cursor: 'pointer' }} onClick={() => handleInputClick('image')} />
                        </div>
                        <div>
                            <img src={Video} alt="Video" style={{ cursor: 'pointer' }} onClick={() => handleInputClick('video')} />
                        </div>
                        <div>
                            <img src={Gif} alt="Gif" style={{ cursor: 'pointer' }} onClick={() => handleInputClick('gif')} />
                        </div>
                        <div>
                            <img src={Buttons} alt="Buttons" style={{ cursor: 'pointer' }} onClick={() => handleInputClick('button')} />
                        </div>
                    </div>

                    <div style={sectionStyle}>
                        <div style={{ fontFamily: 'Open Sans', fontSize: '14px', fontWeight: '600', lineHeight: '19px', textAlign: 'left', color: '#FFFFFF' }}>Options</div>
                        <div style={itemsContainerStyle}>
                            {inputs.filter(input => input.type === 'text').map(input => (
                                <div key={input.id}>
                                    <input
                                        type="text"
                                        value={input.value}
                                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                                        placeholder={`Text${inputs.filter(i => i.type === 'text').indexOf(input) + 1}`}
                                        style={inputStyle}
                                    />
                                    <img src={Close} alt="Delete" style={{ cursor: 'pointer' }} onClick={() => handleDeleteClick(input.id)} />
                                </div>
                            ))}
                            {inputs.filter(input => input.type === 'image').map(input => (
                                <div key={input.id}>
                                    <input
                                        type="text"
                                        value={input.value}
                                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                                        placeholder={`Image${inputs.filter(i => i.type === 'image').indexOf(input) + 1}`}
                                        style={inputStyle}
                                    />
                                    <img src={Close} alt="Delete" style={{ cursor: 'pointer' }} onClick={() => handleDeleteClick(input.id)} />
                                </div>
                            ))}
                            {inputs.filter(input => input.type === 'video').map(input => (
                                <div key={input.id}>
                                    <input
                                        type="text"
                                        value={input.value}
                                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                                        placeholder={`Video${inputs.filter(i => i.type === 'video').indexOf(input) + 1}`}
                                        style={inputStyle}
                                    />
                                    <img src={Close} alt="Delete" style={{ cursor: 'pointer' }} onClick={() => handleDeleteClick(input.id)} />
                                </div>
                            ))}
                            {inputs.filter(input => input.type === 'gif').map(input => (
                                <div key={input.id}>
                                    <input
                                        type="text"
                                        value={input.value}
                                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                                        placeholder={`Gif${inputs.filter(i => i.type === 'gif').indexOf(input) + 1}`}
                                        style={inputStyle}
                                    />
                                    <img src={Close} alt="Delete" style={{ cursor: 'pointer' }} onClick={() => handleDeleteClick(input.id)} />
                                </div>
                            ))}
                            {inputs.filter(input => input.type === 'button').map(input => (
                                <div key={input.id}>
                                    <input
                                        type="text"
                                        value={input.value}
                                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                                        placeholder={`Button${inputs.filter(i => i.type === 'button').indexOf(input) + 1}`}
                                        style={inputStyle}
                                    />
                                    <img src={Close} alt="Delete" style={{ cursor: 'pointer' }} onClick={() => handleDeleteClick(input.id)} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ width: '48%', display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '70px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '20px' }}>
                        <div>
                            <img src={InputText} alt="Input Text" style={{ cursor: 'pointer' }} onClick={() => handleInputClick('text')} />
                        </div>
                        <div>
                            <img src={Number} alt="Number" style={{ cursor: 'pointer' }} onClick={() => handleInputClick('number')} />
                        </div>
                        <div>
                            <img src={Email} alt="Email" style={{ cursor: 'pointer' }} onClick={() => handleInputClick('email')} />
                        </div>
                        <div>
                            <img src={Phone} alt="Phone" style={{ cursor: 'pointer' }} onClick={() => handleInputClick('phone')} />
                        </div>
                        <div>
                            <img src={Date} alt="Date" style={{ cursor: 'pointer' }} onClick={() => handleInputClick('date')} />
                        </div>
                        <div>
                            <img src={Rating} alt="Rating" style={{ cursor: 'pointer' }} onClick={() => handleInputClick('rating')} />
                        </div>
                    </div>

                    <div style={sectionStyle}>
                        <div style={{ fontFamily: 'Open Sans', fontSize: '14px', fontWeight: '600', lineHeight: '19px', textAlign: 'left', color: '#FFFFFF' }}>Inputs</div>
                        <div style={itemsContainerStyle}>
                            {inputs.filter(input => input.type === 'text').map(input => (
                                <div key={input.id}>
                                    <input
                                        type="text"
                                        value={input.value}
                                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                                        placeholder={`Text${inputs.filter(i => i.type === 'text').indexOf(input) + 1}`}
                                        style={inputStyle}
                                    />
                                    <img src={Close} alt="Delete" style={{ cursor: 'pointer' }} onClick={() => handleDeleteClick(input.id)} />
                                </div>
                            ))}
                            {inputs.filter(input => input.type === 'number').map(input => (
                                <div key={input.id}>
                                    <input
                                        type="text"
                                        value={input.value}
                                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                                        placeholder={`Number${inputs.filter(i => i.type === 'number').indexOf(input) + 1}`}
                                        style={inputStyle}
                                    />
                                    <img src={Close} alt="Delete" style={{ cursor: 'pointer' }} onClick={() => handleDeleteClick(input.id)} />
                                </div>
                            ))}
                            {inputs.filter(input => input.type === 'email').map(input => (
                                <div key={input.id}>
                                    <input
                                        type="text"
                                        value={input.value}
                                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                                        placeholder={`Email${inputs.filter(i => i.type === 'email').indexOf(input) + 1}`}
                                        style={inputStyle}
                                    />
                                    <img src={Close} alt="Delete" style={{ cursor: 'pointer' }} onClick={() => handleDeleteClick(input.id)} />
                                </div>
                            ))}
                            {inputs.filter(input => input.type === 'phone').map(input => (
                                <div key={input.id}>
                                    <input
                                        type="text"
                                        value={input.value}
                                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                                        placeholder={`Phone${inputs.filter(i => i.type === 'phone').indexOf(input) + 1}`}
                                        style={inputStyle}
                                    />
                                    <img src={Close} alt="Delete" style={{ cursor: 'pointer' }} onClick={() => handleDeleteClick(input.id)} />
                                </div>
                            ))}
                            {inputs.filter(input => input.type === 'date').map(input => (
                                <div key={input.id}>
                                    <input
                                        type="text"
                                        value={input.value}
                                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                                        placeholder={`Date${inputs.filter(i => i.type === 'date').indexOf(input) + 1}`}
                                        style={inputStyle}
                                    />
                                    <img src={Close} alt="Delete" style={{ cursor: 'pointer' }} onClick={() => handleDeleteClick(input.id)} />
                                </div>
                            ))}
                            {inputs.filter(input => input.type === 'rating').map(input => (
                                <div key={input.id}>
                                    <input
                                        type="text"
                                        value={input.value}
                                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                                        placeholder={`Rating${inputs.filter(i => i.type === 'rating').indexOf(input) + 1}`}
                                        style={inputStyle}
                                    />
                                    <img src={Close} alt="Delete" style={{ cursor: 'pointer' }} onClick={() => handleDeleteClick(input.id)} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormSpace;
