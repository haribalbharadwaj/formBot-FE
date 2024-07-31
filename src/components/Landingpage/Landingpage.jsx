import React from "react";
import Formbot from "../../assets/SVG.png";
import Side1 from "../../assets/side1.png";
import Side2 from "../../assets/side2.png";
import Container from "../../assets/Container.png";
import Container1 from "../../assets/Container1.png";
import X from "../../assets/SVG1.png";
import redstar from "../../assets/redstar.png";
import Container2 from "../../assets/Continer2.png";
import Container3 from "../../assets/Container3.png";
import Logos1 from "../../assets/Logos1.png";
import Collect from "../../assets/Collect.png";
import Features from "../../assets/Features.png";
import Logos from "../../assets/logos.png";
import SVG3 from "../../assets/SVG3.png";
import Side from "../../assets/side1.png";
import Icon from "../../assets/Icon.png";
import {useNavigate} from 'react-router-dom';



function Landingpage() {
    const navigate = useNavigate();
    
    const handleSignin =()=>{
        navigate('/signin');
    }
    return (
        <div style={{
            width: '1440px', // Full page width
            height: '7775px', // Full page height
            margin: '0 auto', // Center the content horizontally
            display: 'flex',
            justifyContent: 'center',
            background: `
            linear-gradient(0deg, #121212, #1A202C),
            linear-gradient(0deg, #171923, #171923),
            linear-gradient(0deg, #171923, #171923)
        `
        }}>
            
            <div style={{
                width: '1280px', // Width of the navigation bar
                height: '72px', // Height of the navigation bar
                marginTop: '22px', // Space between top of the page and navigation bar
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 32px',
               // background: 'linear-gradient(0deg, #121212, #121212)'

            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={Formbot} alt="Formbot" style={{ marginRight: '16px',width:'35px',height:'35px',gap:'0px',opacity:'0px'}} />
                    <p style={{ margin:'0',fontFamily:'Outfit,sans-serif',fontSize:'18px',fontWeight:'700',lineHeight:'21.6px',textAlign:'left',
                    color:'#FFFFFF'
                    }}>FormBot</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                <button
                onClick={handleSignin} 
                style={{
                        width: '90px',
                        height: '40px',
                        padding: '10px 17px',
                        borderRadius: '6px',
                        border: '1px solid #7EA6FF',
                        color: '#7EA6FF',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontFamily:'Open Sans,sans-serif',
                        fontSize:'16px',
                        fontWeight:'700',
                        lineHeight:'19.2px',
                        textAlign:'center'

                    }}>Sign in</button>
                <button 
                onClick={handleSignin} 
                style={{
                        width: '173px',
                        height: '40px',
                        padding: '10px 17px',
                        borderRadius: '6px',
                        border: '1px solid #1A5FFF',
                        background: '#1A5FFF',
                        cursor: 'pointer',
                        boxShadow: '0px 1px 0px 0px #FFFFFF33 inset',
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '16px',
                        fontWeight: '700',
                        lineHeight: '20px',
                        color: '#FFFFFF',
                        textAlign: 'center'
                    }}>Create a FormBot</button>
                </div>
            </div>
            <div style={{
                            width: '1440px',
                            height: '1191.51px',
                            top: '180px',
                            position: 'absolute',
                            border: '1px solid green',
                            left: '39px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    alignItems: 'center',
                    marginTop: '20px'
                }}>
                    <img 
                        src={Side1} 
                        style={{
                            width: '300px',
                            height: '300px',
                            transform: 'rotate(0deg)'
                        }}
                    />
                    <h1 
                        style={{
                            fontFamily: 'Outfit, sans-serif',
                            fontSize: '72px',
                            fontWeight: '700',
                            lineHeight: '1.2',
                            textAlign: 'center',
                            width: '811px',
                            margin: '0 20px',
                            display: 'block',
                            background: 'linear-gradient(90deg, #4B83FF 0%, #B794F4 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        <span style={{ display: 'block',whiteSpace: 'nowrap'}}>Build advanced chatbots</span>
                        <span style={{ display: 'block', marginTop: '10px' ,whiteSpace: 'nowrap'}}>visually</span>
                    </h1>
                    <img 
                        src={Side2} 
                        style={{
                            width: '299.9px',
                            height: '273.28px',
                            marginRight: '20px'
                        }}
                    />
                 </div>
                <p style={{
                    textAlign: 'center',
                    width: '811px',
                    margin: '0 20px',
                    marginTop: '-30px',
                    fontFamily:'Open Sans,sans-serif',fontSize:'20px',fontWeight:'400',lineHeight:'30px',color:'#FFFFFFEB'
                }}>
                    Typebot gives you powerful blocks to create unique chat experiences. Embed them anywhere on your web/mobile apps and start collecting results like magic.
                </p>
                <button
                onClick={handleSignin}
                 style={{
                    width:'292px',height:'64px',padding:'21.15px 32px 21.25px 32px',borderRadius:'6px 0px 0px 0px',background:'#1A5FFF',
                    boxShadow:'0px 1px 0px 0px #FFFFFF33 inset',fontFamily:'Open Sans,sans-serif',fontSize:'18px',fontWeight:'600',
                    lineHeight:'21.6px',textAlign:'left',color:'#FFFFFF',marginTop:'20px'
                    }}>
                    Create a FormBot for free
                </button>
                <img 
                    src={Container} 
                    style={{
                        width: '1200px',
                        height: '686.51px',
                        borderRadius: '10px',
                        marginTop: '20px'
                    }}
                />
            </div>

            <div style={{
                            width: '1200px',
                            height: '1094px',
                            top: '1423px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            padding: '128px 16px 0px 16px',
                            border: '1px solid green',
                            position: 'absolute',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                        <h1 style={{
                            fontFamily: 'Outfit, sans-serif',
                            fontSize: '60px',
                            fontWeight: '700',
                            lineHeight: '72px',
                            textAlign: 'center',
                            color: '#FFFFFFEB',
                            marginBottom: '20px'
                        }}>
                            Replace your old school forms <br /> with <br /> chatbots
                        </h1>
                        <p style={{
                            fontFamily: 'Open Sans, sans-serif',
                            fontSize: '20px',
                            fontWeight: '400',
                            lineHeight: '30px',
                            textAlign: 'center',
                            color: '#A0AEC0',
                            marginBottom: '40px'
                        }}>
                            Typebot is a better way to ask for information. It leads to an increase in customer satisfaction and retention and multiply by 3 your conversion rate compared to classical forms.
                        </p>
                        <div style={{
                            width: '1168px',
                            height: '636px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                            gap: '24px',
                            marginTop: 'auto'
                        }}>
                            <div style={{ 
                                position: 'relative', 
                                width: '572px', 
                                height: '562px', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                justifyContent: 'flex-end',
                                marginBottom:'24px'

                                                }}>
                                <img src={X} style={{
                                    width: '50px',
                                    height: '50px',
                                    position: 'absolute',
                                    top: '-75px', // Move the X image up to align with the top of the Container1 image
                                    left: 'calc(50% - 25px)' // Center the "X" above the form
                                }} />
                               <form style={{
                                            width: '572px',
                                            height: '562px',
                                            padding: '25px 0px 0px 0px',
                                            borderRadius: '6px 6px 6px 6px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            gap: '16px',
                                            opacity: '1',
                                            fontFamily: 'Open Sans, sans-serif',
                                            fontSize: '16px',
                                            fontWeight: '400',
                                            lineHeight: '24px',
                                            textAlign: 'left',
                                            color: '#FFFFFFEB',
                                            backgroundColor: '#1A202C', // Background color of the form
                                        }}>
                                        <div style={{ width: '100%', marginBottom: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                            <label style={{ marginBottom: '5px' }}>
                                                Full Name:
                                                <img src={redstar} style={{ marginBottom: '5px' }} />
                                            </label>
                                            <input type="text" name="fullName" style={{
                                                width: '522px',
                                                height: '40px',
                                                padding: '10px',
                                                borderRadius: '6px 6px 6px 6px',
                                                margin: '0 auto', // Center the input horizontally
                                                backgroundColor: 'transparent', // Background color of input
                                                color: '#FFFFFFEB', // Text color of input
                                                border: '1px solid #FFFFFF29'
                                            }} placeholder="Enter your full name" />
                                        </div>
                                        <div style={{ width: '100%', marginBottom: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                            <label style={{ marginBottom: '5px' }}>
                                                Email:
                                                <img src={redstar} style={{ marginBottom: '5px' }} />
                                            </label>
                                            <input type="email" name="email" style={{
                                                width: '522px',
                                                height: '40px',
                                                padding: '10px',
                                                borderRadius: '6px 6px 6px 6px',
                                                margin: '0 auto', // Center the input horizontally
                                                backgroundColor: 'transparent', // Background color of input
                                                color: '#FFFFFFEB', // Text color of input
                                                border: '1px solid #FFFFFF29'
                                            }} placeholder="Enter your email" />
                                        </div>
                                        <div style={{ width: '100%', marginBottom: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                            <label style={{ marginBottom: '5px' }}>
                                                What services are you interested in:
                                                <img src={redstar} style={{ marginBottom: '5px' }} />
                                            </label>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                <label style={{ color: '#FFFFFFEB' }}>
                                                    <input type="checkbox" name="services" value="Website Dev" style={{
                                                        appearance: 'none', // Remove default styles
                                                        backgroundColor: 'transparent', // Transparent background
                                                        width: '16px',
                                                        height: '16px',
                                                        marginRight: '10px',
                                                        border: '1px solid #FFFFFFEB', // Border matching text color
                                                        cursor: 'pointer'
                                                    }} /> Website Dev
                                                </label>
                                                <label style={{ color: '#FFFFFFEB' }}>
                                                    <input type="checkbox" name="services" value="Content Marketing" style={{
                                                        appearance: 'none',
                                                        backgroundColor: 'transparent',
                                                        width: '16px',
                                                        height: '16px',
                                                        marginRight: '10px',
                                                        border: '1px solid #FFFFFFEB',
                                                        cursor: 'pointer'
                                                    }} /> Content Marketing
                                                </label>
                                                <label style={{ color: '#FFFFFFEB' }}>
                                                    <input type="checkbox" name="services" value="Social Media" style={{
                                                        appearance: 'none',
                                                        backgroundColor: 'transparent',
                                                        width: '16px',
                                                        height: '16px',
                                                        marginRight: '10px',
                                                        border: '1px solid #FFFFFFEB',
                                                        cursor: 'pointer'
                                                    }} /> Social Media
                                                </label>
                                                <label style={{ color: '#FFFFFFEB' }}>
                                                    <input type="checkbox" name="services" value="UI/UX Design" style={{
                                                        appearance: 'none',
                                                        backgroundColor: 'transparent',
                                                        width: '16px',
                                                        height: '16px',
                                                        marginRight: '10px',
                                                        border: '1px solid #FFFFFFEB',
                                                        cursor: 'pointer'
                                                    }} /> UI/UX Design
                                                </label>
                                            </div>
                                        </div>
                                        <div style={{ width: '100%', marginBottom: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                            <label style={{ marginBottom: '5px' }}>
                                                Additional Information:
                                                <img src={redstar} style={{ marginBottom: '5px' }} />
                                            </label>
                                            <textarea name="additionalInfo" style={{
                                                width: '522px',
                                                height: '80px',
                                                padding: '10px',
                                                margin: '0 auto', // Center the textarea horizontally
                                                backgroundColor: 'transparent', // Background color of textarea
                                                color: '#FFFFFFEB',
                                                border: '1px solid #FFFFFF29',
                                                fontFamily: 'Open Sans, sans-serif',
                                                fontSize: '16px',
                                                fontWeight: '400',
                                                lineHeight: '22px',
                                                textAlign: 'left'
                                            }} placeholder="Additional Information"></textarea>
                                        </div>
                                        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                                                        <button type="submit" 
                                                        onClick={handleSignin} 
                                                        style={{
                                                            width: '87px',
                                                            height: '40px',
                                                            padding: '10.05px 16px 10.75px 16px',
                                                            borderRadius: '6px',
                                                            backgroundColor: '#4B83FF',
                                                            color: '#FFFFFF',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            background: '#1A5FFF',
                                                            boxShadow: '0px 1px 0px 0px #FFFFFF33 inset',
                                                            fontFamily: 'Open Sans, sans-serif',
                                                            fontSize: '16px',
                                                            fontWeight: '600',
                                                            lineHeight: '19.2px',
                                                            textAlign: 'left',
                                                        }}>Submit</button>
                                        </div>
                                    </form>
                                </div>
                                <img src={Container1} style={{ width: '572px', height: '636px' }} />
                            </div>
                            
                                <img src={Container2} style={{width:'1,000px',height:'618.68px',padding:'208px 16px 0px 16px',justify:'space-between',top:'2170px'}}/>
                                <img src={Container3} style={{width:'1,440px',height:'538.68px',top:'3229px',left:'12px',padding:'0px 220px 0px 220px'}}/>
                                <img src={Logos1} style={{width:'1,440px',height:'656px',top:'3798px',left:'12px'}}/>
                                <img src={Collect} style={{width:'1,440px',height:'1,025px',top:'4525px',left:'9px',padding:'0px 120px 0px 120px'}}/>
                                <img src={Features} style={{ width:'1,440px',height:'743.98px',top:'5517px',left:'17px',padding:'0px 120px 0px 120px'}}/>
                                <img src={Logos} style={{width:'1440px',height:'330px',top:'6314px',left:'20px',padding:'0px 151.08px 0px 151.08px'}}/>
                                
                                
                                <div style={{
  width: '100%',
  maxWidth: '1440px',
  height: '900px',
  padding: '0 80px', // Adjusted padding for alignment
  fontFamily: 'Outfit, sans-serif',
  margin: '0 auto',
  position: 'relative',
  background: 'linear-gradient(180deg, #171923 0%, #1A202C 100%)'
}}>
  <img 
    src={SVG3} 
    alt="SVG3" 
    style={{
      width: '262.5px',
      height: '278.08px',
      position: 'absolute',
      top: '400px', // Align with h1
      right: '80px' // Positioned towards the right
    }}
  />
  <img 
    src={Side} 
    alt="Side" 
    style={{
      width: '300px',
      height: '300px',
      position: 'absolute',
      top: '20px', // Move upwards
      left: '-40px' // Move further to the left
    }}
  />
  <h1 style={{
    width: '100%',
    height: '87px',
    fontSize: '36px',
    fontWeight: '800',
    lineHeight: '43.2px',
    letterSpacing: '-0.9px',
    textAlign: 'center',
    color: '#FFFFFFEB',
    position: 'absolute',
    top: '400px', // Align with SVG3
    left: '45%', // Move left relative to container
    transform: 'translateX(-50%)'
  }}>
    Improve conversion and user engagement<br/>with FormBots
  </h1>
  <button 
  onClick={handleSignin} 
  style={{
    width: '201px',
    height: '64px',
    padding: '5px 0px',
    borderRadius: '6px',
    boxShadow: '0px 1px 0px 0px #FFFFFF33 inset',
    background: '#1A5FFF',
    color: '#FFFFFF',
    position: 'absolute',
    top: '530px', // Positioned below h1
    left: '45%', 
    transform: 'translateX(-50%)',
    fontFamily: 'Open Sans,sans-serif',
    fontSize:'18px',
    fontWeight:'600',
    lineHeight:'21.6px',
    textAlign:'center'

  }}>
    Create a FormBot
  </button>
  <p style={{
    color: '#A0AEC0',
    fontWeight: '400',
    position: 'absolute',
    top: '600px', // Positioned below the button
    left: '45%', 
    transform: 'translateX(-50%)', 
    textAlign: 'center',
    width: '201px'
  }}>
    No trial. Generous free plan.
  </p>
</div>

</div>

<div className="Footer" style={{
  fontFamily: 'Open Sans, sans-serif',
  fontSize: '16px',
  fontWeight: '400',
  lineHeight: '24px',
  color: '#FFFFFFEB',
  display: 'flex',
  justifyContent: 'space-between',
  padding: '30px',
  backgroundColor: '#1A202C',
  position: 'absolute',
  bottom: '0',
  width: '1440px',
  height: '250px',
  boxSizing: 'border-box',
  gap: '20px',
  top:'7547px',
  margin: '40px 40px 40px 40px' // Adjust the gap between columns
}}>
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '0px',
    margin: '40px 40px 40px 40px' // Adjust margin for first column
  }}>
    <p style={{ margin: '0', position: 'relative' }}>
      <span>Made with ❤️ by </span><br/> 
        <span style={{ position: 'relative', display: 'inline-block' }}>@cuvette</span> 
        <span style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '1px', backgroundColor: '#FFFFFFEB' }}></span>
    </p>
  </div>
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '0px',
    margin: '40px 40px 40px 40px', // Move the second column to the right
    flex: '1' // Allow the second column to take available space
  }}>
    <p style={{ display: 'flex', alignItems: 'center', margin: '0', position: 'relative' }}>
      <span style={{ position: 'relative', display: 'inline-block' }}>
        Status
        <span style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '1px', backgroundColor: '#FFFFFFEB' }}></span>
      </span>
      <img src={Icon} style={{ width: '16px', height: '16px', marginLeft: '4px' }} />
    </p>
    <p style={{ display: 'flex', alignItems: 'center', margin: '0', position: 'relative' }}>
      <span style={{ position: 'relative', display: 'inline-block' }}>
        Documentation
        <span style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '1px', backgroundColor: '#FFFFFFEB' }}></span>
      </span>
      <img src={Icon} style={{ width: '16px', height: '16px', marginLeft: '4px' }} />
    </p>
    <p style={{ display: 'flex', alignItems: 'center', margin: '0', position: 'relative' }}>
      <span style={{ position: 'relative', display: 'inline-block' }}>
        Roadmap
        <span style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '1px', backgroundColor: '#FFFFFFEB' }}></span>
      </span>
      <img src={Icon} style={{ width: '16px', height: '16px', marginLeft: '4px' }} />
    </p>
    <p style={{ display: 'flex', alignItems: 'center', margin: '0', position: 'relative' }}>
      <span style={{ position: 'relative', display: 'inline-block' }}>
        Pricing
        <span style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '1px', backgroundColor: '#FFFFFFEB' }}></span>
      </span>
      <img src={Icon} style={{ width: '16px', height: '16px', marginLeft: '4px' }} />
    </p>
  </div>
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '0px',
    margin: '40px 40px 40px 40px', // Move the third column to the left
    flex: '1' // Allow the third column to take available space
  }}>
    <p style={{ display: 'flex', alignItems: 'center', margin: '0', position: 'relative' }}>
      <span style={{ position: 'relative', display: 'inline-block' }}>
        Discord
        <span style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '1px', backgroundColor: '#FFFFFFEB' }}></span>
      </span>
      <img src={Icon} style={{ width: '16px', height: '16px', marginLeft: '4px' }} />
    </p>
    <p style={{ display: 'flex', alignItems: 'center', margin: '0', position: 'relative' }}>
      <span style={{ position: 'relative', display: 'inline-block' }}>
        GitHub repository
        <span style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '1px', backgroundColor: '#FFFFFFEB' }}></span>
      </span>
      <img src={Icon} style={{ width: '16px', height: '16px', marginLeft: '4px' }} />
    </p>
    <p style={{ display: 'flex', alignItems: 'center', margin: '0', position: 'relative' }}>
      <span style={{ position: 'relative', display: 'inline-block' }}>
        Twitter
        <span style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '1px', backgroundColor: '#FFFFFFEB' }}></span>
      </span>
      <img src={Icon} style={{ width: '16px', height: '16px', marginLeft: '4px' }} />
    </p>
    <p style={{ display: 'flex', alignItems: 'center', margin: '0', position: 'relative' }}>
      <span style={{ position: 'relative', display: 'inline-block' }}>
        LinkedIn
        <span style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '1px', backgroundColor: '#FFFFFFEB' }}></span>
      </span>
      <img src={Icon} style={{ width: '16px', height: '16px', marginLeft: '4px' }} />
    </p>
    <p style={{ display: 'flex', alignItems: 'center', margin: '0', position: 'relative' }}>
      <span style={{ position: 'relative', display: 'inline-block' }}>
        OSS Friends
        <span style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '1px', backgroundColor: '#FFFFFFEB' }}></span>
      </span>
      <img src={Icon} style={{ width: '16px', height: '16px', marginLeft: '4px' }} />
    </p>
  </div>
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '0px',
    margin: '40px 40px 40px 40px' // Adjust margin for fourth column
  }}>
    <p style={{ margin: '0', position: 'relative' }}>
      <span style={{ position: 'relative', display: 'inline-block' }}>
        About
        <span style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '1px', backgroundColor: '#FFFFFFEB' }}></span>
      </span>
    </p>
    <p style={{ margin: '0', position: 'relative' }}>
      <span style={{ position: 'relative', display: 'inline-block' }}>
        Contact
        <span style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '1px', backgroundColor: '#FFFFFFEB' }}></span>
      </span>
    </p>
    <p style={{ margin: '0', position: 'relative' }}>
      <span style={{ position: 'relative', display: 'inline-block' }}>
        Terms of Service
        <span style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '1px', backgroundColor: '#FFFFFFEB' }}></span>
      </span>
    </p>
    <p style={{ margin: '0', position: 'relative' }}>
      <span style={{ position: 'relative', display: 'inline-block' }}>
        Privacy Policy
        <span style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '1px', backgroundColor: '#FFFFFFEB' }}></span>
      </span>
    </p>
  </div>
</div>


        </div>
    );
}

export default Landingpage;
