import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Formbot = ({ formId }) => {
    const { formId } = useParams();
    const [formData, setFormData] = useState(null);
    // State to hold the form data
    const [formValues, setFormValues] = useState({
        textInputs: [],
        imageInputs: [],
        videoInputs: [],
        gifInputs: [],
        tinputs: [],
        buttonInputs: [],
        dateInputs: [],
        emailInputs: [],
        numberInputs: [],
        phoneInputs: [],
        ratingInputs: []
    });

    // Fetch form data when component mounts or formId changes
    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const response = await axios.get(`https://jobfinder-be.vercel.app/form/getForm/${formId}`);
                const data = response.data;

                // Set the fetched data into state
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
                console.error("Error fetching form data:", error);
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
            {/* Add similar logic for gifInputs if needed */}
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
            {/* Add similar logic for other input types */}
        </div>
    );

    return (
        <div>
            <h1>{formValues.formName}</h1>
            {renderDisplayFields()}
            {renderInputFields()}
            {/* Add a submit button or other functionality if needed */}
        </div>
    );
};

export default FormPage;
