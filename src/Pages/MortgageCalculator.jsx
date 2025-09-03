import React from 'react'
import Navbar from '../Components/Navbar'

function MortgageCalculator() {
  return (
    <>
    <Navbar/>
    <div className="mortgageHolder">
        <div className="faq-left"></div>
        <div className="mort-right">
            <MortgageCalculator/>
        </div>
    </div>
    </>
  )
}

export default MortgageCalculator