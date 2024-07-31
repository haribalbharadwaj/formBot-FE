import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landingpage from "./Landingpage/Landingpage";
import Signin from "./Signin";
import Signup from "./Signup";
import Workspace from "./Workspace";
import Settings from "./Settings";
import Formspace from "./Formspace";
import Response from "./Response";
import Theme from "./Theme";
import Formbot from ".//FormBot/Formbot"
import { FormProvider } from "../components/FormContext";

function Home() {
    return (
        <FormProvider>
             <Router>
                <Routes>
                    <Route path='/' element={<Landingpage />} />
                    <Route path="/signin" element={<Signin/>}/>
                    <Route path="/Signup" element={<Signup/>}/>
                    <Route path="/workspace" element={<Workspace/>}/>
                    <Route path="/settings" element={<Settings/>}/>
                    <Route path="/formspace/:formId" element={<Formspace />} />
                    <Route path="/response/:formId" element={<Response/>}/>
                    <Route path="/theme" element={<Theme/>}/>
                    <Route path="/form/:formId" element={<Formbot />} />
                </Routes>
        </Router>
        </FormProvider>
       
    );
}

export default Home;
