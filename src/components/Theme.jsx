import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import Close from "../assets/close.png";
import TailBlue from "../assets/Tailblue.png";
import Light from "../assets/light.png";
import Dark from "../assets/dark.png";


function Theme(){
    const [activeButton, setActiveButton] = useState(null);
    const navigate = useNavigate();

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

      const shareStyle = {
        width:'65px',
        height:'25px',top:'16px',left:'1220px',
        borderRadius: '4px 4px 4px 4px'      
    }

      const activeShare = {
        ...shareStyle,
        background:'#1A5FFF'
      }

      const activeButtonStyle = {
        ...buttonStyle,
        color: '#7EA6FF',
        border: '1px solid #7EA6FF'
      };

      const handleResponseClick = () => {
        handleClick('Response');
        navigate('/response/:id')
      };
    
      const handleThemeClick = () => {
        handleClick('Theme');
        navigate('/theme')
      };
    
      const handleFlowClick = () => {
        handleClick('Flow');
        navigate('/formspace')
      };

      const handleThemeChange = (color) => {
        localStorage.setItem('selectedThemeColor', color);
    };
    
      



    return(
        <div style={{
            width: '1440px', height: '900px', margin: '0 auto',
            background:'#1F1F23',
            position: 'relative'}}>
                <div style={{width: '1440px',height: '56px',border: '0px 0px 1px 0px',background:'#18181B',borderBottom: '1px solid #FFFFFF29',
                    fontFamily: 'Open Sans,sans-serif',fontSize: '12px',fontWeight: '600',lineHeight: '21px',textAlign: 'left'
                 }}>

                    <div style={{left:'40%',top:'0.5%',position:'absolute',display: 'flex',gap: '30px',textAlign:'center'}}>
                        <span style={activeButton === 'Flow' ? activeButtonStyle:buttonStyle} onClick={handleFlowClick}>Flow</span>
                        <span style={activeButton === 'Theme' ? activeButtonStyle:buttonStyle} onClick={handleThemeClick}>Theme</span>
                        <span style={activeButton === 'Response' ? activeButtonStyle:buttonStyle} onClick={handleResponseClick}>Response</span>
                     </div>
                     <div style={{left:'84%',top:'2%',position:'absolute',display:'flex',gap:'20px'}}>
                        <button style={{background:'#848890',width:'65px',height:'25px',color:'#FFFFFF',fontFamily: 'Open Sans,sans-serif',
                        fontSize: '14px',fontWeight: '600',lineHeight: '16.8px',textAlign:'center',}}>Share</button>
                        <button style={{background:'#4ADE80CC',width:'65px',height:'25px',color:'#FFFFFF',fontFamily: 'Open Sans,sans-serif',
                        fontSize: '14px',fontWeight: '600',lineHeight: '16.8px',textAlign:'center',}}>Save</button>
                        <img src={Close} style={{width:'24px',height:'24px'}}/>
                     </div>

                </div>

                <div>
                    <h1>Select Theme</h1>
                    <img src={Light} onClick={() => handleThemeChange('#FFFFFF')}/>
                    <img src={Dark}onClick={() => handleThemeChange('##9400d3')}/>
                    <img  src={TailBlue}onClick={() => handleThemeChange('#508C9B')}/>
              </div>

        </div>
    );
}

export default Theme;