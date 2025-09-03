import React from 'react'
import ReferralHero from '../Components/ReferralHero'
import ReferralCircle from '../Components/ReferralCircle'
import ReferralForm from '../Components/ReferralForm'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'

const Referrals = () => {
  return (
    <>
      <Navbar />
      <ReferralHero />
      <ReferralCircle />
      <ReferralForm />
      <Footer/>
      {/* <div className="random"></div> */}
    </>
  )
}

export default Referrals