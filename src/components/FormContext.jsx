// FormContext.js
import React, { createContext, useState, useContext } from 'react';

const FormContext = createContext();

export const FormProvider = ({ children }) => {
    const [selectedFormId, setSelectedFormId] = useState(null);

    return (
        <FormContext.Provider value={{ selectedFormId, setSelectedFormId }}>
            {children}
        </FormContext.Provider>
    );
};

export const useFormContext = () => useContext(FormContext);
