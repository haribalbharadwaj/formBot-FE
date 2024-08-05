import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Formbot = () => {
    const { formId } = useParams();
    const [formData, setFormData] = useState({});
    const [formValues, setFormValues] = useState({});
    const [visibleIndices, setVisibleIndices] = useState([0]);

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const backendUrl = process.env.REACT_APP_FORMBOT_BACKEND_URL;
                if (!backendUrl) throw new Error('Backend URL is not defined');

                const response = await axios.get(`${backendUrl}/form/getForm/${formId}`);
                const data = response.data.data || {};
                
                console.log('Fetched Data:', data);
                setFormData(data); // Use data directly
            } catch (error) {
                console.error('Error fetching form:', error.response ? error.response.data : error.message);
            }
        };

        fetchFormData();
    }, [formId]);

    const combinedInputs = [
        ...(formData.textInputs || []).map(input => ({ ...input, type: 'textInputs' })),
        ...(formData.imageInputs || []).map(input => ({ ...input, type: 'imageInputs' })),
        ...(formData.videoInputs || []).map(input => ({ ...input, type: 'videoInputs' })),
        ...(formData.gifInputs || []).map(input => ({ ...input, type: 'gifInputs' })),
        ...(formData.numberInputs || []).map(input => ({ ...input, type: 'numberInputs' })),
        ...(formData.emailInputs || []).map(input => ({ ...input, type: 'emailInputs' })),
        ...(formData.dateInputs || []).map(input => ({ ...input, type: 'dateInputs' })),
        ...(formData.phoneInputs || []).map(input => ({ ...input, type: 'phoneInputs' })),
        ...(formData.ratingInputs || []).map(input => ({ ...input, type: 'ratingInputs' })),
        ...(formData.buttonInputs || []).map(input => ({ ...input, type: 'buttonInputs' })),
        ...(formData.tinputs || []).map(input => ({ ...input, type: 'tinputs' })) // Add tinputs
    ].sort((a, b) => a.serialNo - b.serialNo); // Sort by serialNo

    const handleInputChange = (id, event) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [id]: event.target.value,
        }));
    };

    const handleNextClick = (index) => {
        if (index < combinedInputs.length - 1) {
            setVisibleIndices((prevIndices) => [...prevIndices, index + 1]);
        }
    };

    const handlePreviousClick = () => {
        if (visibleIndices.length > 1) {
            setVisibleIndices((prevIndices) => prevIndices.slice(0, -1));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form Submitted:', formValues);
    };

    const renderInput = (input, index) => {
        if (!input) {
            console.warn(`Undefined input at index ${index}`);
            return null;
        }

        const { id, value, _id, type } = input;
        const commonStyle = { marginBottom: '20px' };
        const nextButton = index < combinedInputs.length - 1 && (
            <button type="button" onClick={() => handleNextClick(index)}>
                Next
            </button>
        );

        switch (type) {
            case 'textInputs':
                return (
                    <div key={`${_id}-${index}`} style={commonStyle}>
                        <input
                            type="text"
                            value={formValues[_id] || value || ''}
                            onChange={(event) => handleInputChange(_id, event)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
                        />
                        {nextButton}
                    </div>
                );
            case 'gifInputs':
                return (
                    <div key={`${_id}-${index}`} style={commonStyle}>
                        <img
                            src={value}
                            alt="GIF"
                            style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
                        />
                        {nextButton}
                    </div>
                );
            case 'emailInputs':
                return (
                    <div key={`${_id}-${index}`} style={commonStyle}>
                        <input
                            type="email"
                            value={formValues[_id] || value || ''}
                            onChange={(event) => handleInputChange(_id, event)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
                        />
                        {nextButton}
                    </div>
                );
            // Add other cases for different input types as needed
            default:
                return (
                    <div key={`${_id}-${index}`} style={commonStyle}>
                        <input
                            type="text"
                            value={formValues[_id] || value || ''}
                            onChange={(event) => handleInputChange(_id, event)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
                        />
                        {nextButton}
                    </div>
                );
        }
    };

    return (
        <div className="formbot-container">
            <h1>{formData.formName}</h1>
            <form onSubmit={handleSubmit}>
                {visibleIndices.map((index) => {
                    const input = combinedInputs[index];
                    return renderInput(input, index);
                })}
                {visibleIndices.length < combinedInputs.length && (
                    <button type="button" onClick={() => handleNextClick(visibleIndices.length - 1)}>
                        Next
                    </button>
                )}
                {visibleIndices.length > 1 && (
                    <button type="button" onClick={handlePreviousClick}>
                        Previous
                    </button>
                )}
                <button type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Formbot;
