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

    const renderInputs = (inputs, type) => {
        if (!Array.isArray(inputs) || inputs.length === 0) {
            return null;
        }

        return inputs.map((input, index) => (
            <div key={`${type}-${index}`} className={`${type}-input`}>
                <label>{`${type.charAt(0).toUpperCase() + type.slice(1)} Input ${index + 1}`}</label>
                {type === 'image' && input.value && <img src={input.value} alt={`Image ${index + 1}`} />}
                {type === 'video' && input.value && <video controls src={input.value} />}
                {type === 'gif' && input.value && <img src={input.value} alt={`GIF ${index + 1}`} />}
                {(type !== 'image' && type !== 'video' && type !== 'gif') && (
                    <input
                        type={type === 'number' ? 'number' : 'text'}
                        value={input.value || ''}
                        onChange={(e) => handleInputChange(type, index, e)}
                        placeholder={`Enter ${type}`}
                    />
                )}
                <button type="button" onClick={() => handleButtonClick(type, index)}>Action</button>
            </div>
        ));
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
                <div className="text-inputs">
                    {renderInputs(formValues.textInputs, 'text')}
                </div>
                <div className="image-inputs">
                    {renderInputs(formValues.imageInputs, 'image')}
                </div>
                <div className="video-inputs">
                    {renderInputs(formValues.videoInputs, 'video')}
                </div>
                <div className="gif-inputs">
                    {renderInputs(formValues.gifInputs, 'gif')}
                </div>
                <div className="tinputs">
                    {renderInputs(formValues.tinputs, 'text')}
                </div>
                <div className="number-inputs">
                    {renderInputs(formValues.numberInputs, 'number')}
                </div>
                <div className="phone-inputs">
                    {renderInputs(formValues.phoneInputs, 'phone')}
                </div>
                <div className="email-inputs">
                    {renderInputs(formValues.emailInputs, 'email')}
                </div>
                <div className="date-inputs">
                    {renderInputs(formValues.dateInputs, 'date')}
                </div>
                <div className="rating-inputs">
                    {renderInputs(formValues.ratingInputs, 'rating')}
                </div>
                <div className="button-inputs">
                    {renderInputs(formValues.buttonInputs, 'button')}
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Formbot;
