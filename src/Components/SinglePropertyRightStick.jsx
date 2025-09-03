import React from "react";
import { usePropertyContext } from "../Context/PropertyContext";

function SinglePropertyRightStick() {
  const urlParams = new URLSearchParams(window.location.search);
  const propertyType = urlParams.get("type"); // 'Rent' or 'Sale'
  const isRental = propertyType?.toLowerCase() === "rent";
  const { singleProperty } = usePropertyContext();
  return (
    <div className="single-property-page-detail-right">
      <div className="single-property-page-detail-right-first">
        <div className="single-property-page-detail-right-head">
          <h3>{isRental ? "Rental Price" : "Sale Price"}</h3>
        </div>
        <div className="single-property-page-detail-right-price">
          <h1>
            {singleProperty?.general_listing_information?.currency_iso_code ||
              "AED"}
            :{" "}
            {singleProperty?.general_listing_information?.listingprice
              ? new Intl.NumberFormat("en-AE").format(
                  parseFloat(
                    singleProperty.general_listing_information.listingprice.replace(
                      /,/g,
                      ""
                    )
                  )
                )
              : "200,000"}
            {isRental ? " /year" : ""}
          </h1>
          <div className="single-property-page-detail-right-para">
            <p>
              Total Area:{" "}
              {singleProperty?.general_listing_information?.totalarea || "838"}{" "}
              sq.ft
            </p>
            <p>
              Bedrooms:{" "}
              {singleProperty?.general_listing_information?.bedrooms || "1"}
            </p>
            <p>
              Bathrooms:{" "}
              {singleProperty?.general_listing_information?.fullbathrooms ||
                "1"}
            </p>
          </div>
        </div>
      </div>

      <div className="single-property-page-detail-right-second">
        <div className="single-property-page-detail-right-second-agent-img">
          <img
            src="https://media.istockphoto.com/id/1255835530/photo/modern-custom-suburban-home-exterior.jpg?s=612x612&w=0&k=20&c=0Dqjm3NunXjZtWVpsUvNKg2A4rK2gMvJ-827nb4AMU4="
            alt="Agent"
          />
        </div>
        <div className="single-property-page-detail-right-second-agent-text">
          <h3>
            {`${singleProperty?.listing_agent?.listing_agent_firstname || ""} ${
              singleProperty?.listing_agent?.listing_agent_lastname || ""
            }`.trim() || "Real Estate Agent"}
          </h3>
          <p>Real Estate Consultant</p>
          <p>
            Phone:{" "}
            {singleProperty?.listing_agent?.listing_agent_mobil_phone || "N/A"}
          </p>
        </div>

        <div className="single-property-page-detail-right-second-agent-button">
          <p>Call your Agent</p>
          <span>🧏‍♀️</span>
        </div>
        <div className="single-property-page-detail-right-second-agent-whats">
         <img src="/Assets/whats.png" alt="" />
        </div>
        <div className="single-property-page-detail-right-second-agent-mess">
          <img src="/Assets/mess.png" alt="" />
        </div>
        <div className="single-property-page-detail-right-second-agent-share">
         <img src="/Assets/share.png" alt="" />
        </div>
      </div>

      <div className="single-property-page-detail-right-third">
        <div className="single-property-page-detail-right-third-left">
          <h2>Similar properties {isRental ? "rented" : "sold"} nearby</h2>
          <p>
            {singleProperty?.address_information?.city || "Dubai"},{" "}
            {singleProperty?.general_listing_information?.propertytype ||
              "Property"}
          </p>
        </div>
        <div className="single-property-page-detail-right-third-right">
          <img src="/qr.png" alt="QR Code" />
        </div>
      </div>
    </div>
  );
}

export default SinglePropertyRightStick;
