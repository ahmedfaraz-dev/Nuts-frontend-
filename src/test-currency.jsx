import React, { useState } from 'react';
import { useCurrency } from './contexts/CurrencyContext';

const TestCurrency = () => {
    const { formatPrice, currency, setCurrency, availableCurrencies, exchangeRates, loading } = useCurrency();
    const [testPrice] = useState(788); // Sample PKR price

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h2>Currency Conversion Test</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <h3>Current Exchange Rates:</h3>
                <pre>{JSON.stringify(exchangeRates, null, 2)}</pre>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3>Select Currency:</h3>
                {Object.entries(availableCurrencies).map(([code, info]) => (
                    <button
                        key={code}
                        onClick={() => setCurrency(code)}
                        style={{
                            margin: '5px',
                            padding: '10px',
                            backgroundColor: currency === code ? '#F59115' : '#f0f0f0',
                            color: currency === code ? 'white' : 'black',
                            border: 'none',
                            borderRadius: '5px'
                        }}
                    >
                        {info.symbol} {code}
                    </button>
                ))}
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3>Test Results:</h3>
                <p><strong>Original PKR Price:</strong> Rs. {testPrice}</p>
                <p><strong>Selected Currency:</strong> {currency}</p>
                <p><strong>Converted Price:</strong> {formatPrice(testPrice)}</p>
                {loading && <p>Loading rates...</p>}
            </div>

            <div>
                <h3>Expected Results:</h3>
                <p>788 PKR should be approximately:</p>
                <ul>
                    <li>USD: $2.81 (788 ÷ 280)</li>
                    <li>EUR: €2.39 (788 ÷ 280 × 0.85)</li>
                    <li>GBP: £2.05 (788 ÷ 280 × 0.73)</li>
                </ul>
            </div>
        </div>
    );
};

export default TestCurrency;
