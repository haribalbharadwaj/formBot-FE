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
            setButtonColors(prevColors => prevColors.map((color, i) => i === nextIndex ? '#1A5FFF' : color));
            setInputColors(prevColors => prevColors.map((color, i) => i === nextIndex ? '#FFFFFF' : color));
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

    const handleImageClick = () => {
        setIsClicked(!isClicked);
        handleNext(currentIndex); 
    };
    

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='Body'  style={{ padding: '20px', boxSizing: 'border-box' }}>
            <div className="formbot-container" style={{ width: '100%', maxWidth: '100%' }}>
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
                            <div style={{ display: 'flex',justifyContent: 'flex-start',position:'relative',left:'40%' }}>
                                <input className='text-input' type="text" value={inputValue} onChange={(e) => handleChange(input._id, e.target.value)}
                                    style={{ marginRight: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc',
                                        width:'23%',height:'7%',color: '#040404',backgroundColor: typeof inputColors[index] === 'string' ? inputColors[index] : 'transparent'}}/>
                                <div  className='next'style={{borderRadius: '5px',
                                    backgroundColor: typeof buttonColors[index] === 'string' ? buttonColors[index] : 'transparent',
                                    display: 'flex',justifyContent: 'center',alignItems: 'center'}}  >
                                        <img type="button" src={Send} alt="Logo"
                                        onClick={() => {
                                            handleNext(index);
                                            document.querySelector('.text-input').style.backgroundColor = '#777777';  // Change box color
                                            document.querySelector('.next').style.backgroundColor = '#777777';  // Change button color
                                        }} 
                                        style={{ marginTop:'4px',width: '30px', height: '25px', cursor: 'pointer'}}/>
                                </div>
                            </div>
                        )}
                        {input.type === 'numberInputs' && (
                            <div style={{ display: 'flex',left:'40%',justifyContent: 'flex-start',position:'relative'  }}>
                                <input className='number-input' type="number" value={inputValue}
                                    onChange={(e) => handleChange(input._id, e.target.value)}
                                    style={{ marginRight: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc',
                                         width:'23%',height:'7%',color: '#040404',backgroundColor: typeof inputColors[index] === 'string' ? inputColors[index] : 'transparent'}}/>
                                <div className='next'style={{ width: '3%',height: '7%',borderRadius: '5px',
                                    backgroundColor: typeof buttonColors[index] === 'string' ? buttonColors[index] : 'transparent',
                                    display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
                                        <img type="button" src={Send} alt="Logo" 
                                        onClick={() => {
                                            handleNext(index);
                                            document.querySelector('.number-input').style.backgroundColor = '#777777';  // Change box color
                                            document.querySelector('.next').style.backgroundColor = '#777777';  // Change button color
                                        }}
                                        style={{ marginTop:'4px',width: '30px', height: '25px', cursor: 'pointer'}}/>
                                </div>
                                
                            </div>
                        )}
                        {input.type === 'emailInputs' && (
                            <div style={{ display: 'flex',left:'40%',justifyContent: 'flex-start',position:'relative' }}>
                                <input className='email-input' type="email" value={inputValue} onChange={(e) => handleChange(input._id, e.target.value)}
                                    style={{ marginRight: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc',
                                         width:'23%',height:'7%',color: '#040404',backgroundColor: typeof inputColors[index] === 'string' ? inputColors[index] : 'transparent'}}/>
                                 <div style={{ width: '3%',height: '7%',borderRadius: '5px',
                                    backgroundColor: typeof buttonColors[index] === 'string' ? buttonColors[index] : 'transparent',
                                    display: 'flex',justifyContent: 'center',alignItems: 'center'}}  className='next'>
                                        <img type="button" src={Send} alt="Logo" 
                                        onClick={() => {
                                            handleNext(index);
                                            document.querySelector('.email-input').style.backgroundColor = '#777777';  // Change box color
                                            document.querySelector('.next').style.backgroundColor = '#777777';  // Change button color
                                        }}
                                        style={{ marginTop:'4px',width: '30px', height: '25px', cursor: 'pointer'}}/>
                                </div>
                            </div>
                        )}
                        {input.type === 'phoneInputs' && (
                            <div style={{ display: 'flex',left:'40%',justifyContent: 'flex-start',position:'relative' }}>
                                <input className='phone-input' type="tel" value={inputValue} onChange={(e) => handleChange(input._id, e.target.value)}
                                    style={{ marginRight: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc',
                                         width:'23%',height:'7%',color: '#040404',backgroundColor: typeof inputColors[index] === 'string' ? inputColors[index] : 'transparent'}}/>
                                <div style={{ width: '3%',height: '7%',borderRadius: '5px',
                                    backgroundColor: typeof buttonColors[index] === 'string' ? buttonColors[index] : 'transparent',
                                    display: 'flex',justifyContent: 'center',alignItems: 'center'}} className='next'>
                                        <img type="button" src={Send} alt="Logo" 
                                        onClick={() => {
                                            handleNext(index);
                                            document.querySelector('.phone-input').style.backgroundColor = '#777777';  // Change box color
                                            document.querySelector('.next').style.backgroundColor = '#777777';  // Change button color
                                        }}
                                        style={{ marginTop:'4px',width: '30px', height: '25px', cursor: 'pointer'}}/>
                                </div>
                            </div>
                        )}

{input.type === 'dateInputs' && (
    <div 
        style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            position: 'relative', 
            left: '40%', 
            width: '100%' , // Make the entire container responsive
            maxWidth: '100%',  // Ensure the container is fully responsive on mobile
            padding: '0 10px', // Add some padding for mobile
            boxSizing: 'border-box'
        }}
    >
        <div 
            style={{ 
                display: 'flex', 
                justifyContent: 'flex-start', 
                alignItems: 'center', 
                marginBottom: '10px', 
                width: '100%',  // Ensure the input and button container is also responsive
                maxWidth: '100%'
            }}
        >
            <input 
                className='date-input'
                type="date" 
                value={inputValue} 
                onChange={(e) => handleChange(input._id, e.target.value)}
                style={{ 
                    marginRight: '10px', 
                    padding: '10px', 
                    borderRadius: '4px', 
                    border: '1px solid #ccc',
                    width: '23%',   // Adjust width for better fit
                    height: '7%',
                    color: '#040404',
                    backgroundColor: typeof inputColors[index] === 'string' ? inputColors[index] : 'transparent'

                }}
            />
            <div 
                style={{ 
                    width: '3%',    // Increase width slightly for better alignment on smaller screens
                    height: '7%', 
                    borderRadius: '5px', 
                    backgroundColor: typeof buttonColors[index] === 'string' ? buttonColors[index] : 'transparent',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                className='next'>
                <img 
                    type="button" 
                    src={Send} 
                    alt="Logo" 
                    onClick={() => {
                        handleNext(index);
                        document.querySelector('.date-input').style.backgroundColor = '#777777';  // Change box color
                        document.querySelector('.next').style.backgroundColor = '#777777';  // Change button color
                    }}
                   
                    style={{ 
                        marginTop: '4px', 
                        width: '30px', 
                        height: '25px', 
                        cursor: 'pointer'
                    }}
                />
            </div>
        </div>

        <div 
            style={{ 
                marginTop: '10px',
                width: '100%',     // Make the DatePicker take full width on mobile
                maxWidth: '100%',  // Restrict the maximum width
                boxSizing: 'border-box'
            }}
        >
            <DatePicker
                selected={selectedDate}
                onChange={(date) => handleDateChange(date, input._id)}
                inline
                showTimeSelectOnly 
                calendarContainer={(props) => (
                    <div {...props} style={{ width: '100%',
                        maxWidth: '234px', 
                            height: 'auto',   
                            borderRadius: '6px 0px 0px 0px', 
                            boxSizing: 'border-box',  
                            opacity: 1,  
                            margin: '0 auto', 
                     }} />  // Control the calendar's width
                )}
            />
        </div>
    </div>
)}


{input.type === 'ratingInputs' && (
    <div className="rating-input-container" style={{ position: 'relative', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '100%' }}>
            <div 
                style={{ 
                    position: 'relative', 
                    flex: 1, 
                    paddingRight: '50px'  // To ensure input text doesn't overlap with the box
                }}
            >
                <div 
                    style={{ 
                        position: 'absolute',
                        top: '50%',
                        right: '10px', 
                        transform: 'translateY(-50%)',  // Center vertically
                        width: '331px',
                        height: '61px',
                        borderRadius: '4px 0px 0px 0px',
                        backgroundColor: '#FFFFFF',  // Default color
                        display: 'flex',
                        justifyContent: 'space-around', // Space out the circles evenly
                        alignItems: 'center',
                        boxShadow: '0px 4px 6.3px 0px #00000040',
                        gap: '10px',  // Space between rating circles
                    }}
                    className="rating-box"
                >
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <div 
                            key={rating}
                            onClick={() => handleChange(input._id, rating)} // Update rating on click
                            style={{
                                width: '30px',    // Size for each rating circle
                                height: '30px', 
                                borderRadius: '50%',
                                backgroundColor: (inputValues[input._id] || 0) === rating ? '#FF8E21' : 'blue', // Color based on rating
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                                fontSize: '12px', // Keep font size consistent
                                fontWeight: 'bold',
                                color: 'white',
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
                    width: '40px',   // Adjust button size
                    height: '40px', 
                    borderRadius: '5px', 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: '10px',
                    cursor: 'pointer',
                }} 
                className='next'
                onClick={() => {
                    handleNext(index);
                    document.querySelector('.rating-box').style.backgroundColor = '#777777';  // Change box color
                    document.querySelector('.next').style.backgroundColor = '#777777';  // Change button color
                }}
            >
                <img 
                    type="button" 
                    src={Send} 
                    style={{ width: '20px', height: '20px' }}  // Adjust image size
                />
            </div>
        </div>
    </div>
)}






                       
                    
                        {input.type === 'buttonInputs' && (
                            <div style={{left:'75%',position:'relative'}}>
                                <button
                                    onClick={() => handleButtonClick(input._id)}
                                    style={{ backgroundColor: clickedButtons[input._id] ? '#FF8E21' : buttonColors[index], padding: '10px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                >
                                    {input.value}
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
                <div className="submit-container">
                <img type="submit" onClick={() => handleSubmit()} style={{ backgroundColor: '#007bff', color: 'white', padding: '10px', borderRadius: '4px', border: 'none', cursor: 'pointer', marginTop: '20px' }} src={Send}/>

                </div>
        </div>
    );
}

export default Formbot;
