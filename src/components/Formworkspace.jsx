import React, { useState ,useEffect} from "react";
import Close from "../assets/close.png";
import { useNavigate } from "react-router-dom";
import Textlogo from "../assets/textLogo.png";
import Imagelogo from "../assets/imageLogo.png";
import Videologo from "../assets/videoLogo.png";
import GIFlogo from "../assets/gifLogo.png";
import Tlogo from "../assets/Tlogo.png";
import Hash from "../assets/hash.png";
import MailLogo from "../assets/mailLogo.png";
import Phonelogo from "../assets/phoneLogo.png";
import Datelogo from "../assets/dateLogo.png";
import RatingLogo from "../assets/ratingLogo.png";
import ButtonLogo from "../assets/buttonLogo.png";
import Start from "../assets/startLogo.png";
import Deleete from "../assets/delete.png";
import axios from "axios";

function Formworkspace() {
    const [name, setName] = useState('');
    const [formInputs, setFormInputs] = useState([]);
    const [activeButton, setActiveButton] = useState(null);
    const navigate = useNavigate();
    const [error, setError] = useState({ name: false });
    const [currentType, setCurrentType] = useState('');
    const [entities, setEntities] = useState([]);

    useEffect(() => {
        const fetchFormDetails = async () => {
            try {
                const userId = localStorage.getItem('userId') // Replace with actual method to get userId
                const response = await axios.get(`http://localhost:4000/form/forms/${userId}`);
                console.log("Response data:", response.data);
            } catch (error) {
                console.error("Error fetching form details", error);
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                console.error("Response headers:", error.response.headers);
            }
        };
    
        fetchFormDetails();
    }, []);
    

    

    const handleDelete = (index) => {
        const  newFormInputs = formInputs.filter((_, i) => i !== index);
        const newEntities = entities.filter((_, i) => i !== index);
        setFormInputs(newFormInputs);
        setEntities(newEntities);
    };

    const handleClick = (buttonName) => {
        setActiveButton(buttonName);
        setCurrentType(buttonName); // Set the current type when a button is clicked 
    };

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newFormInputs = [...formInputs];
    
        // Update the specific input field in the formInputs array
        newFormInputs[index] = {
            ...newFormInputs[index],
            [name]: value
        };
    
        setFormInputs(newFormInputs);
    };
    
    const handleSave = async()=>{
        const userId = localStorage.getItem('userId');
        const formId = localStorage.getItem('formId');

        if (!userId) {
            console.error('User ID is missing from localStorage');
            return;
        }

        try{
            const backendUrl = process.env.REACT_APP_FORMBOT_BACKEND_URL;
            if (!backendUrl) {
                throw new Error('Backend URL is not defined');
                }

            const formData = {
                userId:userId,
                formName: name,
                bubbles: formInputs.filter(input => input.type === 'bubble'), 
                inputs: formInputs.filter(input => input.type !== 'bubble'),
                
            };
            console.log('Form data:',formData);

            let response;
            if (formId) {
                response = await axios.put(`${backendUrl}/form/updateForm/${formId}`, formData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                response = await axios.post(`${backendUrl}/form/addForm`, formData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
            if (response.status === 200 || response.status === 201) {
                navigate('/workspace');
            }

            console.log('Form saved successfully', response.data);
            setError('');

            setFormInputs([...formInputs, { type: 'text', name: '', value: '' }]);
            console.log('Response data:', response.data);
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

        console.log('Form created or updated successfully', response.data);
        setError(`Failed to save form: ${error.response.data.message}. Please try again.`);

      }catch (error) {
        console.error('Error submitting form', error);
        if (error.response) {
          setError(`Failed to save form: ${error.response.data.message || 'Please try again.'}`);
        } else if (error.request) {
          setError('No response received from the server. Please try again.');
        } else {
          setError(`Failed to save form: ${error.message}. Please try again.`);
        }
      }
    };
    }

    const handleEntityClick = (type) => {
        const typeIndex = entities.filter(e => e.type === type).length + 1;
        setEntities([...entities, { type, name: `${type}${typeIndex}` }]);
    };

    const handleResponseClick = () => {
      handleClick('Response');
      navigate('/response');
    };
  
    const handleThemeClick = () => {
      handleClick('Theme');
      navigate('/theme');
    };
  
    const handleFlowClick = () => {
      handleClick('Flow');
      navigate('/formworkspace');
    };

    const buttonStyle = {
        width: '58px',
        height: '32px',
        padding: '7.1px 13px 7.9px 13px',
        borderRadius: '6px 6px 6px 6px',
        background: 'transparent',
        color: '#FFFFFF',
        cursor: 'pointer'
    };
    const activeButtonStyle = {
        ...buttonStyle,
        color: '#7EA6FF',
        border: '1px solid #7EA6FF'
    };

    const panelStyle = {
        width: '344px',
        height: '812px',
        top: '16px',
        left: '16px',
        borderRadius: '8px',
        border: '1px solid transparent',
        fontFamily: 'Open Sans, sans-serif',
        fontSize: '14px',
        fontWeight: '600',
        lineHeight: '21px',
        textAlign: 'left',
        color: '#FFFFFFEB',
        background: '#18181B',
        padding: '20px',
    };

    const sectionStyle = {
        marginBottom: '20px',
    };

    const titleStyle = {
        marginBottom: '10px',
        display: 'block'
    };

    const bubblesTitleStyle = {
        ...titleStyle,
        marginTop: '65px',
    };

    const inputsTitleStyle = {
        ...titleStyle,
        marginTop: '20px',
    };

    const rowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
    };

    const itemStyle = {
        display: 'flex',
        alignItems: 'center',
        padding: '9px 17px',
        borderRadius: '8px',
        background: '#1F1F23',
        cursor: 'pointer',
        color: '#FFFFFF',
        width: '48%',
        boxSizing: 'border-box',
    };

    const imgStyle = {
        marginRight: '10px',
    };

    const renderLogo = (type) => {
        switch (type) {
            case 'Text':
                return Textlogo;
            case 'Image':
                return Imagelogo;
            case 'Video':
                return Videologo;
            case 'GIF':
                return GIFlogo;
            case 'Number':
                return Hash;
            case 'Email':
                return MailLogo;
            case 'Phone':
                return Phonelogo;
            case 'Date':
                return Datelogo;
            case 'Rating':
                return RatingLogo;
            case 'Buttons':
                return ButtonLogo;
            case 'T':
                return Tlogo; // Added Tlogo case
            default:
                return null;
        }

    return (
        <div style={{
            width: '1440px', height: 'auto', margin: '0 auto',
            background: '#1F1F23',
            position: 'relative'
        }}>
            <div style={{
                width: '1440px', height: '56px', border: '0px 0px 1px 0px', background: '#18181B', borderBottom: '1px solid #FFFFFF29',
                fontFamily: 'Open Sans, sans-serif', fontSize: '12px', fontWeight: '600', lineHeight: '21px', textAlign: 'left'
            }}>
                <input
                    style={{
                        width: '200px', height: '23px', top: '17px', left: '20px', position: 'absolute', borderRadius: '3px 0px 0px 0px', background: '#37373E',
                        borderBottom: '1px solid #37373E', color: '#FFFFFF', paddingLeft: '20px', border: '1px solid #37373E'
                    }}
                    id="formname"
                    type="text"
                    name="formName"
                    autoComplete='off'
                    placeholder="Enter Form Name"
                    value={name}
                    onInput={(e) => setName(e.target.value)}
                />
                {error.name && <p style={{ color: 'red' }}> ! Please enter a name </p>}

                <div style={{ left: '40%', top: '0.5%', position: 'absolute', display: 'flex', gap: '30px', textAlign: 'center' }}>
                    <span style={activeButton === 'Flow' ? activeButtonStyle : buttonStyle} onClick={handleFlowClick}>Flow</span>
                    <span style={activeButton === 'Theme' ? activeButtonStyle : buttonStyle} onClick={handleThemeClick}>Theme</span>
                    <span style={activeButton === 'Response' ? activeButtonStyle : buttonStyle} onClick={handleResponseClick}>Response</span>
                </div>
                <div style={{ left: '84%', top: '2%', position: 'absolute', display: 'flex', gap: '20px' }}>
                    <button style={{
                        background: '#848890', width: '65px', height: '25px', color: '#FFFFFF', fontFamily: 'Open Sans, sans-serif',
                        fontSize: '14px', fontWeight: '600', lineHeight: '16.8px', textAlign: 'center',
                    }}>Share</button>
                    <button style={{
                        background: '#4ADE80CC', width: '65px', height: '25px', color: '#FFFFFF', fontFamily: 'Open Sans, sans-serif',
                        fontSize: '14px', fontWeight: '600', lineHeight: '16.8px', textAlign: 'center',
                    }} onClick={handleSave}>Save</button>
                    <img src={Close} style={{ width: '24px', height: '24px' }} />
                </div>
            </div>

            <div style={panelStyle}>
                <div style={sectionStyle}>
                    <span style={bubblesTitleStyle}>Bubbles</span>
                    <div style={rowStyle}>
                        <div style={itemStyle} onClick={() => handleEntityClick('Text')}>
                            <img src={Textlogo} style={imgStyle} alt="Text Logo" />
                            <button style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}>Text</button>
                        </div>
                        <div style={itemStyle} onClick={() => handleEntityClick('Image')}>
                            <img src={Imagelogo} style={imgStyle} alt="Image Logo" />
                            <button style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}>Image</button>
                        </div>
                    </div>
                    <div style={rowStyle}>
                        <div style={itemStyle} onClick={() => handleEntityClick('Video')}>
                            <img src={Videologo} style={imgStyle} alt="Video Logo" />
                            <button style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}>Video</button>
                        </div>
                        <div style={itemStyle} onClick={() => handleEntityClick('GIF')}>
                            <img src={GIFlogo} style={imgStyle} alt="GIF Logo" />
                            <button style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}>GIF</button>
                        </div>
                    </div>
                </div>
                <div style={sectionStyle}>
                    <span style={inputsTitleStyle}>Inputs</span>
                    <div style={rowStyle}>
                        <div style={itemStyle} onClick={() => handleEntityClick('Text')}>
                            <img src={Tlogo} style={imgStyle} alt="Text Logo" />
                            <button style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}>Text</button>
                        </div>
                        <div style={itemStyle} onClick={() => handleEntityClick('Number')}>
                            <img src={Hash} style={imgStyle} alt="Number Logo" />
                            <button style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}>Number</button>
                        </div>
                    </div>
                    <div style={rowStyle}>
                        <div style={itemStyle} onClick={() => handleEntityClick('Email')}>
                            <img src={MailLogo} style={imgStyle} alt="Email Logo" />
                            <button style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}>Email</button>
                        </div>
                        <div style={itemStyle} onClick={() => handleEntityClick('Phone')}>
                            <img src={Phonelogo} style={imgStyle} alt="Phone Logo" />
                            <button style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}>Phone</button>
                        </div>
                    </div>
                    <div style={rowStyle}>
                        <div style={itemStyle} onClick={() => handleEntityClick('Date')}>
                            <img src={Datelogo} style={imgStyle} alt="Date Logo" />
                            <button style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}>Date</button>
                        </div>
                        <div style={itemStyle} onClick={() => handleEntityClick('Rating')}>
                            <img src={RatingLogo} style={imgStyle} alt="Rating Logo" />
                            <button style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}>Rating</button>
                        </div>
                    </div>
                    <div style={rowStyle}>
                        <div style={itemStyle} onClick={() => handleEntityClick('Buttons')}>
                            <img src={ButtonLogo} style={imgStyle} alt="Button Logo" />
                            <button style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}>Buttons</button>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <img src={Start} style={{ top: '137px', left: '720px', position: 'absolute' }} />
                <div style={{ padding: '20px', boxSizing: 'border-box', top: '200px', position: 'absolute', left: '700px' }}>
    {entities.map((entity, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px',
          width: '315px', height: '119px', borderRadius: '8px', background: '#18181B', padding: '10px',
          boxSizing: 'border-box', position: 'relative' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <span style={{ color: '#FFFFFF', fontFamily: 'Open Sans, sans-serif', fontSize: '20px', fontWeight: '600', lineHeight: '21px', textAlign: 'left', marginBottom: '10px' }}>
                  {entity.name}
              </span>
              {formInputs.map((entity,index)=>(
                <div key={index} style={{ display: 'flex', alignItems: 'center', border: '1px solid #F55050', borderRadius: '5px', background: '#1F1F23' }}>
                <img src={renderLogo(entity.type)} alt={`${entity.type} logo`} style={{ marginLeft: '20px', height: '20px' }} />
                <img src={Deleete}style={{top:'0px',left:'308px',position:'absolute'}} onClick={() => handleDelete(index)} alt="Delete"/>
                <input
                    style={{
                        width: '100%',
                        height: '45px',
                        background: 'transparent',
                        color: '#FFFFFF',
                        outline: 'none',
                        border: 'none',
                        padding: '10px'
                    }}
                    type={entity.type === 'Date' ? 'date' : entity.type === 'Email' ? 'email' : 'text'}
                    name={entity.name}
                    placeholder={`Click here to edit`}
                    value={entity.value || ''}
                    onClick={(e) => handleInputChange(index, e)}
                />
            </div>
              ))}
          </div>
      </div>
      
    ))}
</div>


            </div>

            
        </div>
    );
}

export default Formworkspace;
