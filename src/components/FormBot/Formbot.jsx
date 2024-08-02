import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Formbot = () => {
    const { formId } = useParams();
    const [formData, setFormData] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [visibleIndex, setVisibleIndex] = useState(-1); // Start with -1 to show welcome message
    const [showStartMessage, setShowStartMessage] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedRating, setSelectedRating] = useState(null); // State for rating

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const backendUrl = process.env.REACT_APP_FORMBOT_BACKEND_URL;
                if (!backendUrl) {
                    throw new Error('Backend URL is not defined');
                }

                const response = await axios.get(`${backendUrl}/form/getForm/${formId}`);
                const data = response.data.data || {};

                // Initialize form values
                const initialValues = {
                    textInputs: data.textInputs || [],
                    imageInputs: data.imageInputs || [],
                    videoInputs: data.videoInputs || [],
                    gifInputs: data.gifInputs || [],
                    numberInputs: data.numberInputs || [],
                    emailInputs: data.emailInputs || [],
                    dateInputs: data.dateInputs || [],
                    phoneInputs: data.phoneInputs || [],
                    ratingInputs: data.ratingInputs || [],
                    buttonInputs: data.buttonInputs || []
                };

                setFormData(data);
                setFormValues(initialValues);
            } catch (error) {
                console.error('Error fetching form data:', error);
            }
        };

        fetchFormData();
    }, [formId]);

    const handleInputChange = (type, index, event) => {
        const newValues = { ...formValues };
        if (type === 'dateInputs') {
            newValues[type][index].value = selectedDate; // Use selectedDate for date input
        } else {
            newValues[type][index].value = event.target.value;
        }
        setFormValues(newValues);
    };

    const handleRatingChange = (rating) => {
        setSelectedRating(rating);
        setFormValues(prevValues => ({
            ...prevValues,
            ratingInputs: [{ ...prevValues.ratingInputs[0], value: rating }] // Assuming only one rating input
        }));
    };

    const handleNextClick = () => {
        setVisibleIndex(prevIndex => prevIndex + 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = {
            formName: formData.formName,
            textInputs: formValues.textInputs,
            numberInputs: formValues.numberInputs,
            emailInputs: formValues.emailInputs,
            dateInputs: formValues.dateInputs,
            phoneInputs: formValues.phoneInputs,
            ratingInputs: formValues.ratingInputs,
            buttonInputs: formValues.buttonInputs
        };

        try {
            await axios.put(`${process.env.REACT_APP_FORMBOT_BACKEND_URL}/form/updateForm/${formId}`, formDataToSend);
            console.log('Form updated successfully');

            // Clear form values after successful submission
            const initialValues = {
                textInputs: formData.textInputs.map(input => ({ ...input, value: '' })),
                numberInputs: formData.numberInputs.map(input => ({ ...input, value: '' })),
                emailInputs: formData.emailInputs.map(input => ({ ...input, value: '' })),
                dateInputs: formData.dateInputs.map(input => ({ ...input, value: null })),
                phoneInputs: formData.phoneInputs.map(input => ({ ...input, value: '' })),
                ratingInputs: formData.ratingInputs.map(input => ({ ...input, value: '' })),
                buttonInputs: formData.buttonInputs.map(input => ({ ...input, value: '' }))
            };

            setFormValues(initialValues);
            setVisibleIndex(-1); // Reset to show welcome message
        } catch (error) {
            console.error('Error saving form data:', error);
        }
    };

    if (!formData) {
        return <div>Loading...</div>;
    }

    const renderStaticInputs = () => (
        <>
            {formData.imageInputs.length > 0 && formData.imageInputs.map((input, index) => (
                <div key={input.id} style={{ display: visibleIndex === -1 ? 'block' : 'none' }}>
                    <img src={input.value} alt={`image-${index}`} style={{ maxWidth: '100%', height: 'auto' }} />
                    {index === formData.imageInputs.length - 1 && (
                        <button type="button" onClick={handleNextClick} style={buttonStyle}>Next</button>
                    )}
                </div>
            ))}
            {formData.videoInputs.length > 0 && formData.videoInputs.map((input, index) => (
                <div key={input.id} style={{ display: visibleIndex === -1 ? 'block' : 'none' }}>
                    <video src={input.value} controls style={{ maxWidth: '100%', height: 'auto' }} />
                    {index === formData.videoInputs.length - 1 && (
                        <button type="button" onClick={handleNextClick} style={buttonStyle}>Next</button>
                    )}
                </div>
            ))}
            {formData.gifInputs.length > 0 && formData.gifInputs.map((input, index) => (
                <div key={input.id} style={{ display: visibleIndex === -1 ? 'block' : 'none' }}>
                    <img src={input.value} alt={`gif-${index}`} style={{ maxWidth: '100%', height: 'auto' }} />
                    {index === formData.gifInputs.length - 1 && (
                        <button type="button" onClick={handleNextClick} style={buttonStyle}>Next</button>
                    )}
                </div>
            ))}
        </>
    );

    const renderInputs = (type, placeholder) => (
        <div style={{ display: visibleIndex >= 0 ? 'block' : 'none' }}>
            {formData[type]?.length > 0 && formData[type].map((input, index) => (
                <div key={input.id}>
                    {type === 'dateInputs' && (
                        <div>
                            <Calendar
                                onChange={setSelectedDate}
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
                    )}
                    {type === 'ratingInputs' && (
                        <div style={ratingContainerStyle}>
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <div
                                    key={rating}
                                    style={{
                                        ...ratingCircleStyle,
                                        ...(selectedRating === rating ? selectedRatingStyle : {})
                                    }}
                                    onClick={() => handleRatingChange(rating)}
                                >
                                    {rating}
                                </div>
                            ))}
                        </div>
                    )}
                    {type !== 'dateInputs' && type !== 'ratingInputs' && (
                        <input
                            type={type === 'emailInputs' ? 'email' : type === 'numberInputs' ? 'number' : 'text'}
                            value={formValues[type][index]?.value || ''}
                            onChange={(e) => handleInputChange(type, index, e)}
                            placeholder={placeholder}
                            style={inputStyle}
                        />
                    )}
                    {index === formData[type].length - 1 && (
                        <button type="button" onClick={handleNextClick} disabled={!formValues[type][index]?.value} style={buttonStyle}>
                            Next
                        </button>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div>
            <h1>{formData.formName}</h1>
            {showStartMessage && (
                <div>
                    <p>Welcome! Please start filling out the form below:</p>
                    <button onClick={() => {
                        setShowStartMessage(false);
                        handleNextClick(); // Ensure visibility changes
                    }} style={buttonStyle}>
                        Start
                    </button>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                {renderStaticInputs()}
                {visibleIndex >= 0 && renderInputs('textInputs', 'Enter text')}
                {visibleIndex >= 1 && renderInputs('numberInputs', 'Enter number')}
                {visibleIndex >= 2 && renderInputs('emailInputs', 'Enter email')}
                {visibleIndex >= 3 && renderInputs('dateInputs', 'Select date')}
                {visibleIndex >= 4 && renderInputs('phoneInputs', 'Enter phone')}
                {visibleIndex >= 5 && renderInputs('ratingInputs', 'Rate')}
                {visibleIndex >= 6 && renderInputs('buttonInputs', 'Click button')}
                {visibleIndex >= 7 && (
                    <button type="submit" style={buttonStyle}>Submit</button>
                )}
            </form>
        </div>
    );
};

const buttonStyle = {
    backgroundColor: '#0044CC',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '5px',
    fontWeight: 'bold',
    marginTop: '10px'
};

const inputStyle = {
    display: 'block',
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc'
};

const calendarStyle = {
    marginBottom: '10px'
};

const ratingContainerStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '10px'
};

const ratingCircleStyle = {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: '#0044CC',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    fontWeight: 'bold'
};

const selectedRatingStyle = {
    backgroundColor: '#FFD700' // Yellow for selected rating
};

export default Formbot;
