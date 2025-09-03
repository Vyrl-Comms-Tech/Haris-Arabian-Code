import React from 'react'
import Hero from '../Components/Hero'
import PropertySlider from '../Components/ProjectsSlider'
import HeroOffplanProperty from '../Components/HeroOffplanProperty'
import ReferProperty from '../Components/ReferProperty'
import Footer from '../Components/Footer'
import TeamSection from '../Components/TeamSection'
import ExpandableSlider from '../Components/ExpandableSlider'
import TrustedPartner from '../Components/TrustedPartner'

function Home() {
  return (
    <>
    <Hero/>
    <TrustedPartner/>
    <PropertySlider/>
    {/* <ReferProperty/> */}
    <HeroOffplanProperty/>
    <TeamSection/>
    <ExpandableSlider/>
    <Footer/>
    </>
  )
}

export default Home