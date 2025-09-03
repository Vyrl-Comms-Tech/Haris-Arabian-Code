import React, { useState } from 'react';
import ReferTrackHero from '../Components/RefralTrackhero';
import TrackingDetails from '../Components/TrackingDetails';
import Footer from '../Components/Footer'

function ReferTrack() {
  const [searchResult, setSearchResult] = useState(null);

  const handleSearchResult = (result) => {
    setSearchResult(result);
  };

  return (
    <>
      <ReferTrackHero onSearchResult={handleSearchResult} />
      <TrackingDetails searchResult={searchResult} />
      <Footer/>
      
    </>
  );
}

export default ReferTrack;