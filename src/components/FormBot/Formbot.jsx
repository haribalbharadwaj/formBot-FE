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
        // Retrieve the saved color from localStorage when the component mounts
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
                    acc[input.type] = acc[input.type] || [];
                    acc[input.type].push({ id: input.id, value: input.value || '' });
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
            setFormValues({
                textInputs: [],
                imageInputs: [],
                videoInputs: [],
                gifInputs: [],
                numberInputs: [],
                emailInputs: [],
                dateInputs: [],
                phoneInputs: [],
                ratingInputs: [],
                buttonInputs: [],
                tinputs: []
            });
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

        const { type, id, value } = input;

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
                    <div key={`${id}-${index}`} style={commonStyle}>
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
                        {nextButton}
                    </div>
                );
            case 'ratingInputs':
                return (
                    <div key={`${id}-${index}`} style={commonStyle}>
                        <div style={ratingContainerStyle}>
                            {[1, 2, 3, 4, 5].map((circle) => (
                                <span
                                    key={`${id}-${index}-${circle}`}
                                    style={{
                                        ...circleStyle,
                                        backgroundColor: circle <= selectedRating ? '#FFD700' : '#ddd',
                                    }}
                                    onClick={() => handleRatingChange(index, circle)}
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
                    <div key={`${id}-${index}`} style={commonStyle}>
                        <input
                            type="text"
                            value={formValues.textInputs[index]?.value || ''}
                            onChange={(event) => handleInputChange(type, index, event)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
                        />
                        {nextButton}
                    </div>
                );
            case 'imageInputs':
                return (
                    <div key={`${id}-${index}`} style={commonStyle}>
                        <img src={value} alt="Image Input" style={{ width: '100%' }} />
                        {nextButton}
                    </div>
                );
            case 'tinputs':
                return (
                    <div key={`${id}-${index}`} style={commonStyle}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={formValues.tinputs[index]?.value || ''}
                                placeholder="Type here..."
                                onChange={(event) => handleInputChange(type, index, event)}
                                style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
                            />
                        </div>
                        {nextButton}
                    </div>
                );
            case 'videoInputs':
            case 'gifInputs':
            case 'numberInputs':
            case 'emailInputs':
            case 'phoneInputs':
            case 'buttonInputs':
                return (
                    <div key={`${id}-${index}`} style={commonStyle}>
                        <div style={inputContainerStyle}>
                            <input
                                type="text"
                                value={formValues[type][index]?.value || ''}
                                onChange={(event) => handleInputChange(type, index, event)}
                                style={inputStyle}
                                placeholder={`Enter ${type.slice(0, -6)}`} // removes "Inputs" from the type
                            />
                        </div>
                        {nextButton}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: themeColor, // Apply the theme color
            color: themeColor === '#FFFFFF' ? '#000000' : '#FFFFFF', // Adjust text color for contrast
            padding: '20px'}}>
            <form onSubmit={handleSubmit}>
                {visibleIndices.map(index => renderInput(combinedInputs[index], index))}
                <button type="button" onClick={handlePreviousClick} disabled={visibleIndices.length <= 1}>
                    Previous
                </button>
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

const inputContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10px',
};

const calendarStyle = {
    display: 'block',
    margin: '0 auto',
};

const buttonStyle = {
    marginTop: '10px',
};

const ratingContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const circleStyle = {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#ddd',
    cursor: 'pointer',
    margin: '0 5px',
};

const inputStyle = {
    padding: '10px',
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '5px',
    marginRight: '10px',
};

export default Formbot;
