import React from "react";
import Formbot from "../../assets/SVG.png";
import Side1 from "../../assets/side1.png";
import Side2 from "../../assets/side2.png";
import Container from "../../assets/Container.png";
import Container1 from "../../assets/Container1.png";
import X from "../../assets/SVG1.png";
import redstar from "../../assets/redstar.png";

function Landingpage() {
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
                <button style={{
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
                <button style={{
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
                <button style={{
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
                    <button type="submit" style={{
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
</div>



            


   
        </div>
    );
}

export default Landingpage;
