import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';


// Component to render different types of inputs
const InputRenderer = ({ inputs, type }) => {
    return inputs.map((input, index) => (
        <div key={index}>
            <label>{`${type.charAt(0).toUpperCase() + type.slice(1)} Input ${index + 1}`}</label>
            {type === 'image' && <img src={input.value} alt={`Image ${index + 1}`} />}
            {type === 'video' && <video controls src={input.value} />}
            {type === 'gif' && <img src={input.value} alt={`GIF ${index + 1}`} />}
            {type !== 'image' && type !== 'video' && type !== 'gif' && (
                <input type="text" value={input.value || ''} readOnly />
            )}
        </div>
    ));
};

const FormBot = ({ formId }) => {
    const [formData, setFormData] = useState(null);

    // Fetch form data when component mounts
    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const backendUrl = process.env.REACT_APP_FORMBOT_BACKEND_URL;
                if (!backendUrl) {
                    throw new Error('Backend URL is not defined');
                }
                const response = await axios.get(`${backendUrl}/form/getForm/${formId}`);
                setFormData(response.data.data);
            } catch (error) {
                console.error('Error fetching form data:', error);
            }
        };

        fetchFormData();
    }, [formId]);

    if (!formData) return <p>Loading...</p>;

    return (
        <div>
            <h1>{formData.formName}</h1>
            <h2>Text Inputs</h2>
            <InputRenderer inputs={formData.textInputs} type="text" />
            <h2>Image Inputs</h2>
            <InputRenderer inputs={formData.imageInputs} type="image" />
            <h2>Video Inputs</h2>
            <InputRenderer inputs={formData.videoInputs} type="video" />
            <h2>GIF Inputs</h2>
            <InputRenderer inputs={formData.gifInputs} type="gif" />
            <h2>Text Inputs (Custom)</h2>
            <InputRenderer inputs={formData.tinputs} type="text" />
            <h2>Number Inputs</h2>
            <InputRenderer inputs={formData.numberInputs} type="number" />
            <h2>Email Inputs</h2>
            <InputRenderer inputs={formData.emailInputs} type="email" />
            <h2>Date Inputs</h2>
            <InputRenderer inputs={formData.dateInputs} type="date" />
            <h2>Phone Inputs</h2>
            <InputRenderer inputs={formData.phoneInputs} type="phone" />
            <h2>Rating Inputs</h2>
            <InputRenderer inputs={formData.ratingInputs} type="rating" />
            <h2>Button Inputs</h2>
            <InputRenderer inputs={formData.buttonInputs} type="button" />
            <p>Views: {formData.views}</p>
            <p>Completion Rate: {formData.completionRate}%</p>
            <p>Start Count: {formData.startCount}</p>
            <p>Start Times: {formData.startTimes.join(', ')}</p>
            <p>Update Times: {formData.updateTimes.join(', ')}</p>
        </div>
    );
};

export default FormBot;
