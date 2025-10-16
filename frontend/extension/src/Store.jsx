import React, { useState } from 'react';

export const Context = React.createContext();

const Store = ({ children }) => {
    const [page, setPage] = useState("chat");
    const [base64image, setBase64image] = useState("");
    return (
        <Context.Provider value={{pageData: [page, setPage], 
            base64imageData: [base64image, setBase64image]}}>
                
                {children}
        </Context.Provider>
    )
};

export default Store;