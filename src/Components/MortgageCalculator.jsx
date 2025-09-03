import React from "react";

function MortgageCalculator({
  formatNumber,
  formatCurrency,
  monthlyPayment,
  setLoanTerm,
  loanTerm,
  setInterestRate,
  interestRate,
  setDownPayment,
  downPayment,
  setPurchasePrice,
  purchasePrice,
  currency,
  isVisible,
}) {
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
      {/* <h1 className="mortgage-calculator-title">
        Calculate your mortgage repayments
      </h1> */}
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
            <button className="mortgage-calculator-button mortgage-calculator-button-primary">
              Start Mortgage Approval
            </button>
            <button className="mortgage-calculator-button mortgage-calculator-button-secondary" id="bordered-btn">
              Speak to our team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MortgageCalculator;