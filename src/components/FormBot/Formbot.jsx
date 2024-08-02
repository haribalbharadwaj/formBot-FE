import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Formbot = () => {
    const { formId } = useParams();
    const [formData, setFormData] = useState(null);
    const [formValues, setFormValues] = useState({
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
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const backendUrl = process.env.REACT_APP_FORMBOT_BACKEND_URL;
                if (!backendUrl) {
                    throw new Error('Backend URL is not defined');
                }

                const response = await axios.get(`${backendUrl}/form/getForm/${formId}`);
                const data = response.data.data;

                console.log('Fetched form data:', data);

                setFormData(data);
                setFormValues({
                    textInputs: data.textInputs || [],
                    imageInputs: data.imageInputs || [],
                    videoInputs: data.videoInputs || [],
                    gifInputs: data.gifInputs || [],
                    tinputs: data.tinputs || [],
                    numberInputs: data.numberInputs || [],
                    phoneInputs: data.phoneInputs || [],
                    emailInputs: data.emailInputs || [],
                    dateInputs: data.dateInputs || [],
                    ratingInputs: data.ratingInputs || [],
                    buttonInputs: data.buttonInputs || []
                });

            } catch (error) {
                console.error('Error fetching form data:', error);
                setError(`Failed to fetch form data: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchFormData();
    }, [formId]);

    const handleInputChange = (type, index, event) => {
        const newValues = { ...formValues };
                // Ensure we're working with an array of inputs for the specified type
                newValues[type] = newValues[type].map((input, i) =>
                    i === index ? { ...input, value: event.target.value } : input
                );
        
                setFormValues(newValues);
            };
        
            const handleSubmit = async (e) => {
                e.preventDefault();
        
                const formDataToSend = {
                    formName: formData?.formName || '',
                    textInputs: formValues.textInputs,
                    imageInputs: formValues.imageInputs,
                    videoInputs: formValues.videoInputs,
                    gifInputs: formValues.gifInputs,
                    tinputs: formValues.tinputs,
                    numberInputs: formValues.numberInputs,
                    phoneInputs: formValues.phoneInputs,
                    emailInputs: formValues.emailInputs,
                    dateInputs: formValues.dateInputs,
                    ratingInputs: formValues.ratingInputs,
                    buttonInputs: formValues.buttonInputs
                };
        
                console.log("Form Data to Send:", formDataToSend);
        
                try {
                    const response = await axios.put(`${process.env.REACT_APP_FORMBOT_BACKEND_URL}/form/updateForm/${formId}`, formDataToSend);
                    console.log('Form updated successfully:', response.data);
                } catch (error) {
                    console.error('Error saving form data:', error);
                }
            };
        
            const renderInputs = (inputs, type) => {
                if (!Array.isArray(inputs) || inputs.length === 0) {
                    return null;
                }
            
                return inputs.map((input, index) => {
                    console.log(`${type} Input ${index + 1}:`, input.value);
                    return (
                        <div key={`${type}-${index}`} style={{ marginBottom: '20px' }}>
                            <label>{`${type.charAt(0).toUpperCase() + type.slice(1)} Input ${index + 1}`}</label>
                            {type === 'image' && input.value && (
                                <img src={input.value} alt={`Image ${index + 1}`} style={{ maxWidth: '100%', height: 'auto' }} />
                            )}
                            {type === 'video' && input.value && (
                                <video controls src={input.value} style={{ maxWidth: '100%', height: 'auto' }} />
                            )}
                            {type === 'gif' && input.value && (
                                <img src={input.value} alt={`GIF ${index + 1}`} style={{ maxWidth: '100%', height: 'auto' }} />
                            )}
                            {type === 'text' && (
                                <p style={{ margin: '10px 0' }}>{input.value ? input.value : `No value provided for ${type} input ${index + 1}`}</p>
                            )}
                            {(type !== 'image' && type !== 'video' && type !== 'gif' && type !== 'text') && (
                                <>  
                                    <p style={{ margin: '10px 0' }}>{input.value ? input.value : `No value provided for ${type} input ${index + 1}`}</p>
                                    <input
                                        type={type === 'number' ? 'number' : 'text'}
                                        value={input.value || ''}
                                        onChange={(e) => handleInputChange(type, index, e)}
                                        style={{ display: 'block', margin: '10px 0' }}
                                    />
                                </>
                            )}
                            <button onClick={() => handleButtonClick(type, index)} style={{ marginTop: '10px' }}>Action</button>
                        </div>
                    );
                });
            };
            
            
        
            const handleButtonClick = (type, index) => {
                // Handle button click for the respective input type and index
                console.log(`${type} Input ${index + 1} button clicked`);
            };
        
            if (loading) {
                return <div>Loading...</div>;
            }
        
            if (error) {
                return <div>Error: {error}</div>;
            }
        
            return (
                <div>
                    <h1>{formData?.formName || 'Formbot'}</h1>
                    <form onSubmit={handleSubmit}>
                        {Object.keys(formValues).map((key) => renderInputs(formValues[key], key))}
                        <button type="submit">Submit</button>
                    </form>
                </div>
            );
        };
        
        export default Formbot;
        

