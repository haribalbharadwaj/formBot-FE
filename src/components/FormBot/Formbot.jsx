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
                const data = response.data.data;

                if (!data) {
                    throw new Error('No data returned from the backend');
                }

                console.log('Fetched form data:', data);

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

        console.log("Form Data to Send:", formDataToSend);

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

    const renderInputs = (inputs, type) => {
        if (inputs.length === 0) return null;

        return inputs.map((input, index) => (
            <div key={`${type}-${index}`}>
                <label>{`${type.charAt(0).toUpperCase() + type.slice(1)} Input ${index + 1}`}</label>
                {type === 'image' && <img src={input.value} alt={`Image ${index + 1}`} style={{ maxWidth: '100px' }} />}
                {type === 'video' && <video controls src={input.value} style={{ maxWidth: '300px' }} />}
                {type === 'gif' && <img src={input.value} alt={`GIF ${index + 1}`} style={{ maxWidth: '100px' }} />}
                {type !== 'image' && type !== 'video' && type !== 'gif' && (
                    <input
                        type={type === 'number' ? 'number' : 'text'}
                        value={input.value || ''}
                        onChange={(e) => handleInputChange(type, index, e)}
                        placeholder={`Enter ${type}`}
                    />
                )}
            </div>
        ));
    };

    return (
        <div>
            <h1>{formData?.formName || 'Formbot'}</h1>
            <form onSubmit={handleSubmit}>
                {renderInputs(formValues.textInputs, 'text')}
                {renderInputs(formValues.imageInputs, 'image')}
                {renderInputs(formValues.videoInputs, 'video')}
                {renderInputs(formValues.gifInputs, 'gif')}
                {renderInputs(formValues.tinputs, 'text')} {/* Custom text inputs and others */}
                {renderInputs(formValues.numberInputs, 'number')}
                {renderInputs(formValues.phoneInputs, 'phone')}
                {renderInputs(formValues.emailInputs, 'email')}
                {renderInputs(formValues.dateInputs, 'date')}
                {renderInputs(formValues.ratingInputs, 'rating')}
                {renderInputs(formValues.buttonInputs, 'button')}
                <button type="submit">Submit</button>
            </form>
        </div>

    );
};

export default Formbot;
