import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Textlogo from "../../assets/text.png";
import Tlogo from "../../assets/Tlogo.png";
import Send from "../../assets/send.png";

const Formbot = () => {
    const { formId } = useParams();
    const [formData, setFormData] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [visibleIndices, setVisibleIndices] = useState([0]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedRating, setSelectedRating] = useState(null);
    const [combinedInputs, setCombinedInputs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const backendUrl = process.env.REACT_APP_FORMBOT_BACKEND_URL;
                if (!backendUrl) throw new Error('Backend URL is not defined');

                const response = await axios.get(`${backendUrl}/form/getForm/${formId}`);
                const data = response.data.data || {};

                const combined = [
                    ...(data.textInputs || []).map(input => ({ ...input, type: 'textInputs' })),
                    ...(data.imageInputs || []).map(input => ({ ...input, type: 'imageInputs' })),
                    ...(data.videoInputs || []).map(input => ({ ...input, type: 'videoInputs' })),
                    ...(data.gifInputs || []).map(input => ({ ...input, type: 'gifInputs' })),
                    ...(data.numberInputs || []).map(input => ({ ...input, type: 'numberInputs' })),
                    ...(data.emailInputs || []).map(input => ({ ...input, type: 'emailInputs' })),
                    ...(data.dateInputs || []).map(input => ({ ...input, type: 'dateInputs' })),
                    ...(data.phoneInputs || []).map(input => ({ ...input, type: 'phoneInputs' })),
                    ...(data.ratingInputs || []).map(input => ({ ...input, type: 'ratingInputs' })),
                    ...(data.buttonInputs || []).map(input => ({ ...input, type: 'buttonInputs' })),
                    ...(data.tinputs || []).map(input => ({ ...input, type: 'tinputs' })) // Add tinputs
                ].sort((a, b) => a.id - b.id); // Sort by id

                setFormData(data);
                setFormValues({
                    textInputs: data.textInputs || [],
                    imageInputs: data.imageInputs || [],
                    videoInputs: data.videoInputs || [],
                    gifInputs: data.gifInputs || [],
                    numberInputs: data.numberInputs || [],
                    emailInputs: data.emailInputs || [],
                    dateInputs: data.dateInputs || [],
                    phoneInputs: data.phoneInputs || [],
                    ratingInputs: data.ratingInputs || [],
                    buttonInputs: data.buttonInputs || [],
                    tinputs: data.tinputs || [] // Initialize tinputs
                });
                setCombinedInputs(combined);
            } catch (error) {
                console.error('Error fetching form data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFormData();
    }, [formId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleInputChange = (type, index, event) => {
        setFormValues(prevValues => ({
            ...prevValues,
            [type]: prevValues[type].map((input, idx) =>
                idx === index ? { ...input, value: event.target.value } : input
            )
        }));
    };

    const handleDateChange = (index, date) => {
        setSelectedDate(date);
        setFormValues(prevValues => ({
            ...prevValues,
            dateInputs: prevValues.dateInputs.map((input, idx) =>
                idx === index ? { ...input, value: date } : input
            )
        }));
    };

    const handleRatingChange = (index, rating) => {
        setSelectedRating(rating);
        setFormValues(prevValues => ({
            ...prevValues,
            ratingInputs: prevValues.ratingInputs.map((input, idx) =>
                idx === index ? { ...input, value: rating } : input
            )
        }));
    };

    const handleNextClick = () => {
        setVisibleIndices(prevIndices => [
            ...prevIndices,
            Math.min(prevIndices[prevIndices.length - 1] + 1, combinedInputs.length - 1)
        ]);
    };

    const handlePreviousClick = () => {
        setVisibleIndices(prevIndices => prevIndices.slice(0, -1));
    };

    const handleImageClick = () => {
        setIsClicked(!isClicked);
        handleNextClick(); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formDataToSend = {
            formName: formData.formName,
            ...formValues
        };
    
        try {
            const backendUrl = process.env.REACT_APP_FORMBOT_BACKEND_URL;
            if (!backendUrl) throw new Error('Backend URL is not defined');
    
            await axios.put(`${backendUrl}/form/updateForm/${formId}`, formDataToSend);
    
            // Reset form values after submission
            setFormValues({
                textInputs: (formData.textInputs || []).map(input => ({ ...input, value: '' })),
                imageInputs: (formData.imageInputs || []).map(input => ({ ...input, value: '' })),
                videoInputs: (formData.videoInputs || []).map(input => ({ ...input, value: '' })),
                gifInputs: (formData.gifInputs || []).map(input => ({ ...input, value: '' })),
                numberInputs: (formData.numberInputs || []).map(input => ({ ...input, value: '' })),
                emailInputs: (formData.emailInputs || []).map(input => ({ ...input, value: '' })),
                dateInputs: (formData.dateInputs || []).map(input => ({ ...input, value: null })),
                phoneInputs: (formData.phoneInputs || []).map(input => ({ ...input, value: '' })),
                ratingInputs: (formData.ratingInputs || []).map(input => ({ ...input, value: '' })),
                buttonInputs: (formData.buttonInputs || []).map(input => ({ ...input, value: '' })),
                tinputs: (formData.tinputs || []).map(input => ({ ...input, value: '' })) // Reset tinputs
            });
            setSelectedDate(null);
            setSelectedRating(null);
            setVisibleIndices([0]);
        } catch (error) {
            console.error('Error saving form data:', error);
        }
    };
    

    const renderInput = (input, index) => {
        const { type, id, value } = input;

        switch (type) {
            case 'dateInputs':
                return (
                    <div key={id} style={{left:'70%',position:'absolute'}}>
                        <div style={inputContainerStyle}>
                            <Calendar
                                onChange={(date) => handleDateChange(index, date)}
                                value={selectedDate}
                                selectRange={false}
                                style={calendarStyle}
                            />
                            <button
                                type="button"
                                onClick={() => handleInputChange(type, index)}
                                disabled={!selectedDate}
                                style={buttonStyle}
                            >
                                Set Date
                            </button>
                        </div>
                        <img
                            type="button"
                            src={Send}
                            alt="Logo"
                            onClick={handleImageClick}
                            style={{
                                filter: isClicked ? 'invert(34%) sepia(5%) saturate(0%) hue-rotate(189deg) brightness(91%) contrast(94%)' : 'invert(35%) sepia(100%) saturate(748%) hue-rotate(184deg) brightness(96%) contrast(101%)'
                            }}
                        />
                    </div>
                );
            case 'ratingInputs':
                return (
                    <div key={id} style={{left:'70%',position:'absolute'}}>
                        <div style={ratingContainerStyle}>
                            {[1, 2, 3, 4, 5].map((circle) => (
                                <span
                                    key={circle}
                                    onClick={() => handleRatingChange(index, circle)}
                                    style={{
                                        ...circleStyle,
                                        backgroundColor: formValues.ratingInputs[index]?.value === circle ? '#FFD700' : '#007bff',
                                    }}
                                >
                                    {circle}
                                </span>
                            ))}
                            <img
                                type="button"
                                src={Send}
                                alt="Logo"
                                onClick={handleImageClick}
                                style={{
                                    filter: isClicked ? 'invert(34%) sepia(5%) saturate(0%) hue-rotate(189deg) brightness(91%) contrast(94%)' : 'invert(35%) sepia(100%) saturate(748%) hue-rotate(184deg) brightness(96%) contrast(101%)'
                                }}
                            />
                        </div>
                    </div>
                );
            case 'imageInputs':
                return (
                    <div key={id} style={inputContainerStyle}>
                        <img src={value} alt="Image Input" style={mediaStyle} />
                    </div>
                );
            case 'videoInputs':
                return (
                    <div key={id} style={inputContainerStyle}>
                        <video controls src={value} style={mediaStyle} />
                    </div>
                );
            case 'gifInputs':
                return (
                    <div key={id} style={inputContainerStyle}>
                        <img src={value} alt="GIF Input" style={mediaStyle} />
                    </div>
                );
                case 'textInputs':
                return (
                    <div key={id} style={{height:'7%',background:'#EEEEEE',fontFamily:'Open Sans,sans-serif',padding:'10px',
                        width:'auto',fontSize:'15px',fontWeight:'600',lineHeight:'20.43px',textAlign: 'left',color:'#847F7F',
                        marginTop:'2px',borderRadius:'2px'}}>
                        <div style={inputWithLogoStyle}>
                            <img src={Textlogo} alt="Logo" style={{height:'7%'}} />
                            <span>{value}</span>
                        </div>
                    </div>
                );
                case 'tinputs':
                    return (
                        <div key={id} style={{left:'70%',position:'absolute'}}>
                            <div style={inputWithLogoStyle}>
                                <img src={Tlogo} alt="Logo" style={logoStyle} />
                                <input
                                    type="text"
                                    value={formValues[type]?.[index]?.value || ''}
                                    onChange={(e) => handleInputChange(type, index, e)}
                                    style={inputStyle}
                                />
                                 <img
                                    type="button"
                                    src={Send}
                                    alt="Logo"
                                    onClick={handleImageClick}
                                    style={{
                                        filter: isClicked ? 'invert(34%) sepia(5%) saturate(0%) hue-rotate(189deg) brightness(91%) contrast(94%)' : 'invert(35%) sepia(100%) saturate(748%) hue-rotate(184deg) brightness(96%) contrast(101%)'
                                    }}
                                />
                            </div>
                        </div>
                    );
                    case 'numberInputs':
                return (
                    <div key={id} style={{left:'70%',position:'absolute'}}>
                        <input
                        type={type.replace('Inputs','')}
                        value={formValues[type]?.[index]?.vlue || ''}
                        onChange={(e)=>handleInputChange(type,index,e)}
                        style={inputStyle}
                        />
                         <img
                                type="button"
                                src={Send}
                                alt="Logo"
                                onClick={handleImageClick}
                                style={{
                                    filter: isClicked ? 'invert(34%) sepia(5%) saturate(0%) hue-rotate(189deg) brightness(91%) contrast(94%)' : 'invert(35%) sepia(100%) saturate(748%) hue-rotate(184deg) brightness(96%) contrast(101%)'
                                }}
                            />
                    </div>
                );
                case 'emailInputs':
                    return( 
                    <div key={id} style={{left:'70%',position:'absolute'}}>
                         <input
                            type={type.replace('Inputs','')}
                            value={formValues[type]?.[index]?.vlue || ''}
                            onChange={(e)=>handleInputChange(type,index,e)}
                            style={inputStyle}
                        />
                        <img
                        type="button"
                        src={Send}
                        alt="Logo"
                        onClick={handleImageClick}
                        style={{
                        filter: isClicked ? 'invert(34%) sepia(5%) saturate(0%) hue-rotate(189deg) brightness(91%) contrast(94%)' : 'invert(35%) sepia(100%) saturate(748%) hue-rotate(184deg) brightness(96%) contrast(101%)'
                        }}
                                />
    
    
                    </div>)
                case 'phoneInputs':
                    return (
                        <div key={id} style={{left:'70%',position:'absolute'}}>
                            <label>{type.replace('Inputs', '')}:</label>
                            <input
                                type={type.replace('Inputs', '')}
                                value={formValues[type]?.[index]?.value || ''}
                                onChange={(e) => handleInputChange(type, index, e)}
                                style={inputStyle}
                            />
                             <img
                                    type="button"
                                    src={Send}
                                    alt="Logo"
                                    onClick={handleImageClick}
                                    style={{
                                        filter: isClicked ? 'invert(34%) sepia(5%) saturate(0%) hue-rotate(189deg) brightness(91%) contrast(94%)' : 'invert(35%) sepia(100%) saturate(748%) hue-rotate(184deg) brightness(96%) contrast(101%)'
                                    }}
                                />
                        </div>
                    );
                case 'buttonInputs':
                    return (
                        <div key={id} style={{left:'70%',position:'absolute'}}>
                            <button style={{width:'45px',height:'37px',left:'75%',borderRadius:'6px',background: '#FF8E21',color:'#FFFFFF'
                            }}> onClick={handleNextClick}{value}</button>
                        </div>
                    );
                default:
                    return null;
                       
        }
    };

    return (
        <div>
            <div style={{top:'12%',width:'auto',left:'20%',padding: '1rem',position:'absolute'}}>
            <form onSubmit={handleSubmit}>
                {visibleIndices.map((index) => (
                    renderInput(combinedInputs[index], index)
                ))}
                <div style={navigationContainerStyle}>
                    <button
                        type="button"
                        onClick={handlePreviousClick}
                        disabled={visibleIndices.length === 1}
                        style={buttonStyle}
                    >
                        Previous
                    </button>
                    <button
                        type="button"
                        onClick={handleNextClick}
                        disabled={visibleIndices.length === combinedInputs.length}
                        style={buttonStyle}
                    >
                        Next
                    </button>
                    <button type="submit" style={buttonStyle}>
                        Submit
                    </button>
                </div>
            </form>
            </div>
        </div>
    );
};

// Styles
const inputContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginBottom: '20px'
};

const calendarStyle = {
    marginBottom: '10px'
};

const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
};

const ratingContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px'
};

const circleStyle = {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: '#007bff',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 5px',
    cursor: 'pointer'
};

const mediaStyle = {
    width: '100%',
    maxWidth: '500px',
    height: 'auto',
    marginBottom: '20px'
};

const textInputStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px'
};

const textAreaContainer = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
};

const textAreaStyle = {
    width: '100%',
    maxWidth: '500px',
    height: '100px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginBottom: '10px'
};

export default Formbot;
