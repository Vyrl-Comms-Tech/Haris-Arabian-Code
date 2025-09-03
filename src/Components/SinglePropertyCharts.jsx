import React, { useContext, useEffect, useState } from "react";
import "../Styles/single-property-page.css";

import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { usePropertyContext } from "../Context/PropertyContext";
function SinglePropertyCharts() {
  const urlParams = new URLSearchParams(window.location.search);
  const propertyType = urlParams.get("type"); // 'Rent' or 'Sale'
  const isRental = propertyType?.toLowerCase() === "rent";
  const { singleProperty } = usePropertyContext();
  const [tooltip, setTooltip] = useState({
    show: false,
    x: 0,
    y: 0,
    content: "",
  });
  const [chartDimensions, setChartDimensions] = useState({
    width: 700,
    height: 300,
  });

  useEffect(() => {
    const updateDimensions = () => {
      const screenWidth = window.innerWidth;
      let width, height;

      if (screenWidth <= 480) {
        width = 280;
        height = 160;
      } else if (screenWidth <= 600) {
        width = 320;
        height = 180;
      } else if (screenWidth <= 768) {
        width = 350;
        height = 200;
      } else if (screenWidth <= 1024) {
        width = 380;
        height = 220;
      } else {
        width = 400;
        height = 240;
      }

      setChartDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const priceData = [
    { month: "February", price: 180, displayPrice: "180K" },
    { month: "March", price: 185, displayPrice: "185K" },
    { month: "April", price: 210, displayPrice: "210K" },
    { month: "May", price: 170, displayPrice: "170K" },
    { month: "June", price: 175, displayPrice: "175K" },
    { month: "July", price: 190, displayPrice: "190K" },
  ];

  const volumeData = [
    { month: "February", volume: 2 },
    { month: "March", volume: 2 },
    { month: "April", volume: 4 },
    { month: "May", volume: 4 },
    { month: "June", volume: 2 },
    { month: "July", volume: 1 },
  ];

  const priceChartWidth = chartDimensions.width;
  const priceChartHeight = chartDimensions.height - 10;
  const priceMaxY = 250;
  const priceMinY = 100;
  const priceRange = priceMaxY - priceMinY;

  const getPriceX = (index) =>
    index * (priceChartWidth / (priceData.length - 1));
  const getPriceY = (price) =>
    priceChartHeight - ((price - priceMinY) / priceRange) * priceChartHeight;

  const pricePathData = priceData
    .map((point, index) => {
      const x = getPriceX(index);
      const y = getPriceY(point.price);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const priceYLabels = [
    "400K",
    "350K",
    "300K",
    "250K",
    "200K",
    "150K",
    "100K",
    "50K",
    "0K",
  ];

  const volumeYLabels = ["5", "4", "3", "2", "1", "0"];

  const handleMouseEnter = (event, content) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      show: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      content,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, x: 0, y: 0, content: "" });
  };
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">
          {singleProperty?.general_listing_information?.bedrooms || "2"} bedroom{" "}
          {singleProperty?.general_listing_information?.propertytype?.toLowerCase() ||
            "property"}{" "}
          {isRental ? "rental" : "price"} trend in{" "}
          {singleProperty?.address_information?.city || "Dubai"}
        </h2>
        <p className="dashboard-subtitle">
          {isRental ? "Rental rates" : "Prices"} have gone up by 15.15% (MOM)
        </p>
      </div>

      <div className="charts-container">
        {/* Price Trend Chart */}
        <div className="chart-section">
          <h3 className="chart-title">
            {isRental ? "Rental Rate" : "Price"} Trend
          </h3>
          <div className="chart-wrapper">
            <div className="price-chart-container">
              {/* Background Grid */}
              <div className="price-grid"></div>

              {/* Y-axis Labels */}
              <div className="price-y-axis">
                {priceYLabels.map((label, index) => (
                  <div key={index} className="price-y-label">
                    {label}
                  </div>
                ))}
              </div>

              {/* Recharts LineChart */}
              <div className="price-chart-area">
                <LineChart
                  width={priceChartWidth}
                  height={priceChartHeight}
                  data={priceData}
                >
                  <CartesianGrid stroke="#e2e8f0" />
                  <Line
                    dataKey="price"
                    stroke="#2b6cb0"
                    strokeWidth={2.5}
                    dot={{
                      fill: "#2b6cb0",
                      stroke: "#ffffff",
                      strokeWidth: 2,
                      r: 4,
                    }}
                  />
                  <XAxis dataKey="month" hide />
                  <YAxis domain={[100, 250]} hide />
                </LineChart>
              </div>
            </div>

            {/* X-axis Labels */}
            <div className="price-x-axis">
              {priceData.map((point, index) => (
                <span key={index} className="price-x-label">
                  {point.month}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* VS Circle */}
        <div className="vs-circle">
          <span className="vs-text">VS</span>
        </div>

        {/* Volume Chart */}
        <div className="chart-section">
          <h3 className="chart-title">Unit Volume</h3>
          <div className="chart-wrapper">
            <div className="volume-chart-container">
              {/* Y-axis Labels */}
              <div className="volume-y-axis">
                {volumeYLabels.map((label, index) => (
                  <div key={index} className="volume-y-label">
                    {label}
                  </div>
                ))}
              </div>
              {/* Background Grid */}
              <div className="volume-grid"></div>

              {/* Volume Bars */}
              <div className="volume-bars-area">
                {volumeData.map((point, index) => (
                  <div key={index} className="volume-bar-wrapper">
                    <div
                      className="volume-bar"
                      style={{
                        height: `${(point.volume / 5) * 100}%`,
                      }}
                      onMouseEnter={(e) =>
                        handleMouseEnter(
                          e,
                          `${point.month}: ${point.volume} units`
                        )
                      }
                      onMouseLeave={handleMouseLeave}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* X-axis Labels */}
            <div className="volume-x-axis">
              {volumeData.map((point, index) => (
                <span key={index} className="volume-x-label">
                  {point.month}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.show && (
        <div
          className="chart-tooltip"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translateX(-50%)",
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}

export default SinglePropertyCharts;
