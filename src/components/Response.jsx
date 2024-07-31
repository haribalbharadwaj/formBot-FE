import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Close from '../assets/close.png';
import { useParams,useNavigate } from 'react-router-dom';
import { useFormContext } from "../components/FormContext";


function Response() {
    const [formData, setFormData] = useState(null);
    const [activeButton, setActiveButton] = useState('Response');
    const [error, setError] = useState(null);
    const [headers, setHeaders] = useState([]);
    const [rows, setRows] = useState([]);
    const { formId } = useParams();
    const { selectedFormId } = useFormContext();
    const navigate = useNavigate();

    const buttonStyle = {
        width: '58px',
        height: '32px',
        padding: '7.1px 13px 7.9px 13px',
        borderRadius: '6px 6px 6px 6px',
        background: 'transparent',
        color: '#FFFFFF',
        cursor: 'pointer'
      };

    
      useEffect(() => {
        const fetchFormData = async () => {
            try {
                // Save selectedFormId to localStorage
                localStorage.setItem('formId', selectedFormId);
    
                // Retrieve formId from localStorage
                const formId = localStorage.getItem('formId');
    
                if (formId) {
                    // Fetch form data from the backend
                    const response = await axios.get(`${process.env.REACT_APP_FORMBOT_BACKEND_URL}/form/getForm/${formId}`);
                    setFormData(response.data);
    
                    // Generate table headers and rows
                    generateHeadersAndValues(response.data.data);
                } else {
                    setError('Form ID not found in localStorage');
                }
            } catch (error) {
                setError('Error fetching form data');
                console.error('Error fetching form data:', error);
            }
        };
    
        fetchFormData();
    }, [selectedFormId]);  // Use selectedFormId as the dependency if it changes
    

    const generateHeadersAndValues = (data) => {
        const headers = ['Submitted time'];
        const rows = [];
        const fieldTypes = [
            'textInputs', 'imageInputs', 'videoInputs', 'gifInputs', 'tinputs',
            'numberInputs', 'phoneInputs', 'emailInputs', 'dateInputs',
            'ratingInputs', 'buttonInputs'
        ];

        const fieldData = {};

        // Collect headers and data
        fieldTypes.forEach((fieldType) => {
            if (data[fieldType] && data[fieldType].length) {
                data[fieldType].forEach((input, index) => {
                    const headerName = `${fieldType.replace(/([A-Z])/g, ' $1')} ${index + 1}`;
                    if (!headers.includes(headerName)) {
                        headers.push(headerName);
                    }
                    
                    if (!fieldData[headerName]) {
                        fieldData[headerName] = [];
                    }
                    
                    fieldData[headerName].push(input.value || 'N/A');
                });
            }
        });

        // Create rows based on collected data
        const maxRows = Math.max(...Object.values(fieldData).map(arr => arr.length));
        for (let i = 0; i < maxRows; i++) {
            const row = { 'Submitted time': new Date(data.updatedAt).toLocaleString() };
            headers.forEach(header => {
                row[header] = fieldData[header] && fieldData[header][i] ? fieldData[header][i] : 'N/A';
            });
            rows.push(row);
        }

        setHeaders(headers);
        setRows(rows);
    };

    if (error) return <div>{error}</div>;

    return (
        <div style={{ width: '1440px', height: '900px', margin: '0 auto', background: '#1F1F23', position: 'relative' }}>
            <div style={{ width: '1440px', height: '56px', borderBottom: '1px solid #FFFFFF29', background: '#18181B', fontFamily: 'Open Sans, sans-serif', fontSize: '12px', fontWeight: '600', lineHeight: '21px', textAlign: 'left' }}>
                <div style={{ left: '40%', top: '0.5%', position: 'absolute', display: 'flex', gap: '30px', textAlign: 'center' }}>
                    <span style={{ ...buttonStyle, color: '#7EA6FF', border: '1px solid #7EA6FF' }} onClick={() => handleClick('Flow')}>Flow</span>
                    <span style={{ ...buttonStyle, color: '#7EA6FF', border: '1px solid #7EA6FF' }} onClick={() => handleClick('Theme')}>Theme</span>
                    <span style={{ ...buttonStyle, color: '#7EA6FF', border: '1px solid #7EA6FF' }} onClick={() => handleClick('Response')}>Response</span>
                </div>
                <div style={{ left: '84%', top: '2%', position: 'absolute', display: 'flex', gap: '20px' }}>
                    <button style={{ background: '#848890', width: '65px', height: '25px', color: '#FFFFFF', fontFamily: 'Open Sans, sans-serif', fontSize: '14px', fontWeight: '600', lineHeight: '16.8px', textAlign: 'center' }}>Share</button>
                    <button style={{ background: '#4ADE80CC', width: '65px', height: '25px', color: '#FFFFFF', fontFamily: 'Open Sans, sans-serif', fontSize: '14px', fontWeight: '600', lineHeight: '16.8px', textAlign: 'center' }}>Save</button>
                    <img src={Close} style={{ width: '24px', height: '24px' }} />
                </div>
            </div>

            {formData && (
                <div style={{ margin: '20px',width:'62.44%',height: '120.83px',top: '169px',left: '270px',borderRadius: '16.11px',
                    position:'absolute',display:'flex',flexDirection:'row',gap:'300px', alignItems: 'center',justifyContent: 'center',
                    fontFamily: 'Open Sans,sans-serif',fontSize: '25.78px',fontWeight: '600',lineHeight: '35.1px',color:'#FFFFFF',
                    textAlign: 'left'}}>
                    <p style={{width: '195.75px',height: '120.83px',borderRadius: '16.11px',background: '#323232',textAlign:'center', 
                    display: 'flex',  flexDirection: 'column', position:'relative',justifyContent: 'center', padding: '10px'
                    }}><span  style={{ fontWeight: 'bold', display: 'block' }}>Views</span>
                     <span  style={{ fontWeight: 'bold', display: 'block' }}>{formData.views || 0}</span></p>

                    <p style={{width: '195.75px',height: '120.83px',borderRadius: '16.11px',background: '#323232',textAlign:'center', 
                    display: 'flex',  flexDirection: 'column', position:'relative',justifyContent: 'center', padding: '10px'
                    }}>
                        <span style={{ fontWeight: 'bold', display: 'block' }}>Starts</span>
                        <span style={{display: 'block' }}>{formData.startCount || 0}</span>
                        </p>
                    
                    <p  style={{width: '195.75px',height: '120.83px',borderRadius: '16.11px',background: '#323232',textAlign:'center', 
                    display: 'flex',  flexDirection: 'column', position:'relative',justifyContent: 'center', padding: '10px'
                    }}>
                        <span style={{ fontWeight: 'bold', display: 'block' }}>Completion Rate</span>
                        <span style={{ display: 'block' }}>{formData.completionRate ? formData.completionRate.toFixed(2) : 'N/A'}</span>
                    </p>
                </div>
            )}

            
            <div>
                {headers.length > 0 && (
                    <table style={{ borderCollapse: 'collapse', width: '1024px',height:'274px',left:'16%',top:'370px',position:'absolute' }}>
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index} style={{ border: '1px solid #ddd', padding: '8px', color: '#f4f4f4' }}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={index}>
                                    {headers.map((header, idx) => (
                                        <td key={idx} style={{ border: '1px solid #ddd', padding: '8px' }}>{row[header] || 'N/A'}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Response;
