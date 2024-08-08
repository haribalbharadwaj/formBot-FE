import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Formbot.css';
import { useParams } from 'react-router-dom';
import Send from "../../assets/send.png";
import Textlogo from "../../assets/text.png";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function Formbot() {
    const { formId } = useParams();
    const [formData, setFormData] = useState(null);
    const [inputs, setInputs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inputValues, setInputValues] = useState({});
    const [visibleInputs, setVisibleInputs] = useState([]);
    const [buttonColors, setButtonColors] = useState([]);
    const [clickedButtons, setClickedButtons] = useState({});
    const [inputColors, setInputColors] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedRating, setSelectedRating] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const backendUrl = process.env.REACT_APP_FORMBOT_BACKEND_URL;
                if (!backendUrl) throw new Error('Backend URL is not defined');

                const response = await axios.get(`${backendUrl}/form/getForm/${formId}`);
                const data = response.data.data || {};

                const inputsArray = data.inputs || [];
                const combinedInputs = inputsArray.map(input => ({
                    ...input._doc,
                    type: input.type
                })).sort((a, b) => a.id - b.id);

                const initialValues = combinedInputs.reduce((acc, input) => {
                    acc[input._id] = input.value;
                    return acc;
                }, {});

                setInputValues(initialValues);
                setFormData(data);
                setInputs(combinedInputs);
                setLoading(false);
                setVisibleInputs(new Array(combinedInputs.length).fill(false));
                setButtonColors(new Array(combinedInputs.length).fill('#1A5FFF'));
                setInputColors(new Array(combinedInputs.length).fill('#FFFFFF'));

                setFormValues(prevValues => ({
                    ...prevValues,
                    ratingInputs: prevValues.ratingInputs || combinedInputs.filter(input => input.type === 'ratingInputs').map(input => ({ value: null }))
                }));
            } catch (error) {
                console.error('Error fetching form data:', error);
                setLoading(false);
            }
        };

        fetchFormData();
    }, [formId]);

    useEffect(() => {
        if (inputs.length > 0) {
            handleNext(0); // Show the first input and handle automatic progression
        }
    }, [inputs]);

    const handleChange = (id, value) => {
        setInputValues(prevValues => ({
            ...prevValues,
            [id]: value
        }));
    };

    const handleButtonClick = (id) => {
        setClickedButtons(prev => ({ ...prev, [id]: !prev[id] }));
        handleChange(id, inputValues[id] || '');

        const index = inputs.findIndex(input => input._id === id);
        if (index !== -1) {
            handleNext(index);
        }
    };

    const handleDateChange = (date, id) => {
        setSelectedDate(date);
        setInputValues(prevValues => ({
            ...prevValues,
            [id]: date ? date.toISOString().split('T')[0] : ''
        }));
        handleNext(currentIndex); // Move to the next input
    };

    const handleNext = (index) => {
        if (index >= inputs.length - 1) return;

        const nextIndex = findNextInteractiveInputIndex(index);

        if (nextIndex < inputs.length) {
            setVisibleInputs(prevState => prevState.map((visible, i) => i <= nextIndex));
            setButtonColors(prevColors => prevColors.map((color, i) => i === nextIndex ? '#777777' : color));
            setInputColors(prevColors => prevColors.map((color, i) => i === nextIndex ? '#777777' : color));
            setCurrentIndex(nextIndex);
        }
    };

    const findNextInteractiveInputIndex = (currentIndex) => {
        for (let i = currentIndex + 1; i < inputs.length; i++) {
            if (inputs[i].type !== 'textInputs' && inputs[i].type !== 'imageInputs' && inputs[i].type !== 'videoInputs' && inputs[i].type !== 'gifInputs') {
                return i;
            }
        }
        return currentIndex;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const backendUrl = process.env.REACT_APP_FORMBOT_BACKEND_URL;
            if (!backendUrl) throw new Error('Backend URL is not defined');
    
            // Assuming inputs is an array of input objects with _id, type, and value
            const updatedInputs = {
                textInputs: [],
                imageInputs: [],
                videoInputs: [],
                gifInputs: [],
                tinputs: [],
                numberInputs: [],
                phoneInputs: [],
                emailInputs: [],
                dateInputs: [],
                ratingInputs: [],
                buttonInputs: []
            };
    
            inputs.forEach(input => {
                if (input._id in inputValues) {
                    input.value = inputValues[input._id];
                }
                updatedInputs[input.type].push(input);
            });
    
            const response = await axios.put(`${backendUrl}/form/updateForm/${formId}`, {
                formName: formData.formName,
                textInputs: updatedInputs.textInputs,
                imageInputs: updatedInputs.imageInputs,
                videoInputs: updatedInputs.videoInputs,
                gifInputs: updatedInputs.gifInputs,
                tinputs: updatedInputs.tinputs,
                numberInputs: updatedInputs.numberInputs,
                phoneInputs: updatedInputs.phoneInputs,
                emailInputs: updatedInputs.emailInputs,
                dateInputs: updatedInputs.dateInputs,
                ratingInputs: updatedInputs.ratingInputs,
                buttonInputs: updatedInputs.buttonInputs,
                refUserId: formData.refUserId
            });
    
            console.log('Form submitted successfully:', response.data);
            setInputValues({});
            const interactiveInputs = inputs.map((input, index) => {
                return input.type !== 'textInputs' && input.type !== 'imageInputs' && input.type !== 'videoInputs' && input.type !== 'gifInputs' ? index <= 1 : index === 0;
            });
            setVisibleInputs(interactiveInputs);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
    

    const fontStyle = {
        fontFamily: 'Open Sans,sans-serif',
        fontSize: '15px',
        fontWeight: '600',
        lineHeight: '20.43px',
        textAlign: 'left'
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

    const handleRatingChange = (index, rating) => {
        setSelectedRating(rating);
    
        // Ensure that ratingInputs is defined and is an array
        setFormValues(prevValues => ({
            ...prevValues,
            ratingInputs: Array.isArray(prevValues.ratingInputs)
                ? prevValues.ratingInputs.map((input, idx) =>
                    idx === index ? { ...input, value: rating } : input
                )
                : [{ value: rating }] // Initialize if it was undefined
        }));
    
        handleNext(currentIndex);
    };
    

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="formbot-container">
            {inputs.map((input, index) => {
                const isVisible = visibleInputs[index];
                const inputValue = inputValues[input._id] || '';

                return (
                    <div key={input._id} style={{ display: isVisible ? 'block' : 'none', marginBottom: '20px' }}>
                        {input.type === 'textInputs' && (
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                <img src={Textlogo} alt="Logo" style={{ height: '7%', marginRight: '10px' }} />
                                <p alt={`text ${index}`}>{input.value}</p>
                            </div>
                        )}
                        {input.type === 'imageInputs' && (
                            <div>
                                <img src={input.value} alt={`image ${index}`} style={{ maxWidth: '100%', marginBottom: '10px' }} />
                            </div>
                        )}
                        {input.type === 'videoInputs' && (
                            <div>
                                <video src={input.value} controls style={{ maxWidth: '100%', marginBottom: '10px' }} />
                            </div>
                        )}
                        {input.type === 'gifInputs' && (
                            <div>
                                <img src={input.value} alt={`gif ${index}`} style={{ maxWidth: '100%', marginBottom: '10px' }} />
                            </div>
                        )}
                        {input.type === 'tinputs' && (
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => handleChange(input._id, e.target.value)}
                                    style={{ marginRight: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                                <button onClick={() => handleNext(index)} style={{ display: 'block', marginTop: '10px' }}>Next</button>
                            </div>
                        )}
                        {input.type === 'numberInputs' && (
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                <input
                                    type="number"
                                    value={inputValue}
                                    onChange={(e) => handleChange(input._id, e.target.value)}
                                    style={{ marginRight: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                                <button onClick={() => handleNext(index)} style={{ display: 'block', marginTop: '10px' }}>Next</button>
                            </div>
                        )}
                        {input.type === 'emailInputs' && (
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                <input
                                    type="email"
                                    value={inputValue}
                                    onChange={(e) => handleChange(input._id, e.target.value)}
                                    style={{ marginRight: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                                <button onClick={() => handleNext(index)} style={{ display: 'block', marginTop: '10px' }}>Next</button>
                            </div>
                        )}
                        {input.type === 'phoneInputs' && (
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                <input
                                    type="tel"
                                    value={inputValue}
                                    onChange={(e) => handleChange(input._id, e.target.value)}
                                    style={{ marginRight: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                                <button onClick={() => handleNext(index)} style={{ display: 'block', marginTop: '10px' }}>Next</button>
                            </div>
                        )}
                        {input.type === 'dateInputs' && (
                            <div>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => handleDateChange(date, input._id)}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Select a date"
                                    className="custom-datepicker"
                                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                                <button onClick={() => handleNext(index)} style={{ display: 'block', marginTop: '10px' }}>Next</button>
                            </div>
                        )}
                        {input.type === 'ratingInputs' && (
                            <div style={ratingContainerStyle}>
                                {[1, 2, 3, 4, 5].map(rating => (
                                    <div
                                        key={rating}
                                        style={{ ...circleStyle, backgroundColor: rating <= selectedRating ? '#FFD700' : '#007bff' }}
                                        onClick={() => handleRatingChange(index, rating)}
                                    >
                                        {rating}
                                    </div>
                                ))}
                            </div>
                        )}
                        {input.type === 'buttonInputs' && (
                            <div>
                                <button
                                    onClick={() => handleButtonClick(input._id)}
                                    style={{ backgroundColor: clickedButtons[input._id] ? '#FFD700' : buttonColors[index], padding: '10px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                >
                                    {input.value}
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
            <form onSubmit={handleSubmit}>
                <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', borderRadius: '4px', border: 'none', cursor: 'pointer', marginTop: '20px' }}>Submit</button>
            </form>
        </div>
    );
}

export default Formbot;
