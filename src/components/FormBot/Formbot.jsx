import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Formbot = () => {
    const { formId } = useParams();
    const [formData, setFormData] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const backendUrl = process.env.REACT_APP_FORMBOT_BACKEND_URL;
                if (!backendUrl) {
                    throw new Error('Backend URL is not defined');
                }

                if (!formId) {
                    throw new Error('Form ID is not provided');
                }

                const response = await axios.get(`${backendUrl}/form/getForm/${formId}`);
                const data = response.data.data || {};

                console.log('Fetched form data:', data); // Log fetched data

                // Set the fetched data into state
                setFormData(data);
                setFormValues({
                    textInputs: data.textInputs || [],
                    imageInputs: data.imageInputs || [],
                    videoInputs: data.videoInputs || [],
                    gifInputs: data.gifInputs || [],
                    tinputs: data.tinputs || [],
                    buttonInputs: data.buttonInputs || [],
                    dateInputs: data.dateInputs || [],
                    emailInputs: data.emailInputs || [],
                    numberInputs: data.numberInputs || [],
                    phoneInputs: data.phoneInputs || [],
                    ratingInputs: data.ratingInputs || []
                });
            } catch (error) {
                console.error('Error fetching form data:', error);
                setError('Failed to fetch form data.');
            } finally {
                setLoading(false);
            }
        };

        fetchFormData();
    }, [formId]);

    // Handle changes in input fields
    const handleInputChange = (type, index, event) => {
        const updatedInputs = [...formValues[type]];
        updatedInputs[index].value = event.target.value;
        setFormValues({ ...formValues, [type]: updatedInputs });
    };

    // Render loading state
    if (loading) {
        return <div>Loading...</div>;
    }

    // Render error state
    if (error) {
        return <div>Error: {error}</div>;
    }

    // Render fields for displaying data
    const renderDisplayFields = () => (
        <div>
            {formValues.textInputs.length > 0 && formValues.textInputs.map((input, index) => (
                <div key={`display-textInput-${index}`}>
                    <p>{input.value}</p>
                </div>
            ))}
            {formValues.imageInputs.length > 0 && formValues.imageInputs.map((input, index) => (
                <div key={`display-imageInput-${index}`}>
                    <img src={input.url} alt={`Image ${index}`} style={{ width: '100px', height: 'auto' }} />
                </div>
            ))}
            {formValues.videoInputs.length > 0 && formValues.videoInputs.map((input, index) => (
                <div key={`display-videoInput-${index}`}>
                    <video src={input.url} controls style={{ width: '200px', height: 'auto' }} />
                </div>
            ))}
            {formValues.gifInputs.length > 0 && formValues.gifInputs.map((input, index) => (
                <div key={`display-gifInput-${index}`}>
                    <img src={input.url} alt={`GIF ${index}`} style={{ width: '100px', height: 'auto' }} />
                </div>
            ))}
        </div>
    );

    // Render input fields for data entry
    const renderInputFields = () => (
        <div>
            {formValues.tinputs.length > 0 && formValues.tinputs.map((input, index) => (
                <div key={`input-text-${index}`}>
                    <label>Text Input {index + 1}</label>
                    <input
                        type="text"
                        value={input.value || ''}
                        onChange={(e) => handleInputChange('tinputs', index, e)}
                        placeholder="Enter text"
                    />
                </div>
            ))}
            {formValues.buttonInputs.length > 0 && formValues.buttonInputs.map((input, index) => (
                <div key={`input-button-${index}`}>
                    <label>Button Input {index + 1}</label>
                    <input
                        type="text"
                        value={input.value || ''}
                        onChange={(e) => handleInputChange('buttonInputs', index, e)}
                        placeholder="Enter button text"
                    />
                </div>
            ))}
            {formValues.dateInputs.length > 0 && formValues.dateInputs.map((input, index) => (
                <div key={`input-date-${index}`}>
                    <label>Date Input {index + 1}</label>
                    <input
                        type="date"
                        value={input.value || ''}
                        onChange={(e) => handleInputChange('dateInputs', index, e)}
                    />
                </div>
            ))}
            {formValues.emailInputs.length > 0 && formValues.emailInputs.map((input, index) => (
                <div key={`input-email-${index}`}>
                    <label>Email Input {index + 1}</label>
                    <input
                        type="email"
                        value={input.value || ''}
                        onChange={(e) => handleInputChange('emailInputs', index, e)}
                    />
                </div>
            ))}
            {/* Add similar logic for other input types */}
        </div>
    );

    return (
        <div>
            <h1>{formData.formName}</h1>
            {renderDisplayFields()}
            {renderInputFields()}
        </div>
    );
};

export default Formbot;
