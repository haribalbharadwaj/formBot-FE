import React, { useState } from 'react';
import axios from 'axios';
import Start from './icons/start.svg';
import Delete from './icons/delete.svg';
import Close from './icons/close.svg';
import Text from './icons/text.svg';
import Image from './icons/image.svg';
import Video from './icons/video.svg';
import Gif from './icons/gif.svg';
import Number from './icons/number.svg';
import Email from './icons/email.svg';
import Date from './icons/date.svg';
import Phone from './icons/phone.svg';
import Rating from './icons/rating.svg';
import Buttons from './icons/button.svg';
import InputText from '../assets/New folder/inputText.png';

function Formspace() {
    const [inputs, setInputs] = useState([]);

    const handleInputChange = (id, value) => {
        setInputs(inputs.map(input => input.id === id ? { ...input, value } : input));
    };

    const handleDeleteClick = (id) => {
        setInputs(inputs.filter(input => input.id !== id));
    };

    const handleInputClick = (type) => {
        setInputs([...inputs, { id: Date.now(), type, value: '' }]);
    };

    const handleShare = () => {
        // Implement share functionality here
    };

    const handleCancel = () => {
        // Implement cancel functionality here
    };

    const handleSave = async () => {
        try {
            await axios.post('/api/forms', { inputs });
            // Implement save functionality here, e.g., redirect to another page
        } catch (error) {
            console.error(error);
        }
    };

    const inputStyle = {
        margin: '10px 0',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        width: '100%',
    };

    const itemsContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    };

    const sectionStyle = {
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
        backgroundColor: '#2E2E38',
        borderRadius: '10px',
        border: '1px solid #444',
    };

    const buttonStyle = {
        backgroundColor: '#7EA6FF',
        color: '#FFFFFF',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        padding: '10px 20px',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#1E1E22' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#252529' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
                            {input.type === 'Textinput' && (
                                <input
                                    type="text"
                                    value={input.value}
                                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                                    placeholder="Enter Textinput"
                                    style={inputStyle}
                                />
                            )}
                            {input.type === 'inputText' && (
                                <input
                                    type="text"
                                    value={input.value}
                                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                                    placeholder="Enter inputText"
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
                    <button onClick={() => handleInputClick('Textinput')} style={buttonStyle}><img src={Text} alt="Textinput" /></button>
                    <button onClick={() => handleInputClick('inputText')} style={buttonStyle}><img src={InputText} alt="inputText" /></button>
                    <button onClick={() => handleInputClick('image')} style={buttonStyle}><img src={Image} alt="Image" /></button>
                    <button onClick={() => handleInputClick('video')} style={buttonStyle}><img src={Video} alt="Video" /></button>
                    <button onClick={() => handleInputClick('gif')} style={buttonStyle}><img src={Gif} alt="Gif" /></button>
                    <button onClick={() => handleInputClick('number')} style={buttonStyle}><img src={Number} alt="Number" /></button>
                    <button onClick={() => handleInputClick('email')} style={buttonStyle}><img src={Email} alt="Email" /></button>
                    <button onClick={() => handleInputClick('date')} style={buttonStyle}><img src={Date} alt="Date" /></button>
                    <button onClick={() => handleInputClick('phone')} style={buttonStyle}><img src={Phone} alt="Phone" /></button>
                    <button onClick={() => handleInputClick('rating')} style={buttonStyle}><img src={Rating} alt="Rating" /></button>
                    <button onClick={() => handleInputClick('button')} style={buttonStyle}><img src={Buttons} alt="Button" /></button>
                </div>
            </div>
        </div>
    );
}

export default Formspace;
