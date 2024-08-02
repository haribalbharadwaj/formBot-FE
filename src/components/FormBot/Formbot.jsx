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
    const [combinedInputs, setCombinedInputs] = useState([]); // New state to hold combined inputs

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

                // Combine inputs into a single array
                const combined = [
                    ...data.textInputs.map(input => ({ ...input, type: 'textInputs' })),
                    ...data.imageInputs.map(input => ({ ...input, type: 'imageInputs' })),
                    ...data.videoInputs.map(input => ({ ...input, type: 'videoInputs' })),
                    ...data.gifInputs.map(input => ({ ...input, type: 'gifInputs' })),
                    ...data.numberInputs.map(input => ({ ...input, type: 'numberInputs' })),
                    ...data.emailInputs.map(input => ({ ...input, type: 'emailInputs' })),
                    ...data.dateInputs.map(input => ({ ...input, type: 'dateInputs' })),
                    ...data.phoneInputs.map(input => ({ ...input, type: 'phoneInputs' })),
                    ...data.ratingInputs.map(input => ({ ...input, type: 'ratingInputs' })),
                    ...data.buttonInputs.map(input => ({ ...input, type: 'buttonInputs' }))
                ].sort((a, b) => a.position - b.position); // Assuming each input has a 'position' property

                setFormData(data);
                setFormValues(initialValues);
                setCombinedInputs(combined); // Set combined inputs
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

    const renderInput = (input, index) => {
        const { type, id, value } = input;

        if (type === 'dateInputs') {
            return (
                <div key={id}>
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
            );
        }

        if (type === 'ratingInputs') {
            return (
                <div key={id} style={ratingContainerStyle}>
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
            );
        }

        if (type === 'imageInputs') {
            return (
                <div key={id}>
                    <img src={value} alt={`image-${index}`} style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
            );
        }

        if (type === 'videoInputs') {
            return (
                <div key={id}>
                    <video src={value} controls style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
            );
        }

        if (type === 'gifInputs') {
            return (
                <div key={id}>
                    <img src={value} alt={`gif-${index}`} style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
            );
        }

        return (
            <div key={id}>
                <input
                    type={type === 'emailInputs' ? 'email' : type === 'numberInputs' ? 'number' : 'text'}
                    value={formValues[type][index]?.value || ''}
                    onChange={(e) => handleInputChange(type, index, e)}
                    placeholder={type === 'buttonInputs' ? 'Click here' : 'Enter text'}
                    style={inputStyle}
                />
            </div>
        );
    };

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
                {visibleIndex >= 0 && combinedInputs.map((input, index) => {
                    if (index === visibleIndex) {
                        return (
                            <div key={index}>
                                {renderInput(input, index)}
                                <button type="button" onClick={handleNextClick} style={buttonStyle}>Next</button>
                            </div>
                        );
                    }
                    return null;
                })}
                {visibleIndex >= combinedInputs.length && (
                    <button type="submit" style={buttonStyle}>Submit</button>
                )}
            </form>
        </div>
    );
};

const inputStyle = {
    margin: '10px',
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc'
};

const buttonStyle = {
    margin: '10px',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
};

const calendarStyle = {
    margin: '10px',
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc'
};

const ratingContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '150px'
};

const ratingCircleStyle = {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: '#ccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
};

const selectedRatingStyle = {
    backgroundColor: '#4CAF50',
    color: 'white'
};

export default Formbot;
