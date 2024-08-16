import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Close from '../assets/close.png';
import { useParams } from 'react-router-dom';

function Response() {
    const [formData, setFormData] = useState(null);
    const [error, setError] = useState(null);
    const [headers, setHeaders] = useState([]);
    const [rows, setRows] = useState([]);
    const { formId } = useParams();

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
                console.log("Fetching form data for formId:", formId); // Debug log
                if (formId) {
                    const response = await axios.get(`${process.env.REACT_APP_FORMBOT_BACKEND_URL}/form/response/${formId}`);
                    console.log("Response data:", response.data); // Debug log
                    setFormData(response.data);
                    generateHeadersAndValues(response.data);
                } else {
                    setError('Form ID not found in localStorage');
                }
            } catch (error) {
                setError('Error fetching form data');
                console.error('Error fetching form data:', error);
            }
        };

        fetchFormData();
    }, [formId]);

    const generateHeadersAndValues = (formData) => {
        const submissions = formData.data || [];
        const headersSet = new Set(['Slno', 'Submitted time']);
        const rows = [];

        const includedInputTypes = [
            'tinputs', 'emailInputs', 'phoneInputs', 'numberInputs', 'dateInputs', 'ratingInputs', 'buttonInputs'
        ];

        submissions.forEach((submission, index) => {
            const row = {
                'Slno': index + 1,
                'Submitted time': new Date(submission.submissionTime).toLocaleString()
            };

            includedInputTypes.forEach((inputType) => {
                const inputs = submission.submittedData[inputType] || [];

                inputs.forEach((input, idx) => {
                    const headerName = `${inputType.replace(/([A-Z])/g, ' $1')} ${idx + 1}`;

                    if (!headersSet.has(headerName)) {
                        headersSet.add(headerName);
                    }

                    row[headerName] = input.value || 'N/A';
                });
            });

            rows.push(row);
        });

        const headersArray = Array.from(headersSet);

        setHeaders(headersArray);
        setRows(rows);
    };

    if (error) return <div>{error}</div>;

    // Check if there are submissions
    const hasSubmissions = formData?.data?.length > 0;

    return (
        <div style={{ width: '1440px', height: '900px', margin: '0 auto', background: '#1F1F23', position: 'relative' }}>
            <div style={{ width: '1440px', height: '56px', borderBottom: '1px solid #FFFFFF29', background: '#18181B', fontFamily: 'Open Sans, sans-serif', fontSize: '12px', fontWeight: '600', lineHeight: '21px', textAlign: 'left' }}>
                <div style={{ left: '40%', top: '0.5%', position: 'absolute', display: 'flex', gap: '30px', textAlign: 'center' }}>
                    <span style={{ ...buttonStyle, color: '#7EA6FF', border: '1px solid #7EA6FF' }}>Flow</span>
                    <span style={{ ...buttonStyle, color: '#7EA6FF', border: '1px solid #7EA6FF' }}>Theme</span>
                    <span style={{ ...buttonStyle, color: '#7EA6FF', border: '1px solid #7EA6FF' }}>Response</span>
                </div>
                <div style={{ left: '84%', top: '2%', position: 'absolute', display: 'flex', gap: '20px' }}>
                    <button style={{ background: '#848890', width: '65px', height: '25px', color: '#FFFFFF', fontFamily: 'Open Sans, sans-serif', fontSize: '14px', fontWeight: '600', lineHeight: '16.8px', textAlign: 'center' }}>Share</button>
                    <button style={{ background: '#4ADE80CC', width: '65px', height: '25px', color: '#FFFFFF', fontFamily: 'Open Sans, sans-serif', fontSize: '14px', fontWeight: '600', lineHeight: '16.8px', textAlign: 'center' }}>Save</button>
                    <img src={Close} style={{ width: '24px', height: '24px' }} alt="Close" />
                </div>
            </div>

            {hasSubmissions && (
                <div style={{ margin: '20px', width: '62.44%', height: '120.83px', top: '169px', left: '270px', borderRadius: '16.11px',
                    position: 'absolute', display: 'flex', flexDirection: 'row', gap: '300px', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Open Sans,sans-serif', fontSize: '25.78px', fontWeight: '600', lineHeight: '35.1px', color: '#FFFFFF',
                    textAlign: 'left' }}>
                    <p style={{ width: '195.75px', height: '120.83px', borderRadius: '16.11px', background: '#323232', textAlign: 'center', 
                    display: 'flex', flexDirection: 'column', position: 'relative', justifyContent: 'center', padding: '10px'
                    }}>
                        <span style={{ fontWeight: 'bold', display: 'block' }}>Views</span>
                        <span style={{ fontWeight: 'bold', display: 'block' }}>{formData.views || 0}</span>
                    </p>

                    <p style={{ width: '195.75px', height: '120.83px', borderRadius: '16.11px', background: '#323232', textAlign: 'center', 
                    display: 'flex', flexDirection: 'column', position: 'relative', justifyContent: 'center', padding: '10px'
                    }}>
                        <span style={{ fontWeight: 'bold', display: 'block' }}>Starts</span>
                        <span style={{ display: 'block' }}>{formData.startCount || 0}</span>
                    </p>
                    
                    <p style={{ width: '195.75px', height: '120.83px', borderRadius: '16.11px', background: '#323232', textAlign: 'center', 
                    display: 'flex', flexDirection: 'column', position: 'relative', justifyContent: 'center', padding: '10px'
                    }}>
                        <span style={{ fontWeight: 'bold', display: 'block' }}>Completion Rate</span>
                        <span style={{ display: 'block' }}>{formData.completionRate ? formData.completionRate.toFixed(2) : 'N/A'}</span>
                    </p>
                </div>
            )}

            {hasSubmissions && (
                <div>
                    {headers.length > 0 && (
                        <table style={{ borderCollapse: 'collapse', width: '1024px', height: '274px', left: '16%', top: '370px', position: 'absolute' }}>
                            <thead>
                                <tr>
                                    {headers.map((header, index) => (
                                        <th key={index} style={{ border: '1px solid #ddd', padding: '8px', color: '#7EA6FF', backgroundColor: '#3D3D40' }}>
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.length > 0 ? rows.map((row, index) => (
                                    <tr key={index}>
                                        {headers.map((header, index) => (
                                            <td key={index} style={{ border: '1px solid #ddd', padding: '8px', color: '#FFFFFF', backgroundColor: '#2A2A2A' }}>
                                                {row[header] || 'N/A'}
                                            </td>
                                        ))}
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={headers.length} style={{ textAlign: 'center', color: '#FFFFFF' }}>No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}

export default Response;
