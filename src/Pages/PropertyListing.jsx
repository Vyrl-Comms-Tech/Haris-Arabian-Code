import React, { useState, useEffect } from "react";
import "../Styles/PropertyListing.css";
import Navbar from "../Components/Navbar";
import HeadFilterBar from "../Components/HeadFilterBar";
import PropertyCard from "../Components/PropertyCard";
import { useLocation } from "react-router-dom";
import axios from "axios";

function PropertyListing() {

  return (
    <>
      <div className="PropertyListing">
        <Navbar />
        <HeadFilterBar />
        <PropertyCard />
      </div>
    </>
  );
}

export default PropertyListing;
