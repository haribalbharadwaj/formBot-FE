import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Formbot = () => {
    const { formId } = useParams();
    const [formData, setFormData] = useState(null);
    const [formValues, setFormValues] = useState({});
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

                console.log('Fetched form data:', data); // Log fetched data

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

                setFormData(data);
                setFormValues(initialValues);

                // Determine if there are any inputs to display
                const hasInputs = Object.values(initialValues).some(arr => arr.length > 0);
                setHasInputs(hasInputs);

                console.log('Initial form values:', initialValues); // Log initial form values
                console.log('Has inputs:', hasInputs); // Log if there are inputs

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
            {hasInputs ? (
                <form onSubmit={handleSubmit}>
                    {formData.textInputs.map((input, index) => (
                        <input
                            key={index}
                            value={formValues.textInputs[index]?.value || ''}
                            onChange={(e) => handleInputChange('textInputs', index, e)}
                            placeholder="Enter text"
                        />
                    ))}
                    {/* Render other input types similarly */}
                    <button type="submit">Submit</button>
                </form>
            ) : (
                <div>
                    <p>No inputs available</p>
                </div>
            )}
        </div>
    );
};

export default Formbot;
