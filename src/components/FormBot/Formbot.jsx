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
                    <div key={id} style={{ left: '70%', position: 'absolute', marginBottom: '40px' }}>
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
                    <div key={id} style={{ left: '90%', position: 'absolute', marginBottom: '40px' }}>
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
                    <div key={id}>
                        <img src={value} alt="Image Input" style={mediaStyle} />
                    </div>
                );
            case 'videoInputs':
                return (
                    <div key={id}>
                        <video controls style={mediaStyle}>
                            <source src={value} type="video/mp4" />
                        </video>
                    </div>
                );
            case 'gifInputs':
                return (
                    <div key={id}>
                        <img src={value} alt="GIF Input" style={mediaStyle} />
                    </div>
                );
            case 'tinputs':
                return (
                    <div key={id}>
                        <img src={Tlogo} alt="TInput" style={mediaStyle} />
                    </div>
                );
            default:
                return (
                    <div key={id}>
                        <input
                            type={type === 'emailInputs' ? 'email' : type === 'numberInputs' ? 'number' : type === 'phoneInputs' ? 'tel' : 'text'}
                            value={formValues[type][index]?.value || ''}
                            onChange={(e) => handleInputChange(type, index, e)}
                            placeholder={`Enter ${type.slice(0, -6)} ${index + 1}`}
                            style={inputStyle}
                        />
                        <img
                            type="button"
                            src={Send}
                            alt="Send"
                            onClick={handleImageClick}
                            style={{
                                filter: isClicked ? 'invert(34%) sepia(5%) saturate(0%) hue-rotate(189deg) brightness(91%) contrast(94%)' : 'invert(35%) sepia(100%) saturate(748%) hue-rotate(184deg) brightness(96%) contrast(101%)'
                            }}
                        />
                    </div>
                );
        }
    };

    const inputContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };

    const calendarStyle = {
        marginBottom: '10px',
    };

    const buttonStyle = {
        marginTop: '10px',
        padding: '5px 10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    };

    const ratingContainerStyle = {
        display: 'flex',
        alignItems: 'center',
    };

    const circleStyle = {
        display: 'inline-block',
        width: '30px',
        height: '30px',
        lineHeight: '30px',
        borderRadius: '50%',
        textAlign: 'center',
        color: '#fff',
        marginRight: '5px',
        cursor: 'pointer',
    };

    const mediaStyle = {
        width: '100%',
        height: 'auto',
        marginBottom: '10px',
    };

    const inputStyle = {
        marginBottom: '10px',
        padding: '5px',
        width: '100%',
        border: '1px solid #ccc',
        borderRadius: '4px',
    };

    return (
        <div className="formbot-container">
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>{formData.formName}</h1>
            <form onSubmit={handleSubmit}>
                {combinedInputs.map((input, index) => (
                    visibleIndices.includes(index) && (
                        <div key={input.id}>
                            {renderInput(input, index)}
                        </div>
                    )
                ))}
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    {visibleIndices[visibleIndices.length - 1] < combinedInputs.length - 1 && (
                        <button type="button" onClick={handleNextClick} style={buttonStyle}>
                            Next
                        </button>
                    )}
                    {visibleIndices.length > 1 && (
                        <button type="button" onClick={handlePreviousClick} style={buttonStyle}>
                            Previous
                        </button>
                    )}
                    <button type="submit" style={buttonStyle}>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Formbot;
