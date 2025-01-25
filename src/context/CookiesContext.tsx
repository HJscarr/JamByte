// This file can be deleted if it was only used for CloudFront cookies

'use client'
import React, { createContext, useContext, useState } from 'react';

const CookiesContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>([false, () => {}]);

export const useCookiesContext = () => useContext(CookiesContext);

interface CookiesProviderProps {
    children: React.ReactNode;
}

export const CookiesProvider: React.FC<CookiesProviderProps> = ({ children }) => {
const [cookiesSet, setCookiesSet] = useState(false);
return (
    <CookiesContext.Provider value={[cookiesSet, setCookiesSet]}>
        {children}
    </CookiesContext.Provider>
);
};
