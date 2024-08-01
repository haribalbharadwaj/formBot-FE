import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Formbot = () => {
    const { formId } = useParams();
    const [formData, setFormData] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [message, setMessage] = useState("");
    const [hasInputs, setHasInputs] = useState(false);

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
                    tinputs: data.tinputs || [],
                    numberInputs: data.numberInputs || [],
                    phoneInputs: data.phoneInputs || [],
                    emailInputs: data.emailInputs || [],
                    dateInputs: data.dateInputs || [],
                    ratingInputs: data.ratingInputs || [],
                    buttonInputs: data.buttonInputs || []
                };

                setFormData(data);
                setFormValues(initialValues);

                const hasInputs = Object.values(initialValues).some(arr => arr.length > 0);
                setHasInputs(hasInputs);

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

        console.log("Form Data to Send:", formDataToSend);

        try {
            const response = await axios.put(`${backendUrl}/form/updateForm/${formId}`, formDataToSend);
            console.log('Form updated successfully:', response.data);
            setMessage('Form updated successfully');
        } catch (error) {
            console.error('Error saving form data:', error);
            setMessage('Error saving form data');
        }
    };

    if (!formData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {hasInputs ? (
                <form onSubmit={handleSubmit}>
                    {formData.textInputs.map((input, index) => (
                        <input
                            key={input.id}
                            value={formValues.textInputs[index]?.value || ''}
                            onChange={(e) => handleInputChange('textInputs', index, e)}
                            placeholder="Enter text"
                        />
                    ))}
                    {formData.imageInputs.map((input, index) => (
                        <div key={input.id}>
                            <img src={input.value} alt="image" />
                            <input
                                value={formValues.imageInputs[index]?.value || ''}
                                onChange={(e) => handleInputChange('imageInputs', index, e)}
                                placeholder="Enter image URL"
                            />
                        </div>
                    ))}
                    {formData.videoInputs.map((input, index) => (
                        <div key={input.id}>
                            <video src={input.value} controls />
                            <input
                                value={formValues.videoInputs[index]?.value || ''}
                                onChange={(e) => handleInputChange('videoInputs', index, e)}
                                placeholder="Enter video URL"
                            />
                        </div>
                    ))}
                    {formData.gifInputs.map((input, index) => (
                        <div key={input.id}>
                            <img src={input.value} alt="gif" />
                            <input
                                value={formValues.gifInputs[index]?.value || ''}
                                onChange={(e) => handleInputChange('gifInputs', index, e)}
                                placeholder="Enter gif URL"
                            />
                        </div>
                    ))}
                    {formData.tinputs.map((input, index) => (
                        <input
                            key={input.id}
                            value={formValues.tinputs[index]?.value || ''}
                            onChange={(e) => handleInputChange('tinputs', index, e)}
                            placeholder="Enter text input"
                        />
                    ))}
                    {formData.numberInputs.map((input, index) => (
                        <input
                            key={input.id}
                            type="number"
                            value={formValues.numberInputs[index]?.value || ''}
                            onChange={(e) => handleInputChange('numberInputs', index, e)}
                            placeholder="Enter number"
                        />
                    ))}
                    {formData.emailInputs.map((input, index) => (
                        <input
                            key={input.id}
                            type="email"
                            value={formValues.emailInputs[index]?.value || ''}
                            onChange={(e) => handleInputChange('emailInputs', index, e)}
                            placeholder="Enter email"
                        />
                    ))}
                    {formData.dateInputs.map((input, index) => (
                        <input
                            key={input.id}
                            type="date"
                            value={formValues.dateInputs[index]?.value || ''}
                            onChange={(e) => handleInputChange('dateInputs', index, e)}
                            placeholder="Enter date"
                        />
                    ))}
                    {formData.phoneInputs.map((input, index) => (
                        <input
                            key={input.id}
                            type="tel"
                            value={formValues.phoneInputs[index]?.value || ''}
                            onChange={(e) => handleInputChange('phoneInputs', index, e)}
                            placeholder="Enter phone number"
                        />
                    ))}
                    {formData.ratingInputs.map((input, index) => (
                        <input
                            key={input.id}
                            type="number"
                            value={formValues.ratingInputs[index]?.value || ''}
                            onChange={(e) => handleInputChange('ratingInputs', index, e)}
                            placeholder="Enter rating"
                        />
                    ))}
                    {formData.buttonInputs.map((input, index) => (
                        <button key={input.id} type="button">{input.value}</button>
                    ))}
                    <button type="submit">Submit</button>
                </form>
            ) : (
                <div>
                    <p>No inputs available</p>
                    <button type="button" onClick={handleSubmit}>Submit</button>
                </div>
            )}
            {message && <p>{message}</p>}
        </div>
    );
};

export default Formbot;
