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
    const [themeColor, setThemeColor] = useState('#1F1F23'); // Default color

    useEffect(() => {
        const savedColor = localStorage.getItem('selectedThemeColor');
        if (savedColor) {
            setThemeColor(savedColor);
        }
    }, []);

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const backendUrl = process.env.REACT_APP_FORMBOT_BACKEND_URL;
                if (!backendUrl) throw new Error('Backend URL is not defined');

                const response = await axios.get(`${backendUrl}/form/getForm/${formId}`);
                const data = response.data.data || {};

                console.log('Fetched Data:', data);

                const combined = data.inputs || [];

                setFormData(data);
                setCombinedInputs(combined);
                setFormValues(combined.reduce((acc, input) => {
                    acc[input._id] = input.value || '';
                    return acc;
                }, {}));
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

    const handleInputChange = (id, event) => {
        const { value } = event.target;
        setFormValues(prevValues => ({
            ...prevValues,
            [id]: value
        }));
    };

    const handleDateChange = (id, date) => {
        setSelectedDate(date);
        setFormValues(prevValues => ({
            ...prevValues,
            [id]: date
        }));
    };

    const handleRatingChange = (id, rating) => {
        setSelectedRating(rating);
        setFormValues(prevValues => ({
            ...prevValues,
            [id]: rating
        }));
    };

    const handleNextClick = (index) => {
        setVisibleIndices(prevIndices => {
            const nextIndex = Math.min(index + 1, combinedInputs.length - 1);
            if (!prevIndices.includes(nextIndex)) {
                return [...prevIndices, nextIndex];
            }
            return prevIndices;
        });
    };

    const handlePreviousClick = () => {
        setVisibleIndices(prevIndices => prevIndices.slice(0, -1));
    };

    const handleImageClick = () => {
        setIsClicked(!isClicked);
        handleNextClick(visibleIndices[visibleIndices.length - 1]);
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
            setFormValues({});
            setSelectedDate(null);
            setSelectedRating(null);
            setVisibleIndices([0]);
        } catch (error) {
            console.error('Error saving form data:', error);
        }
    };

    const renderInput = (input, index) => {
        if (!input) {
            console.warn(`Undefined input at index ${index}`);
            return null;
        }

        const { type, _id, value } = input;

        const commonStyle = {
            position: 'relative',
            marginBottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        };

        const nextButton = (
            <button type="button" onClick={() => handleNextClick(index)} style={{ marginLeft: '10px' }}>
                Next
            </button>
        );

        switch (type) {
            case 'dateInputs':
                return (
                    <div key={`${_id}-${index}`} style={commonStyle}>
                        <div style={inputContainerStyle}>
                            <Calendar
                                onChange={(date) => handleDateChange(_id, date)}
                                value={selectedDate}
                                selectRange={false}
                                style={calendarStyle}
                            />
                            <button
                                type="button"
                                onClick={() => handleInputChange(_id, { target: { value: selectedDate } })}
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
                        {nextButton}
                    </div>
                );
            case 'ratingInputs':
                return (
                    <div key={`${_id}-${index}`} style={commonStyle}>
                        <div style={ratingContainerStyle}>
                            {[1, 2, 3, 4, 5].map((circle) => (
                                <span
                                    key={`${_id}-${index}-${circle}`}
                                    style={{
                                        ...circleStyle,
                                        backgroundColor: circle <= selectedRating ? '#FFD700' : '#ddd',
                                    }}
                                    onClick={() => handleRatingChange(_id, circle)}
                                >
                                    {circle}
                                </span>
                            ))}
                        </div>
                        {nextButton}
                    </div>
                );
            case 'textInputs':
                return (
                    <div key={`${_id}-${index}`} style={commonStyle}>
                        <input
                            type="text"
                            value={formValues[_id] || value || ''}
                            onChange={(event) => handleInputChange(_id, event)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
                        />
                        {nextButton}
                    </div>
                );
            case 'imageInputs':
                return (
                    <div key={`${_id}-${index}`} style={commonStyle}>
                        <img src={value} alt="Image Input" style={{ width: '100%' }} />
                        {nextButton}
                    </div>
                );
            case 'tinputs':
                return (
                    <div key={`${_id}-${index}`} style={commonStyle}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={formValues[_id] || value || ''}
                                placeholder="Type here..."
                                onChange={(event) => handleInputChange(_id, event)}
                                style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
                            />
                        </div>
                        {nextButton}
                    </div>
                );
            case 'gifInputs':
                return (
                    <div key={`${_id}-${index}`} style={commonStyle}>
                        <img src={value} alt="GIF Input" style={{ width: '100%' }} />
                        {nextButton}
                    </div>
                );
            case 'videoInputs':
            case 'numberInputs':
            case 'emailInputs':
            case 'phoneInputs':
            case 'buttonInputs':
                return (
                    <div key={`${_id}-${index}`} style={commonStyle}>
                        <div style={inputContainerStyle}>
                            <input
                                type="text"
                                value={formValues[_id] || value || ''}
                                onChange={(event) => handleInputChange(_id, event)}
                                style={inputStyle}
                            />
                            {type === 'buttonInputs' && (
                                <button
                                    type="button"
                                    onClick={() => handleInputChange(_id, { target: { value: value || '' } })}
                                    style={buttonStyle}
                                >
                                    {input.label || 'Button'}
                                </button>
                            )}
                        </div>
                        {nextButton}
                    </div>
                );
            default:
                return null;
        }
    };

    const inputContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
    };

    const calendarStyle = {
        width: '100%',
        border: '1px solid #ccc',
    };

    const buttonStyle = {
        padding: '8px 16px',
        backgroundColor: themeColor,
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
    };

    const ratingContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
    };

    const circleStyle = {
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        display: 'inline-block',
        lineHeight: '24px',
        textAlign: 'center',
        cursor: 'pointer',
    };

    const inputStyle = {
        width: '100%',
        padding: '8px',
        border: '1px solid #ccc',
    };

    return (
        <div className="formbot-container">
            <h1>{formData.formName}</h1>
            <form onSubmit={handleSubmit}>
                {visibleIndices.map((index) => {
                    const input = combinedInputs[index];
                    return renderInput(input, index);
                })}
                {visibleIndices.length < combinedInputs.length && (
                    <button type="button" onClick={() => handleNextClick(visibleIndices.length - 1)}>
                        Next
                    </button>
                )}
                {visibleIndices.length > 1 && (
                    <button type="button" onClick={handlePreviousClick}>
                        Previous
                    </button>
                )}
                <button type="submit" style={buttonStyle}>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Formbot;
