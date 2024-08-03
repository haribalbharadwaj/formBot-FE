import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Textlogo from "../../assets/textlogo.png";

const Formbot = () => {
    const { formId } = useParams();
    const [formData, setFormData] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [visibleIndices, setVisibleIndices] = useState([0]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedRating, setSelectedRating] = useState(null);
    const [combinedInputs, setCombinedInputs] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const backendUrl = process.env.REACT_APP_FORMBOT_BACKEND_URL;
                if (!backendUrl) throw new Error('Backend URL is not defined');

                const response = await axios.get(`${backendUrl}/form/getForm/${formId}`);
                const data = response.data.data || {};

                const combined = [
                    ...(data.textInputs || []).map(input => ({ ...input, type: 'textInputs' })),
                    ...(data.imageInputs || []).map(input => ({ ...input, type: 'imageInputs' })),
                    ...(data.videoInputs || []).map(input => ({ ...input, type: 'videoInputs' })),
                    ...(data.gifInputs || []).map(input => ({ ...input, type: 'gifInputs' })),
                    ...(data.numberInputs || []).map(input => ({ ...input, type: 'numberInputs' })),
                    ...(data.emailInputs || []).map(input => ({ ...input, type: 'emailInputs' })),
                    ...(data.dateInputs || []).map(input => ({ ...input, type: 'dateInputs' })),
                    ...(data.phoneInputs || []).map(input => ({ ...input, type: 'phoneInputs' })),
                    ...(data.ratingInputs || []).map(input => ({ ...input, type: 'ratingInputs' })),
                    ...(data.buttonInputs || []).map(input => ({ ...input, type: 'buttonInputs' }))
                ].sort((a, b) => a.id - b.id); // Sort by id

                setFormData(data);
                setFormValues({
                    textInputs: data.textInputs || [],
                    imageInputs: data.imageInputs || [],
                    videoInputs: data.videoInputs || [],
                    gifInputs: data.gifInputs || [],
                    numberInputs: data.numberInputs || [],
                    emailInputs: data.emailInputs || [],
                    dateInputs: data.dateInputs || [],
                    phoneInputs: data.phoneInputs || [],
                    ratingInputs: data.ratingInputs || [],
                    buttonInputs: data.buttonInputs || []
                });
                setCombinedInputs(combined);
            } catch (error) {
                console.error('Error fetching form data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFormData();
    }, [formId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleInputChange = (type, index, event) => {
        setFormValues(prevValues => ({
            ...prevValues,
            [type]: prevValues[type].map((input, idx) =>
                idx === index ? { ...input, value: event.target.value } : input
            )
        }));
    };

    const handleDateChange = (index,date) => {
        setSelectedDate(date);
        setFormValues(prevValues => ({
            ...prevValues,
            dateInputs: prevValues.dateInputs.map((input,idx) =>
            idx === index ? { ...input, value: date } : input
            )
        }));
    };

    const handleRatingChange = (index,rating) => {
        setSelectedRating(rating);
        setFormValues(prevValues => ({
            ...prevValues,
            ratingInputs: prevValues.ratingInputs.map((input,idx) =>
            idx === index ? { ...input, value: rating } : input
            )
        }));
    };

    const handleNextClick = () => {
        setVisibleIndices(prevIndices => [
            ...prevIndices,
            Math.min(prevIndices[prevIndices.length - 1] + 1, combinedInputs.length - 1)
        ]);
    };

    const handlePreviousClick = () => {
        setVisibleIndices(prevIndices => prevIndices.slice(0, -1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = {
            formName: formData.formName,
            ...formValues
        };

        try {
            const backendUrl = process.env.REACT_APP_FORMBOT_BACKEND_URL;
            if (!backendUrl) throw new Error('Backend URL is not defined');

            await axios.put(`${backendUrl}/form/updateForm/${formId}`, formDataToSend);

            // Reset form values after submission
            setFormValues({
                textInputs: formData.textInputs.map(input => ({ ...input, value: '' })),
                numberInputs: formData.numberInputs.map(input => ({ ...input, value: '' })),
                emailInputs: formData.emailInputs.map(input => ({ ...input, value: '' })),
                dateInputs: formData.dateInputs.map(input => ({ ...input, value: null })),
                phoneInputs: formData.phoneInputs.map(input => ({ ...input, value: '' })),
                ratingInputs: formData.ratingInputs.map(input => ({ ...input, value: '' })),
                buttonInputs: formData.buttonInputs.map(input => ({ ...input, value: '' }))
            });
            setSelectedDate(null);
            setSelectedRating(null);
            setVisibleIndices([0]);
        } catch (error) {
            console.error('Error saving form data:', error);
        }
    };

    const renderInput = (input, index) => {
        const { type, id, value } = input;

        switch (type) {
            case 'dateInputs':
                return (
                    <div key={id} style={inputContainerStyle}>
                        <Calendar
                            onChange={(date) => handleDateChange(index, date)}
                            value={selectedDate}
                            selectRange={false}
                            style={calendarStyle}
                        />
                        <button
                            type="button"
                            onClick={() => handleInputChange(type, index)}
                            disabled={!selectedDate}
                            style={buttonStyle}
                        >
                            Set Date
                        </button>
                    </div>
                );
            case 'ratingInputs':
                return (
                    <div key={id} style={ratingContainerStyle}>
                        {[1, 2, 3, 4, 5].map((circle) => (
                            <span
                                key={circle}
                                onClick={() => handleRatingChange(index,circle)}
                                style={{
                                    ...circleStyle,
                                    backgroundColor: formValues.ratingInputs[index]?.value === circle ? '#FFD700' : '#007bff',
                                }}
                                >
                                {circle}
                            </span>
                        ))}
                    </div>
                );
            case 'imageInputs':
                return (
                    <div key={id} style={inputContainerStyle}>
                        <img src={value} alt="Image Input" style={mediaStyle} />
                    </div>
                );
            case 'videoInputs':
                return (
                    <div key={id} style={inputContainerStyle}>
                        <video controls src={value} style={mediaStyle} />
                    </div>
                );
            case 'gifInputs':
                return (
                    <div key={id} style={inputContainerStyle}>
                        <img src={value} alt="GIF Input" style={mediaStyle} />
                    </div>
                );
            default:
                return (
                    <div key={id} style={inputContainerStyle}>
                        <label>{type.replace('Inputs', '')}:</label>
                        <div style={textInputContainerStyle}>
                            {type === 'textInputs' && <img src={Textlogo} alt="Logo" style={logoStyle} />}
                            <input
                                type="text"
                                value={formValues[type]?.[index]?.value || ''}
                                onChange={(e) => handleInputChange(type, index, e)}
                                style={type === 'textInputs' ? textInputStyle : inputStyle}
                            />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div style={{ width: '100%', height: '62.5%', margin: '0 auto' }}>
            <div style={containerStyle}>
                <h1>{formData?.formName}</h1>
                <form onSubmit={handleSubmit}>
                    {combinedInputs.map((input, index) => (
                        visibleIndices.includes(index) && renderInput(input, index)
                    ))}
                    <div style={navigationStyle}>
                        <button
                            type="button"
                            onClick={handlePreviousClick}
                            disabled={visibleIndices[0] === 0}
                            style={buttonStyle}
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            onClick={handleNextClick}
                            disabled={visibleIndices[visibleIndices.length - 1] === combinedInputs.length - 1}
                            style={buttonStyle}
                        >
                            Next
                        </button>
                        </div>
                        <button
                            type="submit"
                            style={submitButtonStyle}
                        >
                            Submit
                        </button>
                
                </form>
            </div>
        </div>
    );
};

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    marginTop: '20px'
};

const inputContainerStyle = {
    margin: '10px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

const textInputContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    width: '100%'
};

const inputStyle = {
    width: '300px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px'
};

const textInputStyle = {
    width: 'calc(100% - 40px)', // Adjust for the logo size
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px'
};

const logoStyle = {
    width: '30px',
    height: '30px',
    marginRight: '10px',
    borderRadius: '50%'
};

const calendarStyle = {
    marginBottom: '10px'
};

const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer'
};

const submitButtonStyle = {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#28a745',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '20px'
};

const navigationStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: '20px'
};

const ratingContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const circleStyle = {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '16px',
    margin: '0 5px',
    cursor: 'pointer'
};

const mediaStyle = {
    maxWidth: '300px',
    maxHeight: '300px'
};
export default Formbot;
