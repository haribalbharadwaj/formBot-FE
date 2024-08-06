import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Formbot.css'; // Ensure you have appropriate styles
import { useParams } from 'react-router-dom';
import Send from "../../assets/send.png";
import Textlogo from "../../assets/text.png";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Formbot = () => {
    const { formId } = useParams();
    const [formData, setFormData] = useState(null);
    const [inputs, setInputs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inputValues, setInputValues] = useState({});
    const [visibleInputs, setVisibleInputs] = useState([true]); // Initialize with the first entity visible
    const [buttonColors, setButtonColors] = useState([]);
    const [clickedButtons, setClickedButtons] = useState({});
    const [inputColors,setInputColors]= useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1); 

    const noNextButtonTypes = [
        'textInputs',
        'buttonInputs',
        'imageInputs',
        'videoInputs',
        'gifInputs'
    ];

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const backendUrl = process.env.REACT_APP_FORMBOT_BACKEND_URL;
                if (!backendUrl) throw new Error('Backend URL is not defined');

                const response = await axios.get(`${backendUrl}/form/getForm/${formId}`);
                const data = response.data.data || {};

                console.log('Fetched form data:', data);

                const inputsArray = data.inputs || [];
                const combinedInputs = inputsArray.map(input => ({
                    ...input._doc, // Extract fields from _doc
                    type: input.type
                })).sort((a, b) => a.id - b.id); // Sort by id

                const initialValues = combinedInputs.reduce((acc, input) => {
                    acc[input._id] = input.value;
                    return acc;
                }, {});

                setInputValues(initialValues);
                setFormData(data);
                setInputs(combinedInputs);
                setLoading(false);
                setVisibleInputs(new Array(combinedInputs.length).fill(false).map((_, index) => index === 0)); // Only first visible
                setButtonColors(new Array(combinedInputs.length).fill('#1A5FFF'));
                setInputColors(new Array(combinedInputs.length).fill('#FFFFFF'))
            } catch (error) {
                console.error('Error fetching form data:', error);
                setLoading(false);
            }
        };

        fetchFormData();
    }, [formId]);

    const handleChange = (id, value) => {
        setInputValues(prevValues => ({
            ...prevValues,
            [id]: value
        }));
    };

    const handleShowFirst = () => {
        setCurrentIndex(0);
    };

    const handleNextEntity = () => {
        if (currentIndex < inputs.length - 1) {
            setCurrentIndex(prevIndex => prevIndex + 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const backendUrl = process.env.REACT_APP_FORMBOT_BACKEND_URL;
            if (!backendUrl) throw new Error('Backend URL is not defined');

            const updatedInputs = inputs.map(input => ({
                ...input,
                value: inputValues[input._id]
            }));

            const response = await axios.put(`${backendUrl}/form/updateForm/${formId}`, {
                ...formData,
                inputs: updatedInputs
            });

            console.log('Form submitted successfully:', response.data);

            setInputValues({});
            setVisibleInputs(new Array(inputs.length).fill(false).map((_, index) => index === 0));
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleNext = (index) => {
        setVisibleInputs(prevState => prevState.map((visible, i) => i <= index + 1 ? true : visible));
        setButtonColors(prevColors => prevColors.map((color, i) => i === index ? '#777777' : color));
        setInputColors(prevColors=>prevColors.map((color,i)=>i=== index ? '#777777':color ));
        console.log('Next button clicked:', { index, visibleInputs });
        handleNextEntity();
    };

    const handleButtonClick = (id) => {
        setClickedButtons((prev) => ({ ...prev, [id]: !prev[id] }));
        handleChange(id, inputValues[id] || '');
        console.log('Button clicked:', { id, clickedButtons });
        handleNextEntity();
    };

    const handleDateChange = (date, id) => {
        setSelectedDate(date);
        setInputValues(prevValues => ({
            ...prevValues,
            [id]: date ? date.toISOString().split('T')[0] : ''
        }));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const fontStyle = {
        fontFamily: 'Open Sans,sans-serif',
        fontSize: '15px',
        fontWeight: '600',
        lineHeight: '20.43px',
        textAlign: 'left'
    };

    return (
        <div className="formbot-container">

            <div style={{ width: '79%', height: '70%', top: '84px', left: '103px', padding: '200px 200px 200px 200px', border: '1px red solid', fontFamily: 'Open Sans,sans-serif', fontSize: '15px', fontWeight: '600', lineHeight: '20.43px', textAlign: 'left' }}>

                <form onSubmit={handleSubmit} className="inputs-container">

                    {inputs.map((input, index) => (

                        <div key={input._id} className={`input-item ${visibleInputs[index] ? 'visible' : 'hidden'}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>

                            {input.type === 'textInputs' && (

                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>

                                    <img src={Textlogo} alt="Logo" style={{ height: '7%', marginRight: '10px' }} />
                                    <p style={{ height: '7%', background: '#EEEEEE', fontFamily: 'Open Sans, sans-serif', padding: '10px', width: 'auto', fontSize: '15px', fontWeight: '600',
                                         lineHeight: '20.43px', textAlign: 'left', color: '#847F7F', marginTop: '2px', borderRadius: '2px' }} onClick={handleShowFirst}>
                                        {input.value}
                                    </p>
                                </div>
                            )}
                            {input.type === 'imageInputs' && <img src={input.value} alt={`Image ${index}`} />}

                            {input.type === 'videoInputs' && <video src={input.value} controls />}

                            {input.type === 'gifInputs' && <img src={input.value} alt={`GIF ${index}`} />}

                            {input.type === 'tinputs' && (
                             <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', position: 'absolute',left:'75%' }}>
                                <input
                                    type="text"
                                    value={inputValues[input._id] || ''}
                                    onChange={(e) => handleChange(input._id, e.target.value)}
                                    style={{
                                    width: '331px',
                                    height: '61px',
                                    borderRadius: '4px',
                                    boxShadow: '0px 4px 6.3px 0px #00000040',
                                    color: '#040404',
                                    fontStyle,
                                    backgroundColor: typeof inputColors[index] === 'string' ? inputColors[index] : 'transparent',
                                    position: 'relative', // Ensure this doesn't overlap other elements
                                    zIndex: 1, // Ensure input is on top
                                    pointerEvents: 'auto', // Ensure pointer events are enabled
                                    }}
                                />
                            <div
                                style={{
                                    backgroundColor: typeof buttonColors[index] === 'string' ? buttonColors[index] : 'transparent',
                                    width: '62px',
                                    height: '61px',
                                    borderRadius: '5px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: '10px',
                                    position: 'relative',
                                    zIndex: 2, // Ensure button is above other elements
                                }}
                                id='Next'
                                >
                                <img
                                    type="button"
                                    onClick={() => handleNext(index)}
                                    src={Send}
                                    style={{ width: '30px', height: '25px', cursor: 'pointer' }}
                                />
                            </div>
                        </div>
                        )}

                            {input.type === 'numberInputs' && (

                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px',left:'75%',position:'absolute' }}>

                                    <input
                                        type="number"
                                        value={inputValues[input._id] || ''}
                                        onChange={(e) => handleChange(input._id, e.target.value)}
                                        style={{ width: '331px', height: '61px', borderRadius: '4px', boxShadow: '0px 4px 6.3px 0px #00000040', color: '#040404', fontStyle , 
                                        backgroundColor: typeof inputColors[index] === 'string' ? inputColors[index] : 'transparent',}}
                                    />
                                    <div style={{  backgroundColor: typeof buttonColors[index] === 'string' ? buttonColors[index] : 'transparent',
                                        width:'62px',height:'61px',borderRadius:'5px', display: 'flex',
                                        justifyContent: 'center',alignItems: 'center', marginLeft: '10px',marginBottom:'20px'}} id='Next'>
                                        <img type="button" onClick={() => handleNext(index)} src={Send} style={{width:'30px',height:'25px'}} />
                                    </div>

                                </div>
                                
                            )}
                            {input.type === 'emailInputs' && (

                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px',left:'75%',position:'absolute' }}>

                                    <input
                                        type="email"
                                        value={inputValues[input._id] || ''}
                                        onChange={(e) => handleChange(input._id, e.target.value)}
                                        style={{ width: '331px', height: '61px', borderRadius: '4px', boxShadow: '0px 4px 6.3px 0px #00000040', color: '#040404', fontStyle,
                                            backgroundColor: typeof inputColors[index] === 'string' ? inputColors[index] : 'transparent',
                                         }}
                                    />
                                    <div style={{  backgroundColor: typeof buttonColors[index] === 'string' ? buttonColors[index] : 'transparent',
                                        width:'62px',height:'61px',borderRadius:'5px', display: 'flex',
                                        justifyContent: 'center',alignItems: 'center', marginLeft: '10px',marginBottom:'20px'}} id='Next'>
                                        <img type="button" onClick={() => handleNext(index)} src={Send} style={{width:'30px',height:'25px'}} />
                                    </div>

                                </div>
                            )}
                            
                            {input.type === 'dateInputs' && (

                                <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px',left:'75%',position:'absolute' }}>

                                    <div style={{ display: 'flex', alignItems: 'center' }}>

                                        <input
                                            type="date"
                                            value={inputValues[input._id] || ''}
                                            onChange={(e) => handleChange(input._id, e.target.value)}
                                            style={{ width: '331px', height: '61px', borderRadius: '4px', boxShadow: '0px 4px 6.3px 0px #00000040', color: '#040404', fontStyle,
                                                backgroundColor: typeof inputColors[index] === 'string' ? inputColors[index] : 'transparent',
                                             }}
                                        />
                                        <div style={{
                                            backgroundColor: typeof buttonColors[index] === 'string' ? buttonColors[index] : 'transparent',
                                            width: '62px', height: '61px', borderRadius: '5px', display: 'flex',
                                            justifyContent: 'center', alignItems: 'center', marginLeft: '10px'}} id='Next'>
                                            <img type="button" onClick={() => handleNext(index)} src={Send} style={{ width: '30px', height: '25px', cursor: 'pointer' }} />
                                        </div>

                                    </div>
                                    <div style={{ marginTop: '20px' }}>

                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={(date) => handleDateChange(date, input._id)}
                                        inline
                                    />
                                    </div>

                                </div>
                            )}

                            {input.type === 'phoneInputs' && (

                                <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px',left:'75%',position:'absolute' }}>

                                    <input
                                        type="tel"
                                        value={inputValues[input._id] || ''}
                                        onChange={(e) => handleChange(input._id, e.target.value)}
                                        style={{ width: '331px', height: '61px', borderRadius: '4px', boxShadow: '0px 4px 6.3px 0px #00000040', color: '#040404', fontStyle,
                                            backgroundColor: typeof inputColors[index] === 'string' ? inputColors[index] : 'transparent',
                                         }}
                                    />
                                    <div style={{  backgroundColor: typeof buttonColors[index] === 'string' ? buttonColors[index] : 'transparent',
                                        width:'62px',height:'61px',borderRadius:'5px', display: 'flex',
                                        justifyContent: 'center',alignItems: 'center', marginLeft: '10px',marginBottom:'20px'}} id='Next'>
                                        <img type="button" onClick={() => handleNext(index)} src={Send} style={{width:'30px',height:'25px'}} />
                                    </div>

                                </div>
                            )}

{input.type === 'ratingInputs' && (
    <div style={{ position: 'relative', width: '100%', maxWidth: '450px', marginLeft: '75%', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <div style={{ position: 'relative', flex: 1 }}>
                <input
                    type="text"
                    readOnly
                    value={(inputValues[input._id] || '')}
                    style={{
                        width: '100%',
                        height: '61px',
                        borderRadius: '4px',
                        boxShadow: '0px 4px 6.3px 0px #00000040',
                        color: '#040404',
                        fontStyle,
                        backgroundColor: typeof inputColors[index] === 'string' ? inputColors[index] : 'transparent',
                        padding: '0 60px', // Adjust padding to create space for circles
                        boxSizing: 'border-box'
                    }}
                />
                <div 
                    style={{ 
                        position: 'absolute',
                        top: '50%', 
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '80%',
                        padding: '0 10px'
                    }}
                >
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <div 
                            key={rating}
                            onClick={() => handleChange(input._id, rating)} // Update rating on click
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: (inputValues[input._id] || 0) === rating ? 'yellow' : 'blue', // Color based on whether rating matches
                                color: 'white',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }}
                        >
                            {rating}
                        </div>
                    ))}
                </div>
            </div>
            <div 
                style={{ 
                    backgroundColor: typeof buttonColors[index] === 'string' ? buttonColors[index] : 'transparent',
                    width: '62px', 
                    height: '61px', 
                    borderRadius: '5px', 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: '10px',
                    cursor: 'pointer'
                }} 
                id='Next'
            >
                <img 
                    type="button" 
                    onClick={() => handleNext(index)} 
                    src={Send} 
                    style={{ width: '30px', height: '25px' }} 
                />
            </div>
        </div>
    </div>
)}


                            

    
                            {input.type === 'buttonInputs' && (
                                <button
                                    type="button"
                                    onClick={() => handleButtonClick(input._id)}
                                    style={{
                                        width: 'auto',
                                        height: '37px',
                                        borderRadius: '6px',
                                        left: '80%',
                                        position: 'absolute',
                                        background: clickedButtons[input._id] ? '#FF8E21' : '#053EC6',
                                        color: 'white',
                                        cursor: 'pointer',
                                        padding: '0 10px',
                                        fontFamily: 'Open Sans, sans-serif',
                                        fontWeight: '600',
                                        lineHeight: '20.43px',
                                        textAlign: 'center'
                                    }}
                                >
                                    {input.value}
                                </button>
                            )}
                            {input.type === 'buttonInputs' && (
                                <div className="send-button" style={{ textAlign: 'right', marginTop: '5px' }}>
                                    <img src={Send} alt="Send" onClick={handleSubmit} style={{ cursor: 'pointer' }} />
                                </div>
                            )}

                        </div>
                        ))}
                           
                </form>
            </div>
        </div>
    );
};

export default Formbot;
