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
                    ...(data.buttonInputs || []).map(input => ({ ...input, type: 'buttonInputs' }))
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
                    buttonInputs: data.buttonInputs || []
                });
                setCombinedInputs(combined);
            } catch (error) {
                console.error('Error fetching form data:', error);
            }
        };

        fetchFormData();
    }, [formId]);

    const handleInputChange = (type, index, event) => {
        setFormValues(prevValues => ({
            ...prevValues,
            [type]: prevValues[type].map((input, idx) =>
                idx === index ? { ...input, value: event.target.value } : input
            )
        }));
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setFormValues(prevValues => ({
            ...prevValues,
            dateInputs: prevValues.dateInputs.map(input =>
                ({ ...input, value: date })
            )
        }));
    };

    const handleRatingChange = (rating) => {
        setSelectedRating(rating);
        setFormValues(prevValues => ({
            ...prevValues,
            ratingInputs: prevValues.ratingInputs.map(input =>
                ({ ...input, value: rating })
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
                textInputs: formData.textInputs.map(input => ({ ...input, value: '' })),
                numberInputs: formData.numberInputs.map(input => ({ ...input, value: '' })),
                emailInputs: formData.emailInputs.map(input => ({ ...input, value: '' })),
                dateInputs: formData.dateInputs.map(input => ({ ...input, value: null })),
                phoneInputs: formData.phoneInputs.map(input => ({ ...input, value: '' })),
                ratingInputs: formData.ratingInputs.map(input => ({ ...input, value: '' })),
                buttonInputs: formData.buttonInputs.map(input => ({ ...input, value: '' }))
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
                    <div key={id} style={inputContainerStyle}>
                        <Calendar
                            onChange={handleDateChange}
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
            case 'ratingInputs':
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
            default:
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
        }
    };

    return (
        <div style={{ width: '100%', height: '62.5%', margin: '0 auto' }}>
            <div style={containerStyle}>
                <h1>{formData.formName}</h1>
                <form onSubmit={handleSubmit}>
                    {combinedInputs.map((input, index) => (
                        visibleIndices.includes(index) && renderInput(input, index)
                    ))}
                    <div style={navigationStyle}>
                        <button
                            type="button"
                            onClick={handlePreviousClick}
                            disabled={visibleIndices[0] === 0}
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
                        <button
                            type="submit"
                            style={submitButtonStyle}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Styles
const containerStyle = { padding: '20px' };
const inputContainerStyle = { margin: '10px 0' };
const inputStyle = { width: '100%' };
const buttonStyle = { margin: '5px' };
const submitButtonStyle = { margin: '10px', backgroundColor: '#007bff', color: '#fff' };
const navigationStyle = { margin: '20px 0' };
const calendarStyle = { width: '100%' };
const ratingContainerStyle = { margin: '10px 0', fontSize: '2em' };
const mediaStyle = { width: '100%', height: 'auto' };

export default Formbot;
