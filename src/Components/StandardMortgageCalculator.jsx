import React, { useState, useEffect } from "react";


function StandardMortgageCalculator() {
  // Hardcoded default values - can be changed via sliders
  const [purchasePrice, setPurchasePrice] = useState(2500000); // AED 2.5M default
  const [downPayment, setDownPayment] = useState(500000); // AED 500K default (20%)
  const [interestRate, setInterestRate] = useState(4.8); // 4.8% default
  const [loanTerm, setLoanTerm] = useState(25); // 25 years default
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  // Format currency function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format number function
  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-AE").format(num);
  };

  // Calculate monthly payment
  useEffect(() => {
    const principal = purchasePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    if (monthlyRate === 0) {
      setMonthlyPayment(principal / numberOfPayments);
    } else {
      const monthlyPaymentCalc =
        (principal *
          monthlyRate *
          Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      setMonthlyPayment(monthlyPaymentCalc);
    }
  }, [purchasePrice, downPayment, interestRate, loanTerm]);

  // Handler for purchase price changes
  const handlePurchasePriceChange = (e) => {
    const newPrice = Number(e.target.value);
    setPurchasePrice(newPrice);
    
    // Automatically set down payment based on property price
    // 30% for properties above 5 million, 20% for properties below
    const downPaymentRate = newPrice > 5000000 ? 0.3 : 0.2;
    const newDownPayment = Math.floor(newPrice * downPaymentRate);
    setDownPayment(newDownPayment);
  };

  // Handler for down payment changes
  const handleDownPaymentChange = (e) => {
    const newDownPayment = Number(e.target.value);
    // Ensure down payment doesn't exceed 90% of purchase price
    const maxDownPayment = Math.floor(purchasePrice * 0.9);
    const validDownPayment = Math.min(newDownPayment, maxDownPayment);
    setDownPayment(validDownPayment);
  };

  // Calculate dynamic max down payment (90% of purchase price)
  const maxDownPayment = Math.floor(purchasePrice * 0.9);
  
  // Calculate current down payment percentage
  const downPaymentPercentage = purchasePrice > 0 ? Math.round((downPayment / purchasePrice) * 100) : 0;

  return (
    <div className="mortgage-calculator">
      <h1 className="mortgage-calculator-title">
        Calculate your mortgage repayments
      </h1>
      <div className="mortgage-calculator-container">
        <div className="mortgage-calculator-input-group">
          <label className="mortgage-calculator-input-label">
            Property Price
          </label>
          <div className="mortgage-calculator-input-value">
            {formatNumber(purchasePrice)}
          </div>
          <div className="mortgage-calculator-slider-container">
            <input
              type="range"
              min="200000"
              max="35000000"
              step="1000"
              value={purchasePrice}
              onChange={handlePurchasePriceChange}
              className="mortgage-calculator-slider"
            />
          </div>
          <div className="mortgage-calculator-slider-range">
            <span>AED 200,000</span>
            <span>AED 35,000,000</span>
          </div>
        </div>

        <div className="mortgage-calculator-input-group">
          <label className="mortgage-calculator-input-label">
            Down Payment ({downPaymentPercentage}%)
          </label>
          <div className="mortgage-calculator-input-value">
            {formatNumber(downPayment)}
          </div>
          <div className="mortgage-calculator-slider-container">
            <input
              type="range"
              min="40000"
              max={maxDownPayment}
              step="1000"
              value={Math.min(downPayment, maxDownPayment)}
              onChange={handleDownPaymentChange}
              className="mortgage-calculator-slider"
            />
          </div>
          <div className="mortgage-calculator-slider-range">
            <span>AED 40,000</span>
            <span>AED {formatNumber(maxDownPayment)}</span>
          </div>
          {downPayment >= maxDownPayment && (
            <div className="mortgage-calculator-warning" style={{ 
              color: '#ff6b6b', 
              fontSize: '12px', 
              marginTop: '5px' 
            }}>
              Maximum down payment: 90% of property price
            </div>
          )}
        </div>

        <div className="mortgage-calculator-input-group">
          <label className="mortgage-calculator-input-label">
            Interest Rate (%)
          </label>
          <div className="mortgage-calculator-input-value">{interestRate}%</div>
          <div className="mortgage-calculator-slider-container">
            <input
              type="range"
              min="1"
              max="20"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="mortgage-calculator-slider"
            />
          </div>
          <div className="mortgage-calculator-slider-range">
            <span>1%</span>
            <span>20%</span>
          </div>
        </div>

        <div className="mortgage-calculator-input-group">
          <label className="mortgage-calculator-input-label">
            Loan Term (Years)
          </label>
          <div className="mortgage-calculator-input-value">
            {loanTerm} years
          </div>
          <div className="mortgage-calculator-slider-container">
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="mortgage-calculator-slider"
            />
          </div>
          <div className="mortgage-calculator-slider-range">
            <span>5 years</span>
            <span>30 years</span>
          </div>
        </div>

        <div className="mortgage-calculator-result-section">
          <div className="mortgage-calculator-result-label">
            Monthly repayment
          </div>
          <div className="mortgage-calculator-result-value">
            {formatCurrency(monthlyPayment)}
          </div>
          <div className="mortgage-calculator-result-description">
            Estimated initial monthly payments based on a{" "}
            {formatCurrency(purchasePrice)} purchase price with a {interestRate}
            % fixed interest rate over {loanTerm} years
          </div>
          <div className="mortgage-calculator-button-group">
            <button className="mortgage-calculator-button mortgage-calculator-button-secondary">
                Get pre-approved
            </button>
            <button className="mortgage-calculator-button mortgage-calculator-button-primary">
              Speak to our team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StandardMortgageCalculator;