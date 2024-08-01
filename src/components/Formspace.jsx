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
import Deleete from "../assets/delete.png";
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

        const formData = {
            formName,
            inputs
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
            setSuccess('Job added successfully');
            setError('');

            // Clear form fields
            setFormName('');
            setInputs([]);
            localStorage.setItem('userId', response.data.formId); 
            console.log('formId:',formId);

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
        // Reset form fields
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


    const inputStyle={
    width:'calc(50% - 5px)',height:'39px',top:'29px',padding:'9px 17px 9px 17px',borderRadius:'8px',border:'1px',flex: '0 0 calc(50% - 10px)'
    }

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

    return (
        <div style={{ width: '1440px', height: '900px', margin: '0 auto', background: 'linear-gradient(0deg, #121212, #121212), linear-gradient(0deg, #18181B, #18181B)',
            position: 'relative' }}>
            
            <div style={{ width: '1440px', height: '56px', border: '0px 0px 1px 0px', background: '#18181B', borderBottom: '1px solid #FFFFFF29',
                    fontFamily: 'Open Sans,sans-serif', fontSize: '12px', fontWeight: '600', lineHeight: '21px', textAlign: 'left'
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
                            top: '17px', left: '19px',
                            position: 'absolute'
                        }}
                    />
                    {error.name && <p style={{ color: 'red' }}>{error.name}</p>}
                </div>
                <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', marginTop: '2px' }}>
                    <span onClick={handleFlowClick} style={activeButton === 'Flow' ? activeButtonStyle : buttonStyle}>Flow</span>
                    <span onClick={handleThemeClick} style={activeButton === 'Theme' ? activeButtonStyle : buttonStyle}>Theme</span>
                    <span onClick={handleResponseClick} style={activeButton === 'Response' ? activeButtonStyle : buttonStyle}>Response</span>
                </div>
                <div style={{ left: '82%', position: 'absolute', top: '0%', display: 'flex', flexDirection: 'row', gap: '30px' }}>
                    <button onClick={handleSave} style={{ width: '71px', height: '32px', borderRadius: '6px', background: '#4ADE80CC', color: '#FFFFFF', fontSize: '14px', fontWeight: '600',
                        lineHeight: '21px', border: 'none', marginTop: '10px' }} type="submit">Save</button>

                    <button style={{ width: '65px', height: '25px', borderRadius: '4px 0px 0px 0px', marginTop: '10px', background: '#848890'}}
                        onClick={handleShare}>Share</button>
                    <img src={Close} onClick={handleCancel} style={{ width: '14px', height: '14px', marginTop: '20px' }} />
                </div>
            </div>

            <div style={{
    width: '344px',
    height: '812px',
    top: '72px',
    left: '16px',
    padding: '65px 17px 0px 17px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    background: '#18181B',
    position: 'absolute'
}}>
    <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
        <p style={{fontFamily: 'Open Sans,sans-serif',fontSize:'14px',fontWeight: '600',lineHeight:'21px',textAlign:'left',color:'#FFFFFFEB'}}>Bubbles</p>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
            <div style={{width: 'calc(50% - 5px)', display: 'flex', justifyContent: 'center'}}>
                <img onClick={() => handleInputClick('text')} src={Text} alt="Text" style={{width: '100%', height: 'auto', cursor: 'pointer'}} />
            </div>
            <div style={{width: 'calc(50% - 5px)', display: 'flex', justifyContent: 'center'}}>
                <img onClick={() => handleInputClick('image')} src={Image} alt="Image" style={{width: '100%', height: 'auto', cursor: 'pointer'}} />
            </div>
            <div style={{width: 'calc(50% - 5px)', display: 'flex', justifyContent: 'center'}}>
                <img onClick={() => handleInputClick('video')} src={Video} alt="Video" style={{width: '100%', height: 'auto', cursor: 'pointer'}} />
            </div>
            <div style={{width: 'calc(50% - 5px)', display: 'flex', justifyContent: 'center'}}>
                <img onClick={() => handleInputClick('gif')} src={Gif} alt="Gif" style={{width: '100%', height: 'auto', cursor: 'pointer'}} />
            </div>
        </div>
    </div>

    <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
        <p style={{fontFamily: 'Open Sans,sans-serif',fontSize:'14px',fontWeight: '600',lineHeight:'21px',textAlign:'left',color:'#FFFFFFEB'}}>Inputs</p>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
            <div style={{width: 'calc(50% - 5px)', display: 'flex', justifyContent: 'center'}}>
                <img onClick={() => handleInputClick('textInput')} src={InputText} alt="Text Input" style={{width: '100%', height: 'auto', cursor: 'pointer'}} />
            </div>
            <div style={{width: 'calc(50% - 5px)', display: 'flex', justifyContent: 'center'}}>
                <img onClick={() => handleInputClick('number')} src={Number} alt="Number" style={{width: '100%', height: 'auto', cursor: 'pointer'}} />
            </div>
            <div style={{width: 'calc(50% - 5px)', display: 'flex', justifyContent: 'center'}}>
                <img onClick={() => handleInputClick('email')} src={Email} alt="Email" style={{width: '100%', height: 'auto', cursor: 'pointer'}} />
            </div>
            <div style={{width: 'calc(50% - 5px)', display: 'flex', justifyContent: 'center'}}>
                <img onClick={() => handleInputClick('phone')} src={Phone} alt="Phone" style={{width: '100%', height: 'auto', cursor: 'pointer'}} />
            </div>
            <div style={{width: 'calc(50% - 5px)', display: 'flex', justifyContent: 'center'}}>
                <img onClick={() => handleInputClick('date')} src={Date} alt="Date" style={{width: '100%', height: 'auto', cursor: 'pointer'}} />
            </div>
            <div style={{width: 'calc(50% - 5px)', display: 'flex', justifyContent: 'center'}}>
                <img onClick={() => handleInputClick('rating')} src={Rating} alt="Rating" style={{width: '100%', height: 'auto', cursor: 'pointer'}} />
            </div>
            <div style={{width: 'calc(50% - 5px)', display: 'flex', justifyContent: 'center'}}>
                <img onClick={() => handleInputClick('buttons')} src={Buttons} alt="Buttons" style={{width: '100%', height: 'auto', cursor: 'pointer'}} />
            </div>
        </div>
    </div>
</div>


            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px',width: '315px',top:'200px',
                left:'655px',borderRadius: '8px',position:'absolute' }}>
                {inputs.map(input => (
                    <div key={input.id} style={{ margin: '10px 0', display: 'flex', alignItems: 'center', gap: '10px',height:'119px',
                        background:'#18181B',position:'relative'
                     }}>
                        <span style={{fontFamily: 'Open Sans,sans-serif',fontSize: '20px',fontWeight:'600',lineHeight:'21px',
                            textAlign:'left',color:'#FFFFFF',top:'-35px',left:'20px',position:'relative'}}>{input.type}</span>
                        <input
                            type={input.type === 'textInput' ? 'text' : input.type === 'number' ? 'number' : 'text'}
                            value={input.value}
                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                            placeholder={`Enter ${input.type}`}
                            style={{width: '283px',height:'45px',top:'252px',left:'672px',borderRadius: '5px',
                             background:'#1F1F23',border: '1px solid #F55050'  }}
                        />
                        <img src={Deleete} alt="Delete" onClick={() => handleDeleteClick(input.id)} 
                        style={{ cursor: 'pointer',top:'0px',left:'310px' }} />
                    </div>
                ))}
            </div>

            <div style={{ position: 'absolute',width: '309px',height:'60px',top: '134px',left: '655px',borderRadius: '16px' }}>
                <img src={Start} alt="Start" />
            </div>
        </div>
    );
}

export default Formspace;
