import React from 'react'
import "../Styles/mortgages-page.css"
import StandardMortgageCalculator from './StandardMortgageCalculator'
import FAQ from './FAQ'

const MortgagePage = () => {
  // Define your FAQ data for mortgages
  const mortgageFAQs = [
    {
      question: "What is a mortgage?",
      answer: "A mortgage is a loan used to purchase real estate, where the property serves as collateral. The borrower makes monthly payments over a specified period, typically 15-30 years, until the loan is fully paid off."
    },
    {
      question: "How much can I borrow for a mortgage?",
      answer: "The amount you can borrow depends on several factors including your income, credit score, debt-to-income ratio, and the property value. Most lenders offer up to 80% of the property value in the UAE, though this can vary based on your profile."
    },
    {
      question: "What documents do I need for a mortgage application?",
      answer: "Typically, you'll need Emirates ID, passport with residence visa, salary certificates, bank statements for the last 6 months, No Objection Certificate (NOC) from your employer, and property documents if you're purchasing."
    },
    {
      question: "How long does the mortgage approval process take?",
      answer: "The mortgage approval process in the UAE typically takes 2-4 weeks, depending on the bank and completeness of your documentation. Pre-approval can be obtained faster, often within a few days."
    },
    {
      question: "What are the current mortgage rates in the UAE?",
      answer: "Mortgage rates in the UAE vary by bank and loan type, typically ranging from 3.5% to 6% per annum. Rates can be fixed or variable, and may depend on your relationship with the bank and loan amount."
    },
    {
      question: "Can expatriates get mortgages in the UAE?",
      answer: "Yes, expatriates can obtain mortgages in the UAE. However, requirements may be stricter, including minimum salary requirements, longer employment history, and potentially higher down payment requirements."
    }
  ];

  return (
    <>
      <div className="mortgages-page">
        <h3>Home / <span>Mortgages</span></h3>
        <div className="mortgages-page-content">
          <div className="mortgages-page-content-left">
            <h1>Helping you find the right mortgage</h1>
            <p>Your home-buying journey should be smooth and stress-free. Speak to our in-house mortgage team today and let them find you the best available rates in the UAE.</p>
            <h3>Frequently Asked Questions</h3>
            {/* Add FAQ component with mortgage variant */}
            <FAQ faqData={mortgageFAQs} variant="mortgage" />
          </div>
          <div className="mortgages-page-content-right">
            <StandardMortgageCalculator/>
          </div>
        </div>
      </div>
    </>
  )
}

export default MortgagePage