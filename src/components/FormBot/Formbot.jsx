import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Formbot = () => {
    const { formId } = useParams();
    const [formData, setFormData] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [visibleIndices, setVisibleIndices] = useState([0]);
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

                // Combine all inputs and sort them by id
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
                    ...(data.buttonInputs || []).map(input => ({ ...input, type: 'buttonInputs' }))
                ].sort((a, b) => a.id - b.id); // Sort by id

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
        setFormValues(prevValues => {
            const newValues = { ...prevValues };

            if (!newValues[type]) {
                newValues[type] = [];
            }

            if (!newValues[type][index]) {
                newValues[type][index] = { value: '' };
            }

            if (type === 'dateInputs') {
                newValues[type][index].value = selectedDate;
            } else {
                newValues[type][index].value = event.target.value;
            }

            return newValues;
        });
    };

    const handleRatingChange = (rating) => {
        setSelectedRating(rating);
        setFormValues(prevValues => ({
            ...prevValues,
            ratingInputs: [{ ...prevValues.ratingInputs[0], value: rating }]
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
            console.log('Form updated successfully',response.data);

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
            setVisibleIndices([0]);
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
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            onClick={() => handleRatingChange(star)}
                            style={{
                                fontSize: '2em',
                                cursor: 'pointer',
                                color: selectedRating >= star ? '#FFD700' : '#e4e5e9'
                            }}
                        >
                            &#9733;
                        </span>
                    ))}
                </div>
            );
        }

        if (type === 'imageInputs' || type === 'videoInputs' || type === 'gifInputs') {
            return (
                <div key={id} style={inputContainerStyle}>
                    <label>{type.replace('Inputs', '')} URL:</label>
                    <input
                        type="text"
                        value={formValues[type]?.[index]?.value || ''}
                        onChange={(e) => handleInputChange(type, index, e)}
                        style={inputStyle}
                    />
                </div>
            );
        }

        return (
            <div key={id} style={inputContainerStyle}>
                <label>{type.replace('Inputs', '')}:</label>
                <input
                    type="text"
                    value={formValues[type]?.[index]?.value || ''}
                    onChange={(e) => handleInputChange(type, index, e)}
                    style={inputStyle}
                />
            </div>
        );
    };

    return (
        <div style={containerStyle}>
            <h1>{formData.formName}</h1>
            <form onSubmit={handleSubmit}>
                {visibleIndices.map(index => renderInput(combinedInputs[index], index))}
                <div style={navigationStyle}>
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
                        disabled={visibleIndices[visibleIndices.length - 1] === combinedInputs.length - 1}
                        style={buttonStyle}
                    >
                        Next
                    </button>
                </div>
                <button type="submit" style={submitStyle}>Submit</button>
            </form>
        </div>
    );
};

const containerStyle = {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto'
};

const inputContainerStyle = {
    marginBottom: '20px'
};

const inputStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '1em'
};

const calendarStyle = {
    width: '100%',
    marginBottom: '10px'
};

const ratingContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const navigationStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px'
};

const buttonStyle = {
    padding: '10px 20px',
    fontSize: '1em'
};

const submitStyle = {
    padding: '10px 20px',
    fontSize: '1em',
    width: '100%'
};

export default Formbot;
