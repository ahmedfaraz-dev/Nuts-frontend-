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
    const [currency, setCurrency] = useState(() => {
        return localStorage.getItem("site_currency") || "PKR";
    });
    
    const [exchangeRates, setExchangeRates] = useState({
        USD: 1,
        PKR: 280,
        EUR: 0.85,
        GBP: 0.73,
        AED: 3.67,
        SAR: 3.75
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Available currencies
    const availableCurrencies = {
        PKR: { symbol: 'Rs.', name: 'Pakistani Rupee' },
        USD: { symbol: '$', name: 'US Dollar' },
        EUR: { symbol: '€', name: 'Euro' },
        GBP: { symbol: '£', name: 'British Pound' },
        AED: { symbol: 'د.إ', name: 'UAE Dirham' },
        SAR: { symbol: '﷼', name: 'Saudi Riyal' }
    };

    // Fetch exchange rates from API
    const fetchExchangeRates = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Check if we have cached rates (24 hours)
            const cachedRates = localStorage.getItem('exchange_rates');
            const cachedTime = localStorage.getItem('exchange_rates_time');
            
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

            // Fetch fresh rates from Exchangerate.host (free API)
            const response = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=PKR,EUR,GBP,AED,SAR');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            console.log('API Response:', data);
            
            if (data.rates && typeof data.rates === 'object') {
                // Add USD as 1:1 with itself and include all rates
                const rates = {
                    USD: 1,
                    PKR: data.rates.PKR || 280, // Fallback if missing
                    EUR: data.rates.EUR || 0.85,
                    GBP: data.rates.GBP || 0.73,
                    AED: data.rates.AED || 3.67,
                    SAR: data.rates.SAR || 3.75
                };
                
                console.log('Final Rates:', rates);
                setExchangeRates(rates);
                setLastUpdated(new Date());
                
                // Cache in localStorage
                localStorage.setItem('exchange_rates', JSON.stringify(rates));
                localStorage.setItem('exchange_rates_time', Date.now().toString());
            }
        } catch (err) {
            console.error('Error fetching exchange rates:', err);
            setError(err.message);
            
            // Fallback to basic rates if API fails (USD as base)
            const fallbackRates = {
                USD: 1,
                PKR: 280,
                EUR: 0.85,
                GBP: 0.73,
                AED: 3.67,
                SAR: 3.75
            };
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
            
            console.log('Currency Debug:', {
                pkrAmount,
                currency,
                exchangeRates,
                loading
            });
            
            // Check if exchange rates are available
            if (!exchangeRates || Object.keys(exchangeRates).length === 0) {
                console.log('Exchange rates not loaded yet, using fallback');
                return `Rs. ${Math.round(pkrAmount).toLocaleString()}`;
            }
            
            if (currency === 'PKR') {
                // If target is PKR, no conversion needed
                convertedAmount = pkrAmount;
            } else {
                // Check if required rates exist
                if (!exchangeRates.PKR || !exchangeRates[currency]) {
                    console.error('Missing exchange rates:', { PKR: exchangeRates.PKR, [currency]: exchangeRates[currency] });
                    return `Rs. ${Math.round(pkrAmount).toLocaleString()}`;
                }
                
                // Convert PKR to USD first, then to target currency
                const usdAmount = pkrAmount / exchangeRates.PKR; // PKR to USD
                convertedAmount = usdAmount * exchangeRates[currency]; // USD to target currency
                
                console.log('Conversion Debug:', {
                    pkrAmount,
                    usdAmount,
                    targetRate: exchangeRates[currency],
                    convertedAmount
                });
                
                // Check if result is valid number
                if (isNaN(convertedAmount) || !isFinite(convertedAmount)) {
                    console.error('Invalid conversion result:', convertedAmount);
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
            
            console.log('Final formatted price:', formatted);
            return formatted;
        } catch (err) {
            console.error('Error formatting price:', err);
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
