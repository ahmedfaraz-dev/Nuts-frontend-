// Manual currency conversion test
const testRates = {
    USD: 1,
    PKR: 280,
    EUR: 0.85,
    GBP: 0.73,
    AED: 3.67,
    SAR: 3.75
};

function testConversion(pkrAmount, targetCurrency) {
    if (targetCurrency === 'PKR') {
        return pkrAmount;
    } else {
        const usdAmount = pkrAmount / testRates.PKR; // PKR to USD
        return usdAmount * testRates[targetCurrency]; // USD to target
    }
}

console.log('Testing currency conversion:');
console.log('788 PKR to USD:', testConversion(788, 'USD'));
console.log('788 PKR to EUR:', testConversion(788, 'EUR'));
console.log('788 PKR to GBP:', testConversion(788, 'GBP'));

// Expected: 788 PKR should be ~2.81 USD (788/280)
// Expected: 788 PKR should be ~2.39 EUR (788/280*0.85)
