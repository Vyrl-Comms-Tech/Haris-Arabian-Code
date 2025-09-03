import React from 'react'
import Navbar from '../Components/Navbar'
import AboutHero from '../Components/AboutHero'
import AboutBelow from '../Components/AboutBelow'
import AboutPeople from '../Components/AboutPeople'
// import AboutAwards from '../Components/AboutAwards'
import AboutZoom from '../Components/AboutZoom'
import AboutAwardsTwo from '../Components/AboutAwardsTwo'
import Footer from '../Components/Footer'
import AboutClientReviews from '../Components/AboutClientReviews'
import AboutKnowMore from '../Components/AboutKnowMore'

const AboutUs = () => {
  return (
  <>
  <Navbar/>
  <AboutHero/>
  <AboutBelow/>
  <AboutPeople/>
  {/* <AboutAwards/> */}
  <AboutAwardsTwo/>
  <AboutZoom/>
  <AboutClientReviews/>
  <AboutKnowMore/>
  <Footer/>
  {/* <div className="random"></div> */}
  </>
  )
}

export default AboutUs