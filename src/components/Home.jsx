import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landingpage from "./Landingpage/Landingpage";

function Home() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path='/' element={<Landingpage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default Home;
