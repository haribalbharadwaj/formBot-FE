import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Formbot = () => {
    const { formId } = useParams();
    const [formData, setFormData] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [visibleIndex, setVisibleIndex] = useState(0);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedRating, setSelectedRating] = useState(null);
    const [combinedInputs, setCombinedInputs] = useState([]);

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const backendUrl = process.env.REACT_APP_FORMBOT_BACKEND_URL;
                if (!backendUrl) {
                    throw new Error('Backend URL is not defined');
                }

                const response = await axios.get(`${backendUrl}/form/getForm/${formId}`);
                const data = response.data.data || {};

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

                // Combine all inputs and sort them by serialNo
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
                ].sort((a, b) => a.serialNo - b.serialNo); // Sort by serialNo

                setFormData(data);
                setFormValues(initialValues);
                setCombinedInputs(combined);
            } catch (error) {
                console.error('Error fetching form data:', error);
            }
        };

        fetchFormData();
    }, [formId]);

    const handleInputChange = (type, index, event) => {
        const newValues = { ...formValues };
        if (type === 'dateInputs') {
            newValues[type][index].value = selectedDate;
        } else {
            newValues[type][index].value = event.target.value;
        }
        setFormValues(newValues);
    };

    const handleRatingChange = (rating) => {
        setSelectedRating(rating);
        setFormValues(prevValues => ({
            ...prevValues,
            ratingInputs: [{ ...prevValues.ratingInputs[0], value: rating }]
        }));
    };

    const handleNextClick = () => {
        setVisibleIndex(prevIndex => Math.min(prevIndex + 1, combinedInputs.length - 1));
    };

    const handlePreviousClick = () => {
        setVisibleIndex(prevIndex => Math.max(prevIndex - 1, 0));
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
            setVisibleIndex(0);
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
                <div key={id} style={inputContainerStyle}>
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
                <div key={id} style={inputContainerStyle}>
                    <img src={value} alt={`image-${index}`} style={imageStyle} />
                </div>
            );
        }

        if (type === 'videoInputs') {
            return (
                <div key={id} style={inputContainerStyle}>
                    <video src={value} controls style={videoStyle} />
                </div>
            );
        }

        if (type === 'gifInputs') {
            return (
                <div key={id} style={inputContainerStyle}>
                    <img src={value} alt={`gif-${index}`} style={gifStyle} />
                </div>
            );
        }

        return (
            <div key={id} style={inputContainerStyle}>
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
        <div style={containerStyle}>
            <h1>{formData.formName}</h1>
            <div style={descriptionStyle}>Above are rating and phone number</div>
            <form onSubmit={handleSubmit}>
                <div style={formContainerStyle}>
                    {combinedInputs.slice(0, visibleIndex + 1).map((input, index) => (
                        <div key={index} style={inputWrapperStyle}>
                            {renderInput(input, index)}
                        </div>
                    ))}
                </div>
                {visibleIndex < combinedInputs.length - 1 && (
                    <button type="button" onClick={handleNextClick} style={buttonStyle}>
                        Next
                    </button>
                )}
                {visibleIndex > 0 && (
                    <button type="button" onClick={handlePreviousClick} style={buttonStyle}>
                        Previous
                    </button>
                )}
                {visibleIndex >= combinedInputs.length - 1 && (
                    <button type="submit" style={buttonStyle}>Submit</button>
                )}
            </form>
        </div>
    );
};

const containerStyle = {
    padding: '20px'
};

const formContainerStyle = {
    marginTop: '20px'
};

const descriptionStyle = {
    marginBottom: '20px'
};

const inputWrapperStyle = {
    marginBottom: '20px'
};

const inputContainerStyle = {
    marginBottom: '10px'
};

const buttonStyle = {
    marginTop: '20px'
};

const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc'
};

const calendarStyle = {
    width: '100%'
};

const ratingContainerStyle = {
    display: 'flex',
    marginBottom: '10px'
};

const ratingCircleStyle = {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '5px',
    cursor: 'pointer',
    backgroundColor: '#f0f0f0'
};

const selectedRatingStyle = {
    backgroundColor: '#7EA6FF',
    color: '#fff'
};

const imageStyle = {
    width: '100%',
    height: 'auto'
};

const videoStyle = {
    width: '100%',
    height: 'auto'
};

const gifStyle = {
    width: '100%',
    height: 'auto'
};

export default Formbot;
