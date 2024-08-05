import React, {useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Close from "../assets/close.png";
import TailBlue from "../assets/Tailblue.png";
import Light from "../assets/light.png";
import Dark from "../assets/dark.png";
import Hello from "../assets/hello.png";

function Theme() {
    const [activeButton, setActiveButton] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState('#1F1F23');
    const navigate = useNavigate();
    const { formId } = useParams(); // Retrieve formId from route parameters

    const handleClick = (buttonName) => {
        setActiveButton(buttonName);
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

    const handleResponseClick = () => {
        handleClick('Response');
        navigate(`/response/${formId}`); // Include formId in URL
    };

    const handleThemeClick = () => {
        handleClick('Theme');
        navigate(`/theme/${formId}`); // Include formId in URL
    };

    const handleFlowClick = () => {
        handleClick('Flow');
        navigate('/formspace');
    };

    const handleThemeChange = (color) => {
        console.log('Selected color:', color);
        localStorage.setItem('selectedThemeColor', color);
        setBackgroundColor(color); 
        // Optionally, you can also set the background color of the page or other styles here

    const themeElement = document.getElementById('select theme');
    if (themeElement) {
        themeElement.style.backgroundColor = color;
    }
    };

    useEffect(() => {
      // Apply the background color from localStorage on component mount
      const savedColor = localStorage.getItem('selectedThemeColor');
      if (savedColor) {
          setBackgroundColor(savedColor);

          const themeElement = document.getElementById('select theme');
            if (themeElement) {
                themeElement.style.backgroundColor = savedColor;
            }
      }
  }, []);

    return (
        <div style={{width: '1440px', height: '900px', margin: '0 auto',background: '#1F1F23',position: 'relative'}}>
            <div style={{width: '1440px', height: '56px', borderBottom: '1px solid #FFFFFF29',background: '#18181B', fontFamily: 'Open Sans, sans-serif', fontSize: '12px',fontWeight: '600', lineHeight: '21px', textAlign: 'left'}}>
                <div style={{left: '40%', top: '0.5%', position: 'absolute', display: 'flex',gap: '30px', textAlign: 'center'}}>
                    <span style={activeButton === 'Flow' ? activeButtonStyle : buttonStyle} onClick={handleFlowClick}>Flow</span>
                    <span style={activeButton === 'Theme' ? activeButtonStyle : buttonStyle} onClick={handleThemeClick}>Theme</span>
                    <span style={activeButton === 'Response' ? activeButtonStyle : buttonStyle} onClick={handleResponseClick}>Response</span>
                </div>
                <div style={{left: '84%', top: '2%', position: 'absolute', display: 'flex', gap: '20px'}}>
                    <button style={{background: '#848890', width: '65px', height: '25px', color: '#FFFFFF',fontFamily: 'Open Sans, sans-serif', fontSize: '14px', fontWeight: '600',
                        lineHeight: '16.8px', textAlign: 'center'}}>Share</button>
                    <button style={{background: '#4ADE80CC', width: '65px', height: '25px', color: '#FFFFFF',fontFamily: 'Open Sans, sans-serif', fontSize: '14px', fontWeight: '600',
                        lineHeight: '16.8px', textAlign: 'center'}}>Save</button>
                    <img src={Close} style={{ width: '24px', height: '24px' }} />
                </div>
            </div>

            <div style={{width:'349px',height:'842px',top:'57px',border:'2px',position:'absolute',background:'#18181B'}}>

                <span style={{width:'225px',height:'27px',top:'38px',left:'62px',fontFamily: 'Open Sans,sans-serif',color:'#FFFFFF',position:'absolute',fontSize:'20px',fontWeight:'700',lineHeight:'27.24px',letterSpacing:'0.03em',textAlign:'left'}}>Customize the theme</span>

                <img src={Light} alt="Light Theme" onClick={() => handleThemeChange('#FFFFFF')} style={{ cursor: 'pointer',width:'241px',height:'193px',top:'141px',left:'54px',position:'absolute' }} />

                <img src={Dark} alt="Dark Theme" onClick={() => handleThemeChange('#181B34')} style={{ cursor: 'pointer',width:'241px',height:'193px',top:'357px',left:'57px',position:'absolute' }} />

                <img src={TailBlue} alt="Tail Blue Theme" onClick={() => handleThemeChange('#508C9B')} style={{ cursor: 'pointer',width:'241px',height:'198px',top:'606px',left: '57px',position:'absolute' }} />
            </div>

            <div style={{width:'1090px',height:'840px',top:'60px',left:'350px',position:'absolute',background:'#FFFFFF'}} id="select theme">
                <img src={Hello}/>

            </div>
        </div>
    );
}

export default Theme;
