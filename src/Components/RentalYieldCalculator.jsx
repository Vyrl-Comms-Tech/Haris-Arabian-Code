import { useState, useEffect } from "react"

export default function RentalYieldCalculator({purchasePrice}) {
  const [propertyPrice, setPropertyPrice] = useState(purchasePrice)
  const [annualServiceCharges, setAnnualServiceCharges] = useState(40200)
  const [additionalCharges, setAdditionalCharges] = useState(7500)
  const [annualRentalPrice, setAnnualRentalPrice] = useState(150000)

  const [netRent, setNetRent] = useState(0)
  const [netROI, setNetROI] = useState(0)

  // Calculate net rent and ROI whenever inputs change
  useEffect(() => {
    const calculatedNetRent = annualRentalPrice - annualServiceCharges - additionalCharges
    const calculatedROI = propertyPrice > 0 ? (calculatedNetRent / propertyPrice) * 100 : 0

    setNetRent(Math.max(0, calculatedNetRent))
    setNetROI(Math.max(0, calculatedROI))
  }, [propertyPrice, annualServiceCharges, additionalCharges, annualRentalPrice])

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US").format(num)
  }

  const formatCurrency = (num) => {
    return `AED ${formatNumber(num)}`
  }

  return (
    <div className="mortgage-calculator">
      <div className="mortgage-calculator-container">
        {/* Property Price */}
        <div className="mortgage-calculator-input-group">
          <label className="mortgage-calculator-input-label">
            Property Price
          </label>
          <div className="mortgage-calculator-input-value">
            {formatNumber(propertyPrice)}
          </div>
          <div className="mortgage-calculator-slider-container">
            <input
              type="range"
              min="200000"
              max="50000000"
              step="10000"
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(Number(e.target.value))}
              className="mortgage-calculator-slider"
            />
          </div>
          <div className="mortgage-calculator-slider-range">
            <span>AED 200,000</span>
            <span>AED 50,000,000</span>
          </div>
        </div>

        {/* Annual Service Charges */}
        <div className="mortgage-calculator-input-group">
          <label className="mortgage-calculator-input-label">
            Annual Service Charges
          </label>
          <div className="mortgage-calculator-input-value">
            {formatNumber(annualServiceCharges)}
          </div>
          <div className="mortgage-calculator-slider-container">
            <input
              type="range"
              min="0"
              max="500000"
              step="1000"
              value={annualServiceCharges}
              onChange={(e) => setAnnualServiceCharges(Number(e.target.value))}
              className="mortgage-calculator-slider"
            />
          </div>
          <div className="mortgage-calculator-slider-range">
            <span>AED 0</span>
            <span>AED 500,000</span>
          </div>
        </div>

        {/* Additional Charges */}
        <div className="mortgage-calculator-input-group">
          <label className="mortgage-calculator-input-label">
            Additional Charges
          </label>
          <div className="mortgage-calculator-input-value">
            {formatNumber(additionalCharges)}
          </div>
          <div className="mortgage-calculator-slider-container">
            <input
              type="range"
              min="0"
              max="100000"
              step="500"
              value={additionalCharges}
              onChange={(e) => setAdditionalCharges(Number(e.target.value))}
              className="mortgage-calculator-slider"
            />
          </div>
          <div className="mortgage-calculator-slider-range">
            <span>AED 0</span>
            <span>AED 100,000</span>
          </div>
        </div>

        {/* Annual Rental Price */}
        <div className="mortgage-calculator-input-group">
          <label className="mortgage-calculator-input-label">
            Annual Rental Price
          </label>
          <div className="mortgage-calculator-input-value">
            {formatNumber(annualRentalPrice)}
          </div>
          <div className="mortgage-calculator-slider-container">
            <input
              type="range"
              min="0"
              max="5000000"
              step="5000"
              value={annualRentalPrice}
              onChange={(e) => setAnnualRentalPrice(Number(e.target.value))}
              className="mortgage-calculator-slider"
            />
          </div>
          <div className="mortgage-calculator-slider-range">
            <span>AED 0</span>
            <span>AED 5,000,000</span>
          </div>
        </div>

        {/* Results Section */}
        <div className="mortgage-calculator-result-section">
          <div className="mortgage-calculator-result-label">
            Net Rent
          </div>
          <div className="mortgage-calculator-result-value">
            {formatCurrency(netRent)}
          </div>
          
          <div className="mortgage-calculator-result-label" style={{ marginTop: '20px' }}>
            Net ROI
          </div>
          <div className="mortgage-calculator-result-value">
            {netROI.toFixed(2)}%
          </div>
          
          <div className="mortgage-calculator-result-description">
            Net ROI calculated based on {formatCurrency(propertyPrice)} property price 
            with annual rental income of {formatCurrency(annualRentalPrice)} minus service 
            charges and additional costs.
          </div>
          
          <div className="mortgage-calculator-button-group">
            <button className="mortgage-calculator-button mortgage-calculator-button-primary">
              Contact us
            </button>
            <button className="mortgage-calculator-button mortgage-calculator-button-secondary">
              Speak to our team
            </button>
          </div>
          
          <div style={{ 
            fontSize: '12px', 
            color: '#666', 
            marginTop: '15px', 
            fontStyle: 'italic' 
          }}>
            *Please note that net ROI is an average estimate and may vary depending on 
            property type, location, and applicable service charges.
          </div>
        </div>
      </div>
    </div>
  )
}