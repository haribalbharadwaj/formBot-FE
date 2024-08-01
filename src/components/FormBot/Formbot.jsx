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

                const response = await axios.get(`${backendUrl}/form/getForm/${formId}`);
                const data = response.data.data || {};

                // Debugging: Check fetched data
                console.log('Fetched form data:', data);

                // Initialize formValues with default values if not present in formData
                const initialValues = {
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
                };

                setFormData(data.data);
                setFormValues(initialValues);

                // Debugging: Check initial form values
                console.log('Initial form values:', initialValues);

            } catch (error) {
                console.error('Error fetching form data:', error);
                setError('Failed to fetch form data.');
            } finally {
                setLoading(false);
            }
        };

        fetchFormData();
    }, [formId]);

    const handleInputChange = (type, index, event) => {
        const newValues = { ...formValues };
        newValues[type][index].value = event.target.value;
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

        console.log("Form Data to Send:", formDataToSend); // Debugging

        try {
            const response = await axios.put(`${process.env.REACT_APP_FORMBOT_BACKEND_URL}/form/updateForm/${formId}`, formDataToSend);
            console.log('Form updated successfully:', response.data);
        } catch (error) {
            console.error('Error saving form data:', error);
        }
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
                {/* Conditionally render fields based on formValues */}
                {formValues.textInputs.length > 0 && formValues.textInputs.map((input, index) => (
                    <div key={`textInput-${index}`}>
                        <label>Text Input {index + 1}</label>
                        <input
                            type="text"
                            value={input.value || ''}
                            onChange={(e) => handleInputChange('textInputs', index, e)}
                            placeholder="Enter text"
                        />
                    </div>
                ))}
                {formValues.imageInputs.length > 0 && formValues.imageInputs.map((input, index) => (
                    <div key={`imageInput-${index}`}>
                        <label>Image URL {index + 1}</label>
                        <input
                            type="text"
                            value={input.value || ''}
                            onChange={(e) => handleInputChange('imageInputs', index, e)}
                            placeholder="Enter image URL"
                        />
                    </div>
                ))}
                {formValues.videoInputs.length > 0 && formValues.videoInputs.map((input, index) => (
                    <div key={`videoInput-${index}`}>
                        <label>Video URL {index + 1}</label>
                        <input
                            type="text"
                            value={input.value || ''}
                            onChange={(e) => handleInputChange('videoInputs', index, e)}
                            placeholder="Enter video URL"
                        />
                    </div>
                ))}
                {formValues.gifInputs.length > 0 && formValues.gifInputs.map((input, index) => (
                    <div key={`gifInput-${index}`}>
                        <label>GIF URL {index + 1}</label>
                        <input
                            type="text"
                            value={input.value || ''}
                            onChange={(e) => handleInputChange('gifInputs', index, e)}
                            placeholder="Enter GIF URL"
                        />
                    </div>
                ))}

                {/* Static rendering for other input types */}
                {formValues.tinputs.length > 0 && formValues.tinputs.map((input, index) => (
                    <div key={`tinput-${index}`}>
                        <label>Text Input {index + 1}</label>
                        <input
                            type="text"
                            value={input.value || ''}
                            onChange={(e) => handleInputChange('tinputs', index, e)}
                            placeholder="Enter text"
                        />
                    </div>
                ))}
                {formValues.numberInputs.length > 0 && formValues.numberInputs.map((input, index) => (
                    <div key={`numberInput-${index}`}>
                        <label>Number Input {index + 1}</label>
                        <input
                            type="number"
                            value={input.value || ''}
                            onChange={(e) => handleInputChange('numberInputs', index, e)}
                            placeholder="Enter number"
                        />
                    </div>
                ))}
                {formValues.phoneInputs.length > 0 && formValues.phoneInputs.map((input, index) => (
                    <div key={`phoneInput-${index}`}>
                        <label>Phone Input {index + 1}</label>
                        <input
                            type="tel"
                            value={input.value || ''}
                            onChange={(e) => handleInputChange('phoneInputs', index, e)}
                            placeholder="Enter phone number"
                        />
                    </div>
                ))}
                {formValues.emailInputs.length > 0 && formValues.emailInputs.map((input, index) => (
                    <div key={`emailInput-${index}`}>
                        <label>Email Input {index + 1}</label>
                        <input
                            type="email"
                            value={input.value || ''}
                            onChange={(e) => handleInputChange('emailInputs', index, e)}
                            placeholder="Enter email"
                        />
                    </div>
                ))}
                {formValues.dateInputs.length > 0 && formValues.dateInputs.map((input, index) => (
                    <div key={`dateInput-${index}`}>
                        <label>Date Input {index + 1}</label>
                        <input
                            type="date"
                            value={input.value || ''}
                            onChange={(e) => handleInputChange('dateInputs', index, e)}
                            placeholder="Enter date"
                        />
                    </div>
                ))}
                {formValues.ratingInputs.length > 0 && formValues.ratingInputs.map((input, index) => (
                    <div key={`ratingInput-${index}`}>
                        <label>Rating Input {index + 1}</label>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={input.value || ''}
                            onChange={(e) => handleInputChange('ratingInputs', index, e)}
                            placeholder="Enter rating"
                        />
                    </div>
                ))}
                {formValues.buttonInputs.length > 0 && formValues.buttonInputs.map((input, index) => (
                    <div key={`buttonInput-${index}`}>
                        <label>Button Input {index + 1}</label>
                        <input
                            type="text"
                            value={input.value || ''}
                            onChange={(e) => handleInputChange('buttonInputs', index, e)}
                            placeholder="Enter button label"
                        />
                    </div>
                ))}

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Formbot;
