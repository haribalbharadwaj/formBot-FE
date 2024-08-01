import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Formbot = () => {
    const { formId } = useParams();
    const [formData, setFormData] = useState(null);
    const [formValues, setFormValues] = useState({});

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const backendUrl = process.env.REACT_APP_FORMBOT_BACKEND_URL;
                if (!backendUrl) {
                    throw new Error('Backend URL is not defined');
                }

                const response = await axios.get(`${backendUrl}/form/getForm/${formId}`);
                const data = response.data.data || {};

                console.log('Fetched form data:', data); // Log fetched data

                // Initialize formValues with default values if not present in formData
                const initialValues = {
                    textInputs: data.textInputs.length > 0 ? data.textInputs : [{ id: 1, value: '' }],
                    imageInputs: data.imageInputs.length > 0 ? data.imageInputs : [{ id: 1, value: '' }],
                    videoInputs: data.videoInputs.length > 0 ? data.videoInputs : [{ id: 1, value: '' }],
                    gifInputs: data.gifInputs.length > 0 ? data.gifInputs : [{ id: 1, value: '' }],
                    tinputs: data.tinputs.length > 0 ? data.tinputs : [{ id: 1, value: '' }],
                    numberInputs: data.numberInputs.length > 0 ? data.numberInputs : [{ id: 1, value: '' }],
                    phoneInputs: data.phoneInputs.length > 0 ? data.phoneInputs : [{ id: 1, value: '' }],
                    emailInputs: data.emailInputs.length > 0 ? data.emailInputs : [{ id: 1, value: '' }],
                    dateInputs: data.dateInputs.length > 0 ? data.dateInputs : [{ id: 1, value: '' }],
                    ratingInputs: data.ratingInputs.length > 0 ? data.ratingInputs : [{ id: 1, value: '' }],
                    buttonInputs: data.buttonInputs.length > 0 ? data.buttonInputs : [{ id: 1, value: '' }]
                };

                setFormData(data);
                setFormValues(initialValues);

                console.log('Initial form values:', initialValues); // Log initial form values

            } catch (error) {
                console.error('Error fetching form data:', error);
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
            formName: formData.formName,
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

    if (!formData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{formData.formName}</h1>
            <form onSubmit={handleSubmit}>
                {formValues.textInputs.length > 0 && formValues.textInputs.map((input, index) => (
                    <input
                        key={input.id}
                        value={formValues.textInputs[index]?.value || ''}
                        onChange={(e) => handleInputChange('textInputs', index, e)}
                        placeholder="Enter text"
                    />
                ))}
                {formValues.imageInputs.length > 0 && formValues.imageInputs.map((input, index) => (
                    <input
                        key={input.id}
                        value={formValues.imageInputs[index]?.value || ''}
                        onChange={(e) => handleInputChange('imageInputs', index, e)}
                        placeholder="Enter image URL"
                    />
                ))}
                {formValues.videoInputs.length > 0 && formValues.videoInputs.map((input, index) => (
                    <input
                        key={input.id}
                        value={formValues.videoInputs[index]?.value || ''}
                        onChange={(e) => handleInputChange('videoInputs', index, e)}
                        placeholder="Enter video URL"
                    />
                ))}
                {formValues.gifInputs.length > 0 && formValues.gifInputs.map((input, index) => (
                    <input
                        key={input.id}
                        value={formValues.gifInputs[index]?.value || ''}
                        onChange={(e) => handleInputChange('gifInputs', index, e)}
                        placeholder="Enter gif URL"
                    />
                ))}
                {formValues.tinputs.length > 0 && formValues.tinputs.map((input, index) => (
                    <input
                        key={input.id}
                        value={formValues.tinputs[index]?.value || ''}
                        onChange={(e) => handleInputChange('tinputs', index, e)}
                        placeholder="Enter text input"
                    />
                ))}
                {formValues.numberInputs.length > 0 && formValues.numberInputs.map((input, index) => (
                    <input
                        key={input.id}
                        value={formValues.numberInputs[index]?.value || ''}
                        onChange={(e) => handleInputChange('numberInputs', index, e)}
                        placeholder="Enter number"
                    />
                ))}
                {formValues.phoneInputs.length > 0 && formValues.phoneInputs.map((input, index) => (
                    <input
                        key={input.id}
                        value={formValues.phoneInputs[index]?.value || ''}
                        onChange={(e) => handleInputChange('phoneInputs', index, e)}
                        placeholder="Enter phone number"
                    />
                ))}
                {formValues.emailInputs.length > 0 && formValues.emailInputs.map((input, index) => (
                    <input
                        key={input.id}
                        value={formValues.emailInputs[index]?.value || ''}
                        onChange={(e) => handleInputChange('emailInputs', index, e)}
                        placeholder="Enter email"
                    />
                ))}
                {formValues.dateInputs.length > 0 && formValues.dateInputs.map((input, index) => (
                    <input
                        key={input.id}
                        value={formValues.dateInputs[index]?.value || ''}
                        onChange={(e) => handleInputChange('dateInputs', index, e)}
                        placeholder="Enter date"
                    />
                ))}
                {formValues.ratingInputs.length > 0 && formValues.ratingInputs.map((input, index) => (
                    <input
                        key={input.id}
                        value={formValues.ratingInputs[index]?.value || ''}
                        onChange={(e) => handleInputChange('ratingInputs', index, e)}
                        placeholder="Enter rating"
                    />
                ))}
                {formValues.buttonInputs.length > 0 && formValues.buttonInputs.map((input, index) => (
                    <input
                        key={input.id}
                        value={formValues.buttonInputs[index]?.value || ''}
                        onChange={(e) => handleInputChange('buttonInputs', index, e)}
                        placeholder="Enter button text"
                    />
                ))}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Formbot;
