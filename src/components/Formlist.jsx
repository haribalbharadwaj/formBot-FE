// FormList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const FormList = () => {
  const { userId} = useParams();
  const [form, setForm] = useState(null);  
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForm = async () => {
        console.log("userId", userId); 
      if (!userId) {
        console.error("User ID is missing from localStorage");
        return;
      }

      try {

        const backendUrl = process.env.REACT_APP_FORMBOT_BACKEND_URL;
        if (!backendUrl) {
            throw new Error('Backend URL is not defined');
        }
        const response = await axios.get(`${backendUrl}/form/forms/${userId}`);
        setForm(response.data);
        setStatus("SUCCESS");
      } catch (error) {
        console.error("Error fetching form", error);
        setStatus("ERROR");
      }
    };

    fetchForm();
  }, [userId]);

  if (!form) {
    return <div>Loading...</div>;
  }

  const handleFormClick = (formId) => {
    localStorage.setItem("selectedFormId", formId);
    navigate("/formspace");
  };

  const renderInput = (input, index) => {
    switch (input.type) {
      case "text":
        return (
          <div key={index} style={{ marginBottom: "10px" }}>
            <label style={{ color: "#FFFFFF" }}>{input.label}</label>
            <input type="text" value={input.value} readOnly />
          </div>
        );
      case "email":
        return (
          <div key={index} style={{ marginBottom: "10px" }}>
            <label style={{ color: "#FFFFFF" }}>{input.label}</label>
            <input type="email" value={input.value} readOnly />
          </div>
        );
      // Add cases for other input types as needed
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: "20px", background: "#1F1F23", minHeight: "100vh" }}>
      <h2 style={{ color: "#FFFFFF" }}>Form Details</h2>
      {status === "SUCCESS" && (
        <div
          style={{
            background: "#18181B",
            padding: "15px",
            borderRadius: "8px",
            color: "#FFFFFF"
          }}
        >
          <h3>{form.formName}</h3>
          <p>ID: {form._id}</p>
          <p>Bubbles: {form.bubbles.length}</p>
          <p>Inputs:</p>
          <div>
            {form.inputs.map((input, index) => (
              <div key={index}>{renderInput(input, index)}</div>
            ))}
          </div>
        </div>
      )}
      {status === "ERROR" && <p style={{ color: "red" }}>Failed to load form. Please try again.</p>}
    </div>
  );
};

export default FormList;
