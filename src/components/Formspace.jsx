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
    const [formData, setFormData] = useState(null);
    const [inputCounts, setInputCounts] = useState({
        text: 0,
        image: 0,
        video: 0,
        gif: 0,
        number: 0,
        email: 0,
        date: 0,
        phone: 0,
        rating: 0,
        button: 0,
        tinput: 0
    });

    useEffect(() => {
        if (formId) {
            console.log('Setting formId in context:', formId);
            setSelectedFormId(formId);
        }

        const fetchFormData = async () => {
            try {
                const backendUrl = process.env.REACT_APP_FORMBOT_BACKEND_URL;
                if (!backendUrl) {
                    throw new Error('Backend URL is not defined');
                }
              const response = await axios.get(`${backendUrl}/form/getForm/${formId}`);
              setFormData(response.data);
            } catch (error) {
              console.error('Error fetching form data:', error);
              setError('Failed to fetch form data.');
            }
          };
      
          fetchFormData();
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

        // Ensure inputs are structured correctly
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
            buttonInputs: assignSerialNumbers(inputs.filter(input => input.type === 'button')),
            tinputs: assignSerialNumbers(inputs.filter(input => input.type === 'tinput'))
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
    
            // Clear form fields
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
        try {
            
            // If formId is not available in URL, attempt to get it from handleSave
            if (!formId) {
                const savedFormId = await handleSave();
                if (savedFormId) {
                    const formLink = `${window.location.origin}/form/${savedFormId}`;
                    await navigator.clipboard.writeText(formLink);
                    console.log('Link copied to clipboard:', formLink);
                    alert('Link copied to clipboard');
                } else {
                    console.error('Failed to retrieve form ID from handleSave');
                    alert('Failed to retrieve form ID from handleSave');
                }
            } else {
                const formLink = `${window.location.origin}/form/${formId}`;
                await navigator.clipboard.writeText(formLink);
                console.log('Link copied to clipboard:', formLink);
                alert('Link copied to clipboard');
            }
        } catch (error) {
            console.error('Error in handleShare:', error);
            alert('An error occurred while sharing the link');
        }
    };
    
    const handleInputClick = (type) => {
        const newCount = inputCounts[type] + 1;
        setInputCounts(prevCounts => ({
            ...prevCounts,
            [type]: newCount
        }));
        setInputs([...inputs, { id: inputs.length + 1, type, name: `${type.charAt(0).toUpperCase() + type.slice(1)}${newCount}`, value: '', visible: true }]);
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
        navigate(`/theme/${formId}`)
    };

    const handleFlowClick = () => {
        handleClick('Flow');
        navigate(`/formspace/${formId}`);
    };


    const renderInput = (input) => {
        switch (input.type) {
            case 'text':
                return (
                    <div key={input.id} style={{ margin: '10px 0', display: 'flex', alignItems: 'center', gap: '10px', height: '119px', background: '#18181B', position: 'relative' }}>
                        <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '20px', fontWeight: '600', lineHeight: '21px', textAlign: 'left', color: '#FFFFFF', top: '-35px', left: '20px', position: 'relative' }}>{input.name}</span>
                        <input
                            type="text"
                            value={input.value}
                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                            placeholder="Click here to edit"
                            style={{width:'330px',height:'45px',marginTop:'20px',bordeRadius:'5px 5px 5px 5px',background: '#1F1F23',border: '1px solid #F55050',
                                color:'#FFFFFF',marginRight:'50px'
                            }}
                        />
                        <img src={Deleete} alt="Delete" onClick={() => handleDeleteClick(input.id)} style={{ cursor: 'pointer',position:'absolute', top: '-1px', left: '310px' }}/>
                    </div>
                );
            case 'number':
                return (
                    <div key={input.id} style={{ margin: '10px 0', display: 'flex', alignItems: 'center', gap: '10px', height: '119px', background: '#18181B', position: 'relative' }}>
                        <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '20px', fontWeight: '600', lineHeight: '21px', textAlign: 'left', color: '#FFFFFF', top: '-35px', left: '20px', position: 'relative' }}>{input.name}</span>
                        <input
                            type="number"
                            value={input.value}
                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                            placeholder="Click here to edit"
                            style={{width:'330px',height:'45px',marginTop:'20px',bordeRadius:'5px 5px 5px 5px',background: '#1F1F23',border: '1px solid #F55050',
                                color:'#FFFFFF',marginRight:'50px'
                            }}
                        />
                         <img src={Deleete} alt="Delete" onClick={() => handleDeleteClick(input.id)} style={{ cursor: 'pointer',position:'absolute', top: '-1px', left: '310px' }} />
                    </div>
                );
            case 'email':
                return (
                    <div key={input.id} style={{ margin: '10px 0', display: 'flex', alignItems: 'center', gap: '10px', height: '119px', background: '#18181B', position: 'relative' }}>
                        <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '20px', fontWeight: '600', lineHeight: '21px', textAlign: 'left', color: '#FFFFFF', top: '-35px', left: '20px', position: 'relative' }}>{input.name}</span>
                        <input
                            type="email"
                            value={input.value}
                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                            placeholder="Click here to edit"
                            style={{width:'330px',height:'45px',marginTop:'20px',bordeRadius:'5px 5px 5px 5px',background: '#1F1F23',border: '1px solid #F55050',
                                color:'#FFFFFF',marginRight:'50px'
                            }}
                        />
                         <img src={Deleete} alt="Delete" onClick={() => handleDeleteClick(input.id)} style={{ cursor: 'pointer',position:'absolute', top: '-1px', left: '310px' }} />
                    </div>
                );
            case 'phone':
                return (
                    <div key={input.id} style={{ margin: '10px 0', display: 'flex', alignItems: 'center', gap: '10px', height: '119px', background: '#18181B', position: 'relative' }}>
                        <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '20px', fontWeight: '600', lineHeight: '21px', textAlign: 'left', color: '#FFFFFF', top: '-35px', left: '20px', position: 'relative' }}>{input.name}</span>
                        <input
                            type="tel"
                            value={input.value}
                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                            placeholder="Click here to edit"
                            style={{width:'330px',height:'45px',marginTop:'20px',bordeRadius:'5px 5px 5px 5px',background: '#1F1F23',border: '1px solid #F55050',
                                color:'#FFFFFF',marginRight:'50px'
                            }}
                        />
                         <img src={Deleete} alt="Delete" onClick={() => handleDeleteClick(input.id)} style={{ cursor: 'pointer',position:'absolute', top: '-1px', left: '310px' }} />
                    </div>
                );
            case 'date':
                return (
                    <div key={input.id} style={{ margin: '10px 0', display: 'flex', alignItems: 'center', gap: '10px', height: '119px', background: '#18181B', position: 'relative' }}>
                        <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '20px', fontWeight: '600', lineHeight: '21px', textAlign: 'left', color: '#FFFFFF', top: '-35px', left: '20px', position: 'relative' }}>{input.name}</span>
                        <input
                            type="date"
                            value={input.value}
                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                            placeholder="Click here to edit"
                            style={{width:'330px',height:'45px',marginTop:'20px',bordeRadius:'5px 5px 5px 5px',background: '#1F1F23',border: '1px solid #F55050',
                                color:'#FFFFFF',marginRight:'50px'
                            }}
                        />
                         <img src={Deleete} alt="Delete" onClick={() => handleDeleteClick(input.id)} style={{ cursor: 'pointer',position:'absolute', top: '-1px', left: '310px' }} />
                    </div>
                );
            case 'tinput':
                return (
                    <div key={input.id} style={{ margin: '10px 0', display: 'flex', alignItems: 'center', gap: '10px', height: '119px', background: '#18181B', position: 'relative' }}>
                        <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '20px', fontWeight: '600', lineHeight: '21px', textAlign: 'left', color: '#FFFFFF', top: '-35px', left: '20px', position: 'relative' }}>{input.name}</span>
                        <input
                            type="text"
                            value={input.value}
                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                            placeholder="Click here to edit"
                            style={{width:'330px',height:'45px',marginTop:'20px',bordeRadius:'5px 5px 5px 5px',background: '#1F1F23',border: '1px solid #F55050',
                                color:'#FFFFFF',marginRight:'50px'
                            }}
                        />
                         <img src={Deleete} alt="Delete" onClick={() => handleDeleteClick(input.id)} style={{ cursor: 'pointer',position:'absolute', top: '-1px', left: '310px' }} />
                    </div>
                );
            case 'rating':
                return (
                    <div key={input.id} style={{ margin: '10px 0', display: 'flex', alignItems: 'center', gap: '10px', height: '119px', background: '#18181B', position: 'relative' }}>
                        <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '20px', fontWeight: '600', lineHeight: '21px', textAlign: 'left', color: '#FFFFFF', top: '-35px', left: '20px', position: 'relative' }}>{input.name}</span>
                        <input
                            type="number"
                            value={input.value}
                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                            min="1"
                            max="5"
                            placeholder="Click here to edit"
                            style={{width:'330px',height:'45px',marginTop:'20px',bordeRadius:'5px 5px 5px 5px',background: '#1F1F23',border: '1px solid #F55050',
                                color:'#FFFFFF',marginRight:'50px'
                            }}
                        />
                         <img src={Deleete} alt="Delete" onClick={() => handleDeleteClick(input.id)} style={{ cursor: 'pointer',position:'absolute', top: '-1px', left: '310px' }} />
                    </div>
                );
            case 'button':
                return (
                    <div key={input.id} style={{ margin: '10px 0', display: 'flex', alignItems: 'center', gap: '10px', height: '119px', background: '#18181B', position: 'relative' }}>
                        <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '20px', fontWeight: '600', lineHeight: '21px', textAlign: 'left', color: '#FFFFFF', top: '-35px', left: '20px', position: 'relative' }}>{input.name}</span>
                        <button onClick={() => alert(input.value)}>{input.value || 'Click me'}</button>
                        <input
                            type="text"
                            value={input.value}
                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                            placeholder="Button Text"
                            style={{width:'330px',height:'45px',marginTop:'20px',bordeRadius:'5px 5px 5px 5px',background: '#1F1F23',border: '1px solid #F55050',
                                color:'#FFFFFF',marginRight:'50px'
                            }}
                        />
                         <img src={Deleete} alt="Delete" onClick={() => handleDeleteClick(input.id)} style={{ cursor: 'pointer',position:'absolute', top: '-1px', left: '310px' }} />
                    </div>
                );
            case 'image':
                return (
                    <div key={input.id} style={{ margin: '10px 0', display: 'flex', alignItems: 'center', gap: '10px', height: '119px', background: '#18181B', position: 'relative' }}>
                        <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '20px', fontWeight: '600', lineHeight: '21px', textAlign: 'left', color: '#FFFFFF', top: '-35px', left: '20px', position: 'relative' }}>{input.name}</span>
                        <input
                            type="text"
                            value={input.value}
                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                            placeholder="Click here to edit"
                            style={{width:'330px',height:'45px',marginTop:'20px',bordeRadius:'5px 5px 5px 5px',background: '#1F1F23',border: '1px solid #F55050',
                                color:'#FFFFFF',marginRight:'50px'
                            }}
                        />
                         <img src={Deleete} alt="Delete" onClick={() => handleDeleteClick(input.id)} style={{ cursor: 'pointer',position:'absolute', top: '-1px', left: '310px' }} />
                    </div>
                );
            case 'video':
                return (
                    <div key={input.id} style={{ margin: '10px 0', display: 'flex', alignItems: 'center', gap: '10px', height: '119px', background: '#18181B', position: 'relative' }}>
                        <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '20px', fontWeight: '600', lineHeight: '21px', textAlign: 'left', color: '#FFFFFF', top: '-35px', left: '20px', position: 'relative' }}>{input.name}</span>
                        <input
                            type="text"
                            value={input.value}
                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                            placeholder="Click here to edit"
                            style={{width:'330px',height:'45px',marginTop:'20px',bordeRadius:'5px 5px 5px 5px',background: '#1F1F23',border: '1px solid #F55050',
                                color:'#FFFFFF',marginRight:'50px'
                            }}
                        />
                         <img src={Deleete} alt="Delete" onClick={() => handleDeleteClick(input.id)} style={{ cursor: 'pointer',position:'absolute', top: '-1px', left: '310px' }} />
                    </div>
                );
            case 'gif':
                return (
                    <div key={input.id} style={{ margin: '10px 0', display: 'flex', alignItems: 'center', gap: '10px', height: '119px', background: '#18181B', position: 'relative' }}>
                        <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '20px', fontWeight: '600', lineHeight: '21px', textAlign: 'left', color: '#FFFFFF', top: '-35px', left: '20px', position: 'relative' }}>{input.name}</span>
                        <input
                            type="text"
                            value={input.value}
                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                            placeholder="Click here to edit"
                            style={{width:'330px',height:'45px',marginTop:'20px',bordeRadius:'5px 5px 5px 5px',background: '#1F1F23',border: '1px solid #F55050',
                                color:'#FFFFFF',marginRight:'50px'
                            }}
                        />
                         <img src={Deleete} alt="Delete" onClick={() => handleDeleteClick(input.id)} style={{ cursor: 'pointer',position:'absolute', top: '-1px', left: '310px' }} />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div  style={{ width: '1440px', height: '900px', margin: '0 auto', background: 'linear-gradient(0deg, #121212, #121212), linear-gradient(0deg, #18181B, #18181B)',
            position: 'relative' }}>



                <div style={{width: '344px',height: '812px',top: '72px',left: '16px',padding: '65px 17px 0px 17px',borderRadius: '8px',border: '1px solid #ccc',
			            background: '#18181B',position: 'absolute'}}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                        <p style={{fontFamily: 'Open Sans,sans-serif',fontSize:'14px',fontWeight: '600',lineHeight:'21px',textAlign:'left',color:'#FFFFFFEB'}}>Bubbles</p>
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                            <div style={{width: 'calc(50% - 5px)', display: 'flex', justifyContent: 'center'}}>
                                <img onClick={() => handleInputClick('text')} src={Text} alt="Text" style={{ height: 'auto', cursor: 'pointer'}} />
                            </div>
                            <div style={{width: 'calc(50% - 5px)', display: 'flex', justifyContent: 'center'}}>
                                <img onClick={() => handleInputClick('image')} src={Image} alt="Image" style={{ height: 'auto', cursor: 'pointer'}} />
                            </div>
                            <div style={{width: 'calc(50% - 5px)', display: 'flex', justifyContent: 'center'}}>
                                <img onClick={() => handleInputClick('video')} src={Video} alt="Video" style={{ height: 'auto', cursor: 'pointer'}} />
                            </div>
                            <div style={{width: 'calc(50% - 5px)', display: 'flex', justifyContent: 'center'}}>
                                <img onClick={() => handleInputClick('gif')} src={Gif} alt="Gif" style={{ height: 'auto', cursor: 'pointer'}} />
                            </div>
                        </div>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                        <p style={{fontFamily: 'Open Sans,sans-serif',fontSize:'14px',fontWeight: '600',lineHeight:'21px',textAlign:'left',color:'#FFFFFFEB'}}>Inputs</p>
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                            <div style={{width: 'calc(50% - 5px)', display: 'flex', justifyContent: 'center'}}>
                                <img onClick={() => handleInputClick('tinput')} src={InputText} alt="Text Input" style={{width: '100%', height: 'auto', cursor: 'pointer'}} />
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
                                <img onClick={() => handleInputClick('button')} src={Buttons} alt="Buttons" style={{width: '100%', height: 'auto', cursor: 'pointer'}} />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ position: 'absolute',width: '309px',height:'60px',top: '134px',left: '655px',borderRadius: '16px' }}>
                    <img src={Start} alt="Start" />
                </div>
           

            <form onSubmit={handleSave} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px', width: '315px', top: '200px', left: '635px', borderRadius: '8px', position: 'relative' }}>
                    {inputs.map((input) => (
                        <div key={input.id}>
                            {renderInput(input)}
                        </div>
                    ))}
                </div>
            </form>

            <div style={{ width: '1440px', height: '56px', border: '0px 0px 1px 0px', background: '#18181B', borderBottom: '1px solid #FFFFFF29',top:'0px',
                    fontFamily: 'Open Sans,sans-serif', fontSize: '12px', fontWeight: '600', lineHeight: '21px', textAlign: 'left',position:'absolute'
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

                <div style={{left: '82%', position: 'absolute', top: '20%', display: 'flex', flexDirection: 'row', gap: '30px' }}>
                    <button type="submit">Save</button>
                    <img type="button" src={Close} onClick={handleCancel}/>
                    <button type="button" onClick={handleShare}>Share</button>
                </div>


                <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                    <div>
                        <span style={activeButton === 'Flow' ? activeButtonStyle : buttonStyle} onClick={handleFlowClick}>Flow</span>
                    </div>
                    <div>
                        <span style={activeButton === 'Theme' ? activeButtonStyle : buttonStyle} onClick={handleThemeClick}>Theme</span>
                    </div>
                    <div>
                        <span style={activeButton === 'Response' ? activeButtonStyle : buttonStyle} onClick={() => handleResponseClick(formId)}>Response</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Formspace;
