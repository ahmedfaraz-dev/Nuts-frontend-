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
    const supportedCurrencyCodes = [
        "USD", "PKR", "EUR", "GBP", "CAD", "AUD", "AED", "SAR", "CNY", "JPY", "INR", "SEK", "COP"
    ];
    const [currency, setCurrency] = useState(() => {
        const savedCurrency = localStorage.getItem("site_currency");
        return supportedCurrencyCodes.includes(savedCurrency) ? savedCurrency : "PKR";
    });
    
    const [exchangeRates, setExchangeRates] = useState({
        USD: 1, PKR: 280, EUR: 0.85, GBP: 0.73, CAD: 1.35, AUD: 1.5,
        AED: 3.67, SAR: 3.75, CNY: 7.2, JPY: 150, INR: 83, SEK: 10.5, COP: 4000
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Available currencies with country codes for exact flag images
    const availableCurrencies = {
        USD: { symbol: '$', name: 'US Dollar', country: 'us' },
        PKR: { symbol: 'Rs.', name: 'Pakistani Rupee', country: 'pk' },
        EUR: { symbol: '€', name: 'Euro', country: 'eu' },
        GBP: { symbol: '£', name: 'British Pound', country: 'gb' },
        CAD: { symbol: 'C$', name: 'Canadian Dollar', country: 'ca' },
        AUD: { symbol: 'A$', name: 'Australian Dollar', country: 'au' },
        AED: { symbol: 'د.إ', name: 'UAE Dirham', country: 'ae' },
        SAR: { symbol: '﷼', name: 'Saudi Riyal', country: 'sa' },
        CNY: { symbol: '¥', name: 'Chinese Yuan', country: 'cn' },
        JPY: { symbol: '¥', name: 'Japanese Yen', country: 'jp' },
        INR: { symbol: '₹', name: 'Indian Rupee', country: 'in' },
        SEK: { symbol: 'kr', name: 'Swedish Krona', country: 'se' },
        COP: { symbol: '$', name: 'Colombian Peso', country: 'co' }
    };

    // Fetch exchange rates from API
    const fetchExchangeRates = async () => {
        const fallbackRates = {
            USD: 1, PKR: 280, EUR: 0.85, GBP: 0.73, CAD: 1.35, AUD: 1.5,
            AED: 3.67, SAR: 3.75, CNY: 7.2, JPY: 150, INR: 83, SEK: 10.5, COP: 4000
        };

        try {
            setLoading(true);
            setError(null);
            
            // Check if we have cached rates (24 hours) - using v2 cache key to bypass old broken cache
            const cachedRates = localStorage.getItem('exchange_rates_v2');
            const cachedTime = localStorage.getItem('exchange_rates_time_v2');
            
            if (cachedRates && cachedTime) {
                const timeDiff = Date.now() - parseInt(cachedTime);
                const hoursDiff = timeDiff / (1000 * 60 * 60);
                
                if (hoursDiff < 24) {
                    setExchangeRates(JSON.parse(cachedRates));
                    setLastUpdated(new Date(parseInt(cachedTime)));
                    setLoading(false);
                    return;
                }
            }

            // Fetch fresh rates from ExchangeRate-API (open, free tier, no API key required)
            const response = await fetch('https://open.er-api.com/v6/latest/USD');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.rates && typeof data.rates === 'object') {
                // Ensure all supported currencies get their rates natively or from fallback
                const rates = { ...fallbackRates, ...data.rates, USD: 1 };
                
                setExchangeRates(rates);
                setLastUpdated(new Date());
                
                // Cache in localStorage
                localStorage.setItem('exchange_rates_v2', JSON.stringify(rates));
                localStorage.setItem('exchange_rates_time_v2', Date.now().toString());
            }
        } catch (err) {
            setError(err.message);
            // Fallback to basic rates if API fails (USD as base)
            setExchangeRates(fallbackRates);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExchangeRates();
    }, []);

    useEffect(() => {
        localStorage.setItem("site_currency", currency);
    }, [currency]);

    const formatPrice = (pkrAmount) => {
        if (!pkrAmount && pkrAmount !== 0) return "—";
        
        if (loading) {
            return "Loading...";
        }

        try {
            let convertedAmount;
            
            
            // Check if exchange rates are available
            if (!exchangeRates || Object.keys(exchangeRates).length === 0) {
                return `Rs. ${Math.round(pkrAmount).toLocaleString()}`;
            }
            
            if (currency === 'PKR') {
                // If target is PKR, no conversion needed
                convertedAmount = pkrAmount;
            } else {
                // Check if required rates exist
                if (!exchangeRates.PKR || !exchangeRates[currency]) {
                    return `Rs. ${Math.round(pkrAmount).toLocaleString()}`;
                }
                
                // Convert PKR to USD first, then to target currency
                const usdAmount = pkrAmount / exchangeRates.PKR; // PKR to USD
                convertedAmount = usdAmount * exchangeRates[currency]; // USD to target currency
                
                
                // Check if result is valid number
                if (isNaN(convertedAmount) || !isFinite(convertedAmount)) {
                    return `Rs. ${Math.round(pkrAmount).toLocaleString()}`;
                }
            }
            
            const currencyConfig = availableCurrencies[currency] || availableCurrencies.PKR;
            
            // Simple formatting for debugging
            let formatted;
            if (currency === 'PKR') {
                formatted = `${currencyConfig.symbol} ${Math.round(convertedAmount).toLocaleString()}`;
            } else {
                formatted = `${currencyConfig.symbol}${convertedAmount.toFixed(2)}`;
            }
            
            return formatted;
        } catch (err) {
            return `Rs. ${Math.round(pkrAmount).toLocaleString()}`;
        }
    };

    const convertPrice = (pkrAmount) => {
        if (loading) return pkrAmount;
        
        if (currency === 'PKR') {
            return pkrAmount;
        } else {
            // Convert PKR to USD first, then to target currency
            const usdAmount = pkrAmount / exchangeRates.PKR; // PKR to USD
            return usdAmount * exchangeRates[currency]; // USD to target currency
        }
    };

    const getExchangeRate = (fromCurrency, toCurrency) => {
        if (loading) return null;
        
        const fromRate = exchangeRates[fromCurrency] || 1;
        const toRate = exchangeRates[toCurrency] || 1;
        return toRate / fromRate;
    };

    const refreshRates = () => {
        localStorage.removeItem('exchange_rates');
        localStorage.removeItem('exchange_rates_time');
        fetchExchangeRates();
    };

    const value = {
        currency,
        setCurrency,
        formatPrice,
        convertPrice,
        getExchangeRate,
        exchangeRates,
        availableCurrencies,
        loading,
        error,
        lastUpdated,
        refreshRates
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};
