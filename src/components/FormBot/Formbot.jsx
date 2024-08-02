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
    
                const priorityOrder = {
                    ratingInputs: 1,
                    phoneInputs: 2,
                    textInputs: 3,
                    imageInputs: 4,
                    videoInputs: 5,
                    gifInputs: 6,
                    numberInputs: 7,
                    emailInputs: 8,
                    dateInputs: 9,
                    buttonInputs: 10
                };
    
                const combined = [
                    ...data.ratingInputs.map(input => ({ ...input, type: 'ratingInputs' })),
                    ...data.phoneInputs.map(input => ({ ...input, type: 'phoneInputs' })),
                    ...data.textInputs.map(input => ({ ...input, type: 'textInputs' })),
                    ...data.imageInputs.map(input => ({ ...input, type: 'imageInputs' })),
                    ...data.videoInputs.map(input => ({ ...input, type: 'videoInputs' })),
                    ...data.gifInputs.map(input => ({ ...input, type: 'gifInputs' })),
                    ...data.numberInputs.map(input => ({ ...input, type: 'numberInputs' })),
                    ...data.emailInputs.map(input => ({ ...input, type: 'emailInputs' })),
                    ...data.dateInputs.map(input => ({ ...input, type: 'dateInputs' })),
                    ...data.buttonInputs.map(input => ({ ...input, type: 'buttonInputs' }))
                ].sort((a, b) => {
                    const priorityA = priorityOrder[a.type] || 100;
                    const priorityB = priorityOrder[b.type] || 100;
                    return priorityA - priorityB || a.position - b.position;
                });
    
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
                    onChange={(event) => handleInputChange(type, index, event)}
                    style={inputStyle}
                />
            </div>
        );
    };

    const containerStyle = {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
    };
    
    const inputContainerStyle = {
        marginBottom: '10px',
    };
    
    const buttonStyle = {
        padding: '10px 20px',
        margin: '5px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    };
    
    const ratingContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
    };
    
    const ratingCircleStyle = {
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        border: '1px solid #ddd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 5px',
        cursor: 'pointer',
    };
    
    const selectedRatingStyle = {
        backgroundColor: '#007bff',
        color: '#fff',
    };
    
    const imageStyle = {
        width: '100%',
        height: 'auto',
    };
    
    const videoStyle = {
        width: '100%',
        height: 'auto',
    };
    
    const gifStyle = {
        width: '100%',
        height: 'auto',
    };
    
    const inputStyle = {
        width: '100%',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ddd',
    };
    
    const formContainerStyle = {
        marginTop: '20px',
    };
    
    const descriptionStyle = {
        fontSize: '18px',
        marginBottom: '10px',
    };
    
    const inputWrapperStyle = {
        marginBottom: '20px',
    };
    

    return (
        <div style={containerStyle}>
            <h1>Welcome</h1>
            <form onSubmit={handleSubmit} style={formContainerStyle}>
                <div>
                    <h2 style={descriptionStyle}>{combinedInputs[visibleIndex]?.description || 'No Description'}</h2>
                    <div></div>
                </div>
                <div style={inputWrapperStyle}>
                    {combinedInputs.slice(visibleIndex, visibleIndex + 1).map(renderInput)}
                </div>
                <div>
                    <button type="button" onClick={handlePreviousClick} disabled={visibleIndex === 0} style={buttonStyle}>Previous</button>
                    <button type="button" onClick={handleNextClick} disabled={visibleIndex >= combinedInputs.length - 1} style={buttonStyle}>Next</button>
                    <button type="submit" style={buttonStyle}>Submit</button>
                </div>
            </form>
        </div>
    );

    
};

export default Formbot;