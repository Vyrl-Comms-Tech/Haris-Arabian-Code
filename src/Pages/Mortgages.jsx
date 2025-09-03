import React from 'react'
import MortgagesPage from '../Components/MortgagePage'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import MortgagesPageInsight from "../Components/MortgagesPageInsight"


const Mortgages = () => {
    return (
        <>
            <Navbar />
            <MortgagesPage />
            <MortgagesPageInsight/>
            <Footer/>

        </>
    )
}

export default Mortgages