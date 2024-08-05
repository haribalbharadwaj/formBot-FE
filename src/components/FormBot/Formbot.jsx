import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Formbot.css'; // Make sure to include this CSS file
import { useParams } from 'react-router-dom';

const Formbot = () => {
    const { formId } = useParams();
    const [formData, setFormData] = useState(null);
    const [inputs, setInputs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const backendUrl = process.env.REACT_APP_FORMBOT_BACKEND_URL;
                if (!backendUrl) throw new Error('Backend URL is not defined');

                const response = await axios.get(`${backendUrl}/form/getForm/${formId}`);
                const data = response.data.data || {};

                console.log('Fetched form data:', data);

                // Extract inputs from the inputs array
                const inputsArray = data.inputs || [];
                const combinedInputs = inputsArray.map(input => ({
                    ...input._doc, // Extract fields from _doc
                    type: input.type
                })).sort((a, b) => a.id - b.id); // Sort by id

                // Log combined inputs for debugging
                console.log('Combined and sorted inputs:', combinedInputs);

                setFormData(data);
                setInputs(combinedInputs);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching form data:', error);
                setLoading(false);
            }
        };

        fetchFormData();
    }, [formId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="formbot-container">
            <h1>{formData?.formName}</h1>
            <div className="inputs-container">
                {inputs.map((input, index) => (
                    <div key={index} className="input-item">
                        {input.type === 'textInputs' && <p>{input.value}</p>}
                        {input.type === 'imageInputs' && <img src={input.value} alt={`Image ${index}`} />}
                        {input.type === 'videoInputs' && <video src={input.value} controls />}
                        {input.type === 'gifInputs' && <img src={input.value} alt={`GIF ${index}`} />}
                        {input.type === 'tinputs' && <input type="text" value={input.value} readOnly />}
                        {input.type === 'numberInputs' && <input type="number" value={input.value} readOnly />}
                        {input.type === 'emailInputs' && <input type="email" value={input.value} readOnly />}
                        {input.type === 'dateInputs' && <input type="date" value={input.value} readOnly />}
                        {input.type === 'phoneInputs' && <input type="tel" value={input.value} readOnly />}
                        {input.type === 'ratingInputs' && <input type="number" value={input.value} readOnly />}
                        {input.type === 'buttonInputs' && <button>{input.value}</button>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Formbot;
