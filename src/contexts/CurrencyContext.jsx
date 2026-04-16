import React, { createContext, useContext, useState, useEffect } from "react";

const CurrencyContext = createContext();

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error("useCurrency must be used within a CurrencyProvider");
    }
    return context;
};

export const CurrencyProvider = ({ children }) => {
    // PKR is default
    const [currency, setCurrency] = useState(() => {
        return localStorage.getItem("site_currency") || "PKR";
    });

    const exchangeRate = 280; // 1 USD = 280 PKR

    useEffect(() => {
        localStorage.setItem("site_currency", currency);
    }, [currency]);

    const formatPrice = (pkrAmount) => {
        if (!pkrAmount && pkrAmount !== 0) return "—";

        if (currency === "USD") {
            const usdAmount = pkrAmount / exchangeRate;
            return `$${usdAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`;
        }

        // Default PKR
        return `Rs. ${Math.round(pkrAmount).toLocaleString()}`;
    };

    const convertPrice = (pkrAmount) => {
        if (currency === "USD") {
            return pkrAmount / exchangeRate;
        }
        return pkrAmount;
    };

    const value = {
        currency,
        setCurrency,
        formatPrice,
        convertPrice,
        exchangeRate
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};
