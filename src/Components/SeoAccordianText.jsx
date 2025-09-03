import React from "react";
import { useLocation } from "react-router-dom";
import "../Styles/SeoAccordianText.css";

function SeoAccordianText({
  isAccordionOpen,
  toggleAccordion,
  type,
  currentFilters,
}) {
  console.log("Type", type);
  const location = useLocation();

  // Get query parameters from URL
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      propertyType: params.get("propertyType"),
      location: params.get("location"),
      bedrooms: params.get("bedrooms"),
    };
  };

  const queryParams = getQueryParams();
  console.log("PT", queryParams);

  // Get SEO content based on property type and URL parameters
  const getSeoContent = () => {
    const propertyTypeText =
      type === "/sale"
        ? "for Sale"
        : type === "/rent"
        ? "for Rent"
        : type === "/offplan"
        ? "OffPlan"
        : "";

    const locationText =
      currentFilters.address || queryParams.location || "Dubai";

    // Sale
    if (type === "/sale" && queryParams.propertyType === "apartment") {
      return {
        title: `Apartments for Sale in ${locationText}`,
        content: `
        <h1>Apartments for Sale in ${locationText}</h1>
        <h2>Where Urban Living Meets Investment Potential</h2>
          <h2>Buy Apartments in Dubai with Arabian Estates</h2>
          <p>Searching for contemporary apartments in Dubai that combine lifestyle, comfort, and long-term value? From calm beachfront apartments in Dubai Marina and Palm Jumeirah to high-rise homes in Downtown, Arabian Estates offers you a carefully chosen selection of Dubai apartments for sale. Whether you want to expand your real estate holdings or purchase apartments in Dubai for personal use, we offer customised choices with complete transparency and expert advice at every turn.</p>

          <h3>Explore Dubai's Most Desirable Apartment Listings</h3>
          <p>Dubai offers one of the most exciting apartment markets in the world, attracting residents, investors, and international buyers with its tax-free advantages, high ROI, and freehold zones.</p>
          
          <h4>Our collection of flats for sale in Dubai includes:</h4>
          <ul>
            <li>Studio to 5-bedroom apartments in ready and off-plan developments</li>
            <li>Furnished & unfurnished options for end-users or rental income</li>
            <li>Units with Burj Khalifa, sea, or golf course views</li>
            <li>Apartments with private balconies, smart home systems, and world-class amenities</li>
          </ul>

          <h3>Where to Buy Apartments in Dubai</h3>
          <p>The choice of location can define both your lifestyle and your investment return. At Arabian Estates, we help you buy apartments in Dubai in areas that match your goals.</p>
          
          <h4>Top Areas for Apartment Buyers</h4>
          <ul>
            <li><strong>Downtown Dubai</strong> – Ultra-modern city living with landmark views</li>
            <li><strong>Dubai Marina</strong> – High-rental demand and waterfront lifestyle</li>
            <li><strong>Business Bay</strong> – Central, connected, and perfect for professionals</li>
            <li><strong>Jumeirah Village Circle (JVC)</strong> – Affordable, family-friendly, and high-yield</li>
            <li><strong>Dubai Creek Harbour</strong> – New urban hub with long-term growth</li>
          </ul>

          <h3>Apartment Types & Sizes to Suit Every Lifestyle</h3>
          <p>At Arabian Estates Real Estate Company UAE, we understand that every buyer has unique space requirements. Whether you're a solo professional, a growing family, or an investor seeking high-demand rental units, we offer a wide range of apartments for sale in Dubai to match your needs.</p>

          <h4>Studio Apartment</h4>
          <p>Dubai's studio apartments are compact yet practical for young professionals, students, or investors seeking readily available rental accommodations. Area space typically ranging from 400 to 800 square feet. <strong>Top Locations:</strong> JVC, Business Bay, and Dubai South. Ideal for short-term rentals and affordable city living.</p>

          <h4>One-Bedroom Apartment</h4>
          <p>These apartments are suitable for singles or couples, as they offer more space and solitude without compromising on location or amenities. The area typically ranges in size from 600 to 1,200 square feet. <strong>Notable sites:</strong> Dubai Marina, Downtown Dubai, and Creek Harbour. The benefit of investment is the strong demand for rentals among working professionals.</p>

          <h4>Two Bedroom Apartments</h4>
          <p>This property strikes the perfect balance of space, comfort, and affordability, making it a popular choice for small families and long-term renters. Area space typically ranges from 1,000 to 1,500 square feet in the various units. <strong>Notable communities:</strong> Town Square, JVC, and Dubai Hills Estate. Value proposes that it is ideal for investors seeking rental yields, as well as end consumers.</p>

          <h4>3-Bedroom & 4-Bedroom Apartments</h4>
          <p>These spacious homes, designed for larger families or those seeking luxury, offer first-rate layouts, multiple en-suite bathrooms, and expansive views— typical area: 1,600 to more than 3,000 square feet. <strong>Prime locations:</strong> Downtown Dubai, Palm Jumeirah, and Bluewaters Island. Several balconies, high-end finishing, and a maid's room are common examples of a luxury touch.</p>

          <h3>Why Buy Apartments in Dubai Through Arabian Estates?</h3>
          <p>As leading property consultants in Dubai, we don't just list — we advise, negotiate, and ensure you're positioned for long-term success.</p>
          
          <h2>Here's what you get with Arabian Estates:</h2>
          <ul>
            <li>Availability of authenticated listings with clear title deeds</li>
            <li>Professional guidance on market trends, rental yields, and ROI</li>
            <li>Advice regarding ownership laws, mortgage eligibility, and DLD fees</li>
            <li>Support following the sale, such as leasing, property management, and resale</li>
          </ul>

          <p>Whether you're a novice buyer or an experienced investor, we provide you with the clarity and confidence you need when searching for apartments for sale in Dubai.</p>

          <h1>Your Apartment Adventure Begins Here</h1>
          <p>From sophisticated city apartments to resort-style homes, our goal is to help you find apartments in Dubai that enhance your quality of life or increase your wealth. Thanks to Dubai's stable foundation and vibrant skyline, there has never been a better time to invest in real estate.</p>

          <h2>Speak with an Expert in Dubai Apartments Now </h2>
          <p>Start a conversation with our expert property brokers in Dubai to assist you in locating the ideal flats and apartments, whether your intention is to reside there, lease the property, or utilize it as collateral for an investment.</p>

          <button>Contact Our Team</button>
        `,
      };
    }
    // Add more specific content for other property types
    if (type === "/sale" && queryParams.propertyType === "villa") {
      return {
        title: `Buy Villas in ${locationText}`,
        content: `
          <h1>Buy Villas in ${locationText}</h1>
          
          <h2>Modern Villas for Sale Dubai</h2>
          <p>Dubai's villa market offers more than just square footage — it promises privacy, community living, and long-term value. At Arabian Estates, we specialize in helping clients find exclusive villas for sale in Dubai, whether you're looking to upgrade your lifestyle, expand your family, or invest in prime freehold property. From waterfront mansions to gated community homes, our portfolio includes some of the finest villas for sale UAE buyers can find — tailored to meet your space, design, and return-on-investment expectations.</p>

          <h2>Explore the Best Villas for Sale UAE</h2>
          <p>Whether you're seeking a villa to buy in Dubai for personal use or to generate rental income, we provide a diverse selection of homes across the city's top-performing neighborhoods.</p>
          <h3>Types of Villas Available</h3>
          <ul>
            <li>Independent Villas with private gardens and pools</li>
            <li>Townhouse-style Villas for affordable family living</li>
            <li>Luxury Mansions in signature addresses like Palm Jumeirah and Emirates Hills</li>
            <li>Smart Villas with automation and modern architecture</li>
          </ul>

          <h2>Top Communities to Buy Villas in Dubai</h2>
          <p>Location is key when choosing the right villa for sale in Dubai. We help you evaluate communities based on lifestyle needs, school access, transport, amenities, and potential appreciation.</p>
          
          <h3>Premium Villa Neighborhoods</h3>
          
          <h3>Dubai Hills Estate</h3>
          <p>Family-friendly, golf course views</p>
          
          <h3>Palm Jumeirah</h3>
          <p>Exclusive beachfront living</p>
          
          <h3>Arabian Ranches</h3>
          <p>Spacious layouts, quiet ambiance</p>
          
          <h3>Jumeirah Golf Estates</h3>
          <p>Perfect for luxury buyers & golf lovers</p>
          
          <h3>Tilal Al Ghaf</h3>
          <p>New-age villas with a resort-style feel</p>
          
          <h3>Meydan</h3>
          <p>High ROI with new infrastructure</p>

          <h2>Villa Sizes & Features</h2>
          <p>Our listings include 3 to 7+ bedroom villas, with built-up areas ranging from 2,500 sq. ft. to over 15,000 sq. ft., often featuring:</p>
          <ul>
            <li>Private pools & landscaped gardens</li>
            <li>Maid's & driver's rooms</li>
            <li>Ensuite bedrooms & walk-in wardrobes</li>
            <li>Closed kitchens with premium finishes</li>
            <li>Two to four covered parking bays</li>
            <li>Smart security and home automation</li>
          </ul>
          
          <p>Looking for something move-in ready or under construction? Our agents can help you shortlist the right villas for sale in Dubai that suit your timeline and financing options.</p>

          <h2>Why Buy Villas in Dubai with Arabian Estates?</h2>
          <p>When you're making a long-term investment in a villa for sale UAE, you need more than just listings — you need advisors. At Arabian Estates, we deliver:</p>
          <ul>
            <li>Access to verified, title-deed ready villas</li>
            <li>On-ground knowledge of villa market trends</li>
            <li>Expertise in mortgage approvals, DLD fees, and ownership rules</li>
            <li>Direct connections with developers & off-market sellers</li>
            <li>Golden Visa advisory for qualifying purchases</li>
          </ul>
          
          <p>Whether you're searching for a forever home or an income-generating asset, we simplify every step of the process.</p>

          <h2>Grab the Chance to Invest in Villas For Sale Today</h2>
          <p>Are you prepared to invest in a luxury property in Dubai for the future? Every step of the process, from viewings to negotiations and the final transfer, Arabian Estates is here to support you with integrity, knowledge, and wisdom.</p>

          <button>Talk To A Specialist</button>
        `,
      };
    }
    if (type === "/sale" && queryParams.propertyType === "townhouse") {
      return {
        title: `Buy Townhouses in ${locationText}`,
        content: `
          <h1>Buy Townhouses in ${locationText}</h1>
          <h2>Smart Living with Spacious Design</h2>

          <h2>Explore Townhouses For Sale in UAE</h2>
          <p>Looking for a home that offers the perfect blend between seclusion and community living? At Arabian Estates, a premium real estate company, we showcase a carefully curated range of townhouses for sale in Dubai that incorporate modern architecture, open-plan layouts, and family-friendly surroundings. Townhouses for sale in UAE are becoming a popular option for expanding families and investors looking for high-demand, practical real estate solutions because of their spacious interiors, private gardens, and access to first-rate facilities.</p>

          <h2>Find Dubai Townhouses for Sale</h2>
          <p>Our extensive portfolio includes off-plan and ready-to-move-in townhouses in the finest freehold neighbourhoods of Dubai. These homes offer flexible, low-maintenance living, whether you're downsizing from a villa or upgrading from an apartment.</p>
          
          <h3>What to Expect</h3>
          <ul>
            <li>2 to 5-bedroom townhouses</li>
            <li>Private terraces, gardens, and covered parking</li>
            <li>Community parks, pools, and security</li>
            <li>Low service charges compared to villas</li>
            <li>Freehold ownership and DLD registration support</li>
          </ul>

          <h2>Top Locations in Dubai for Townhouse Purchases</h2>
          <p>Well-planned communities that provide a suburban feel with convenient access to the city's main commercial and recreational centres have contributed to the rise in demand for townhouses for sale in Dubai.</p>

          <h3>Popular Communities for Buyers of Townhouses</h3>
          <p><strong>Arabian Ranches & Arabian Ranches 3:</strong> Modern design meets classic charm.</p>
          <p><strong>Dubai Hills Estate:</strong> Parks, golf vistas, and contemporary designs</p>
          <p><strong>Dubai's Town Square:</strong> Townhomes that are reasonably priced and have great family amenities</p>
          <p><strong>JVC, or Jumeirah Village Circle:</strong> Ideally situated and conducive to investment</p>
          <p><strong>Mohammed Bin Rashid City (MBR) and Meydan:</strong> Long-term potential and luxury</p>

          <h2>Why Buy Townhouses For Sale in Dubai?</h2>
          <p>For a lot of people, townhouses provide the best of both worlds: less upkeep and expense than villas, but more space and privacy than apartments. There are numerous benefits to buying townhouses in Dubai, regardless of whether you're doing it for personal use or as a rental investment:</p>
          <ul>
            <li>High demand for rentals and capital gains</li>
            <li>Perfect for long-term tenants and families</li>
            <li>Competitive rates in developing areas</li>
            <li>Adaptable payment schedules for purchases made off-plan</li>
            <li>Golden Visa eligibility for certain properties</li>
          </ul>

          <h2>Townhouse Configurations & Sizes</h2>
          <p>We offer a wide range of townhouses for sale in the UAE to suit various living requirements:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #f8f9fa;">
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Bedrooms</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Typical BUA Range</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Ideal For</th>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px;">2-Bedroom Townhouses</td>
              <td style="border: 1px solid #ddd; padding: 12px;">1,400-1,800 sq. ft.</td>
              <td style="border: 1px solid #ddd; padding: 12px;">Couples, First-Time Homeowners</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="border: 1px solid #ddd; padding: 12px;">3-Bedroom Townhouses</td>
              <td style="border: 1px solid #ddd; padding: 12px;">1,800-2,500 sq. ft.</td>
              <td style="border: 1px solid #ddd; padding: 12px;">Young Families, Upgraders</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px;">4-Bedroom+ Townhouses</td>
              <td style="border: 1px solid #ddd; padding: 12px;">2,500-3,500+ sq. ft.</td>
              <td style="border: 1px solid #ddd; padding: 12px;">Larger Families, Long-Term Investors</td>
            </tr>
          </table>

          <p>Most homes feature ensuite bedrooms, open kitchens, maids' rooms, and storage spaces, with select properties offering rooftop terraces, green views, and corner plots.</p>

          <h2>Your Trusted Partner in Buying Townhouses for Sale</h2>
          <p>At Arabian Estates, we don't just show listings — we help you navigate the process from search to signing with complete peace of mind. Our townhouse specialists offer:</p>
          <ul>
            <li>Area comparisons and ROI insights</li>
            <li>Help with DLD paperwork and NOC clearances</li>
            <li>Bank mortgage and pre-approval support</li>
            <li>Assistance with off-plan registration and resale</li>
            <li>Services for leasing and tenant management (post-purchase)</li>
          </ul>
          
          <p>We'll ensure that your decision to buy townhouses in Dubai is well-informed and future-proof, whether you're expanding your space or buying for the first time.</p>

          <h2>Let's Find the Right Townhouse for You</h2>
          <p>Are you ready to look at townhomes that meet all your requirements? Our professionals are prepared to assist you in confidently shortlisting, seeing, and buying the ideal apartment.</p>

          <button>Talk To A Specialist</button>
        `,
      };
    }
    if (type === "/sale" && queryParams.propertyType === "penthouse") {
      return {
        title: `Buy Luxury Penthouses in ${locationText}`,
        content: `
          <h1>Luxury Penthouses for Sale in ${locationText}</h1>
          
          <h2>Luxury Living with Unmatched Prestige</h2>
          <p>For those who seek the extraordinary, Dubai offers a limited collection of luxury penthouses for sale that redefine the meaning of high-end living. At Arabian Estates, a luxury real estate company, we bring you exclusive access to some of the most iconic penthouses for sale in Dubai, offering panoramic views, private amenities, and world-class design. Whether you're a discerning investor or an elite homeowner, now is the time to buy penthouses in Dubai — where lifestyle meets legacy.</p>

          <h2>Explore Signature Penthouses in Dubai's Most Prestigious Towers</h2>
          <p>Every penthouse we represent is a masterstroke of architecture and privacy. Our listings include shell & core, furnished, and serviced penthouses across Dubai's most desired high-rises and branded residences.</p>
          
          <h3>Key Features</h3>
          <ul>
            <li>Full-floor or duplex layouts with private pools, jacuzzis, and sky decks</li>
            <li>3 to 7+ bedrooms with en-suite bathrooms and walk-in wardrobes</li>
            <li>Private elevators, staff quarters, and multiple covered parking bays</li>
            <li>24/7 concierge, valet, security, and hotel-style services</li>
            <li>Smart home automation & floor-to-ceiling glass facades</li>
          </ul>
          
          <button>Browse Luxury Properties in Dubai</button>

          <h2>Top Choices of Luxury Penthouses for Sale in Dubai</h2>
          <p>The location of your penthouse matters just as much as its layout. We offer curated units in handpicked towers across:</p>
          
          <h3>Premium Penthouse Locations</h3>
          
          <h3>Palm Jumeirah</h3>
          <p>Ultimate beachfront luxury with resort amenities</p>
          
          <h3>Downtown Dubai</h3>
          <p>Burj Khalifa views and ultra-premium towers</p>
          
          <h3>Dubai Marina</h3>
          <p>Full skyline and marina views with excellent rental demand</p>
          
          <h3>Business Bay</h3>
          <p>Executive lifestyle and close to DIFC</p>
          
          <h3>Bluewaters Island</h3>
          <p>Branded residences with sea views</p>
          
          <h3>Dubai Creek Harbour</h3>
          <p>Future-forward urban waterfront living</p>

          <h2>Why Buy Penthouses in Dubai Through Arabian Estates?</h2>
          <p>We offer more than access — we offer strategic guidance and off-market opportunities in Dubai's ultra-luxury segment. When you're looking to buy penthouses in Dubai, our team ensures that every element — from title deed to post-sale support — is handled with total discretion and care.</p>
          
          <h3>What Sets Us Apart</h3>
          <ul>
            <li>Direct access to developer and private resale penthouses</li>
            <li>Expertise in Golden Visa eligibility and offshore buyer support</li>
            <li>In-depth ROI data for investor-led purchases</li>
            <li>Assistance with mortgage approvals, valuation reports, and DLD compliance</li>
            <li>Confidential negotiations and bespoke advisory for high-net-worth clients</li>
          </ul>

          <h2>Who Should Consider Buying a Penthouse in Dubai?</h2>
          
          <h3>Executive Buyers & Relocators</h3>
          <p>Professionals relocating to Dubai for long-term corporate assignments often choose penthouses for sale in Dubai that offer central access, privacy, and unmatched views.</p>
          
          <h3>Luxury Investors</h3>
          <p>With limited inventory, strong rental demand, and rising capital values, luxury penthouses for sale in Dubai offer attractive long-term investment returns and prestige positioning.</p>
          
          <h3>International Buyers</h3>
          <p>Dubai's tax-free ownership model, freehold zones, and favorable residency visa options make it ideal for international UHNW buyers looking for secure and high-growth property assets.</p>

          <h2>Experience Dubai Living at Its Most Refined</h2>
          <p>Your penthouse isn't just a property — it's a legacy asset, a private retreat, and a symbol of status. Let Arabian Estates property brokers and advisers guide you through a seamless acquisition experience, tailored to your vision and lifestyle.</p>

          <button>Talk To A Specialist</button>
        `,
      };
    }

    // Rent
    if (
      type === "/rent" &&
      (!queryParams.propertyType ||
        queryParams.propertyType === "" ||
        !["apartment", "villa", "townhouse"].includes(queryParams.propertyType))
    ) {
      return {
        title: `Properties for Rent in Dubai`,
        content: `
<h1>Properties for Rent in Dubai</h1>

<h2>Find Your Next Home in Dubai</h2>
<p>Arabian Estates offers a convenient way to browse the best rental properties in Dubai, whether you're relocating, upgrading, or searching for your first property in the United Arab Emirates. We assist you in finding the perfect home to rent in Dubai, supported by professional real estate brokers, transparency regarding the law, and complete convenience, ranging from modern city flats to family-sized villas and beachfront townhouses. We think that renting in Dubai ought to be just as fulfilling as buying. For this reason, we make the rental process simple, quick, and accessible to locals, expats, and corporates alike.</p>

<h2>Browse Premium Properties for Rent in UAE's Top Locations</h2>
<p>Our portfolio of properties for rent in the UAE covers a wide range of preferences and budgets. We regularly update listings to reflect current availability, ensuring you never miss the right opportunity.</p>

<h3>Property Types</h3>
<ul>
  <li>Studio, 1–5 bedroom apartments for rent in urban or waterfront locations</li>
  <li>Spacious villas for rent in gated, family-friendly communities</li>
  <li>Townhouses, penthouses, and duplexes for luxury living</li>
  <li>Furnished, semi-furnished, and unfurnished options</li>
  <li>Short-term and long-term rental agreements</li>
</ul>
<p><a href="/apartments-for-rent">Explore our Apartments for Rent</a> | <a href="/villas-for-rent">Villas for Rent</a></p>

<h2>Top Communities with Properties for Rent in Dubai</h2>
<p>Dubai offers a wide spectrum of rental communities—from vibrant downtown hubs to tranquil suburban neighborhoods. Our listings span the most in-demand areas based on access, amenities, and rental yield.</p>

<h3>Popular Rental Areas Include</h3>
<ul>
  <li><strong>Downtown Dubai</strong> – Modern city living with iconic views</li>
  <li><strong>Dubai Marina</strong> – Waterfront lifestyle with excellent transport access</li>
  <li><strong>Palm Jumeirah</strong> – Luxury beachfront properties</li>
  <li><strong>Business Bay</strong> – Ideal for professionals and business travelers</li>
  <li><strong>Jumeirah Village Circle (JVC)</strong> – Affordable, spacious, and well-connected</li>
  <li><strong>Dubai Hills Estate</strong> – Premium family villas with parks and schools nearby</li>
  <li><strong>Al Furjan</strong> – A rising residential hub with spacious homes, metro access, and great value</li>
</ul>

<h2>Rental Requirements: What You Need to Know Before Moving In</h2>
<p>Renting a property to let in Dubai, especially if you follow the advice of seasoned experts like our property brokers at <a href="/">Arabian Estates</a>. Generally, you must supply the following:</p>

<h3>Documents Tenants Must Have</h3>
<ul>
  <li>A copy of your passport with a valid UAE visa (for expats)</li>
  <li>Emirates ID</li>
  <li>Employment contract or salary certificate (for employed individuals)</li>
  <li>Copy of a trade licence (for independent contractors or business owners)</li>
  <li>A security deposit of 10% for furnished properties and 5% for unfurnished ones is required</li>
  <li>Rent payments made with postdated checks (usually one to four checks per year)</li>
</ul>

<p>We assist you at every step—from arranging viewings and submitting your Ejari registration to handling DEWA setup, move-in documentation, and contract signing.</p>

<h2>Why Rent with Arabian Estates?</h2>
<p>Renting from Arabian Estates provides access to premium listings, clarity, and peace of mind. Without any difficulty, our rental consultants make sure you find properties for rent in Dubai that fit your budget and lifestyle.</p>

<h3>Among our services for renters are:</h3>
<ul>
  <li>Complete legal assessment and documentation support</li>
  <li>Negotiating rent and managing contracts</li>
  <li>Help with utilities setup, Ejari, and maintenance needs</li>
  <li>New inhabitants of the UAE are advised to relocate</li>
</ul>

<h2>Looking for a Property to Let in Dubai with Flexibility?</h2>
<p>We offer flexible rental arrangements to meet your timeline and needs:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <tr style="background-color: #f8f9fa;">
    <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Rental Type</th>
    <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Duration</th>
    <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Ideal For</th>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 12px;">Short-Term Rentals</td>
    <td style="border: 1px solid #ddd; padding: 12px;">Monthly - 6 months</td>
    <td style="border: 1px solid #ddd; padding: 12px;">Tourists, Business Travelers, Transition Period</td>
  </tr>
  <tr style="background-color: #f8f9fa;">
    <td style="border: 1px solid #ddd; padding: 12px;">Long Term Leases</td>
    <td style="border: 1px solid #ddd; padding: 12px;">1-3 Years</td>
    <td style="border: 1px solid #ddd; padding: 12px;">Families, Professionals, Students</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 12px;">Furnished Units</td>
    <td style="border: 1px solid #ddd; padding: 12px;">Flexible - Yearly</td>
    <td style="border: 1px solid #ddd; padding: 12px;">Expats, Corporate Clients</td>
  </tr>
  <tr style="background-color: #f8f9fa;">
    <td style="border: 1px solid #ddd; padding: 12px;">Unfurnished Units</td>
    <td style="border: 1px solid #ddd; padding: 12px;">Yearly</td>
    <td style="border: 1px solid #ddd; padding: 12px;">Long Term Residents, Families</td>
  </tr>
</table>

<h2>Start Your Dubai Rental Journey Today</h2>
<p>Ready to explore the finest properties for rent in Dubai? Let <a href="/">Arabian Estates real estate agents</a> help you shortlist, visit, and sign with confidence. We ensure that every detail—legal, logistical, and lifestyle—is taken care of, so you can settle in stress-free.</p>

<button>Talk To A Specialist</button>
`,
      };
    }

    // Apartment rental condition
    if (type === "/rent" && queryParams.propertyType === "apartment") {
      // Your existing apartment rental content from document 5
    }

    // Villa rental condition
    if (type === "/rent" && queryParams.propertyType === "villa") {
      // Your existing villa rental content from document 5
    }

    // Townhouse rental condition
    if (type === "/rent" && queryParams.propertyType === "townhouse") {
      // Your existing townhouse rental content from document 5
    }
    if (type === "/rent" && queryParams.propertyType === "apartment") {
      return {
        title: `Apartments for Rent in ${locationText}`,
        content: `
          <h1>Apartments for Rent in ${locationText}</h1>
          
          <h2>Find Your Ideal Urban Home with Arabian Estates</h2>
          <p>Dubai's rental market is currently experiencing significant growth, presenting a range of opportunities for potential tenants. Arabian Estates makes it easier for you to rent apartments in UAE that suit a range of tastes and price ranges, whether you're moving for employment, school, or just to improve your quality of life.</p>
          
          <p>As experts in Dubai real estate, we help people, families, and companies understand the nuances of the rental market. Our property brokers in Dubai carefully select, verify, and update listings according to market trends, so you won't have to waste time reviewing outdated or overpriced options.</p>

          <h2>Rent an Apartment that Meets All of Your Needs</h2>
          <p>From affordable studios to opulent penthouses, there is a wide range of options available when looking for the ideal apartments for rent in Dubai. We offer a range of leasing options, detailed location information, and transparency throughout the process, enabling you to find an apartment that perfectly suits your needs.</p>
          
          <h3>Property Options Include</h3>
          <ul>
            <li>Studio, 1, 2, 3 & 4+ bedroom apartments</li>
            <li>Furnished, semi-furnished, and unfurnished units</li>
            <li>Short-term and long-term lease options</li>
            <li>Serviced apartments with hotel-style living</li>
          </ul>
          
          <button>Townhouses for Rent</button>
          <button>Penthouses for Rent in Dubai</button>

          <h2>Top Locations to Rent Apartments in Dubai and the UAE</h2>
          <p>Location is one of the most important factors when renting. Whether you're seeking proximity to business hubs, educational institutions, beaches, or family amenities, we have listings across every key area.</p>
          
          <h3>Most In-Demand Communities</h3>
          
          <h3>Downtown Dubai</h3>
          <p>Ideal for professionals; walk to Burj Khalifa & Dubai Mall</p>
          
          <h3>Dubai Marina</h3>
          <p>High-rise living with sea views, cafes, and nightlife</p>
          
          <h3>Business Bay</h3>
          <p>Close to DIFC, central, and modern</p>
          
          <h3>Palm Jumeirah</h3>
          <p>Luxurious beachfront apartments with private access</p>
          
          <h3>Jumeirah Village Circle (JVC)</h3>
          <p>Affordable, well-connected, and family-friendly</p>
          
          <h3>Dubai Hills Estate</h3>
          <p>Green, spacious, and ideal for long-term tenants</p>
          
          <h3>Al Furjan</h3>
          <p>Value for money, near metro and major highways</p>
          
          <h3>Silicon Oasis & Mirdif</h3>
          <p>Excellent for students and budget-conscious renters</p>

          <h2>Rental Process Made Simple: What You Need to Rent Apartments in UAE</h2>
          <p>Renting an apartment in Dubai is relatively straightforward—but having a trusted real estate advisor like Arabian Estates makes it effortless.</p>
          
          <h3>Documents Required</h3>
          <ul>
            <li>Valid passport copy (with UAE visa for expats)</li>
            <li>Emirates ID</li>
            <li>Proof of income – Salary certificate, bank statements, or employment contract</li>
            <li>Security deposit – Typically 5% of annual rent (10% for furnished units)</li>
            <li>Post-dated cheques – Usually 1–4 cheques annually depending on landlord's terms</li>
            <li>Signed tenancy agreement & Ejari registration</li>
          </ul>
          
          <p>Need help registering Ejari, setting up DEWA, or moving in? Our team handles all administrative steps for you.</p>

          <h2>Why Rent Apartments in UAE with Arabian Estates?</h2>
          <p>We go beyond listings—our mission is to provide every tenant with clarity, comfort, and confidence. Whether you're a resident looking to upgrade, or a new arrival seeking the right start, our rental advisors guide you from viewing to handover with complete professionalism.</p>
          
          <h3>With Arabian Estates, You Benefit From</h3>
          <ul>
            <li>Access to a curated portfolio of verified apartments</li>
            <li>Transparent pricing & realistic negotiations</li>
            <li>End-to-end rental process support</li>
            <li>Legal and contract review assistance</li>
            <li>Personalized apartment shortlisting based on your lifestyle & commute</li>
          </ul>
          
          <p>We also offer access to rent-to-own apartments, fully serviced apartments, and investment-grade lease options with high yield potential.</p>

          <h2>Short-Term vs Long-Term Apartment Rentals – What's Best for You?</h2>
          
          <h3>Short-Term Rentals</h3>
          <p>Contracts of one month or three months are ideal for visitors, business travelers, or those seeking temporary housing. Long-term commitment is not necessary.</p>
          
          <h3>Long-Term Leases</h3>
          <p>Ideal for professionals, families, and foreigners seeking long-term residency in the United Arab Emirates that is secure and affordable.</p>

          <h2>Start Your Apartment Rental Journey in Dubai with Confidence</h2>
          <p>Skip the chaos of classifieds and let us help you find your ideal apartment for rent—faster, smarter, and without any guesswork. Whether you're focused on lifestyle, school zones, public transport, metro line or views, we'll match you with the right unit.</p>

          <button>Contact a Rental Specialist Now</button>
        `,
      };
    }
    if (type === "/rent" && queryParams.propertyType === "villa") {
      return {
        title: `Villas for Rent in ${locationText}`,
        content: `
          <h1>Villas for Rent in ${locationText}</h1>
          
          <h2>Spacious Living, Unmatched Privacy, and Family Comfort</h2>
          <p>When considering the integration of luxury, spaciousness, and comfort, a private villa stands unparalleled. At Arabian Estates, we offer a curated selection of villas for rent in Dubai that cater to a diverse array of family sizes, financial plans, and lifestyle requirements—whether one seeks a tranquil community retreat or an opulent waterfront residence.</p>
          
          <p>We facilitate the process for expatriates and residents to secure villa rentals in the UAE by providing comprehensive rental assistance, verified property listings, and access to some of the city's premier family-friendly neighborhoods.</p>

          <h2>Find the Right Villas for Rent in UAE with Flexible Options</h2>
          <p>Whether you're moving into your forever family home or seeking a spacious upgrade, we offer a wide selection of villas for rent in UAE with varying layouts, features, and lease terms.</p>
          
          <h3>Our Listings Include</h3>
          <ul>
            <li>2 to 6+ bedroom independent and semi-detached villas</li>
            <li>Villas that are furnished, partially furnished, or unfurnished</li>
            <li>Multiple parking places, maids' quarters, private gardens, and pools</li>
            <li>Gated communities with shared facilities and round-the-clock security</li>
            <li>Eco-friendly smart homes and pet-friendly solutions</li>
            <li>Availability of both short-term and long-term leases</li>
          </ul>

          <h2>Best Places to Rent a Villa in Dubai</h2>
          <p>There are several different villa-friendly neighbourhoods in Dubai, each with special benefits like easy access to the ocean, schools, or peaceful parks.</p>
          
          <h3>The Most Sought-After Villa Communities</h3>
          
          <h3>Arabian Ranches</h3>
          <p>A favourite among families who live close to parks, schools, and shopping centres</p>
          
          <h3>Dubai Hills Estate</h3>
          <p>Community life, gorgeous scenery, and contemporary villas</p>
          
          <h3>The Meadows and the Springs</h3>
          <p>Calm communities with walking paths and lakes</p>
          
          <h3>Palm Jumeirah</h3>
          <p>Ultra-luxury beachfront villas with private beach access</p>
          
          <h3>Jumeirah Park & JVT</h3>
          <p>Family-friendly zones with spacious layouts</p>
          
          <h3>Al Furjan</h3>
          <p>Affordably priced with easy access to metro and main roads</p>
          
          <h3>Mirdif & Al Barsha</h3>
          <p>Popular with long-term residents and school commuters</p>
          
          <button>Explore All Dubai Communities</button>

          <h2>Documents & Requirements to Rent a Villa in UAE</h2>
          <p>At Arabian Estates, we make the paperwork simple and stress-free. Here's what you'll typically need to rent a villa in Dubai:</p>
          
          <h3>Documents Required</h3>
          <ul>
            <li>Valid passport copy (with residence visa)</li>
            <li>Emirates ID</li>
            <li>Proof of income: salary certificate or employment contract</li>
            <li>A security deposit of 10% for furnished rooms and 5% for unfurnished rooms is required</li>
            <li>Postdated checks, depending on the landlord, for the annual rent</li>
            <li>Tenancy agreement and Ejari registration signed</li>
          </ul>
          
          <p>Additionally, we will help you with move-in coordination, maintenance inspections, and DEWA activation.</p>

          <h2>Why Pick Arabian Estates for Villas for Rent in Dubai?</h2>
          <p>It can be challenging to find the ideal house in the market with numerous agencies and listings. Your villa rental experience will be seamless and safe thanks to our knowledgeable villa specialists' reliable advice, clear listings, and comprehensive rental assistance.</p>
          
          <h3>What We Offer</h3>
          <ul>
            <li>Verified villa listings across prime and emerging areas</li>
            <li>Bilingual rental consultants who understand the UAE tenancy system</li>
            <li>Full assistance with contract negotiation, Ejari, and landlord communication</li>
            <li>Relocation advisory for new residents and expats</li>
            <li>Corporate leasing for executive and staff accommodation</li>
          </ul>

          <h2>Villa Sizes & Lifestyle Features</h2>
          <p>From cozy 2-bedroom villas to grand 6-bedroom homes with staff quarters and private pools, we cater to families, executives, and diplomats alike.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #f8f9fa;">
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Bedrooms</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Typical BUA Range</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Best For</th>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px;">2-3 Bedroom Villa</td>
              <td style="border: 1px solid #ddd; padding: 12px;">1,800-3,000 sq.ft</td>
              <td style="border: 1px solid #ddd; padding: 12px;">Small Families, Couples, Professionals</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="border: 1px solid #ddd; padding: 12px;">4-5 Bedroom Villa</td>
              <td style="border: 1px solid #ddd; padding: 12px;">3,500 – 5,500 sq. ft.</td>
              <td style="border: 1px solid #ddd; padding: 12px;">Growing families, long-term expats</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px;">6+ Bedroom Villa</td>
              <td style="border: 1px solid #ddd; padding: 12px;">6,000 – 10,000+ sq. ft.</td>
              <td style="border: 1px solid #ddd; padding: 12px;">Large families, corporate housing, VIPs</td>
            </tr>
          </table>
          
          <p>Amenities often include maid's rooms, storage spaces, laundry rooms, covered garages, private pools, and access to clubhouses, gyms, and children's play areas.</p>

          <h2>Let's Help You Rent the Perfect Villa in Dubai</h2>
          <p>Ready to upgrade your lifestyle with one of the finest villas for rent in Dubai? Our team at Arabian Estates is here to guide you through the process—shortlisting properties, arranging viewings, negotiating on your behalf, and managing documentation.</p>

          <button>Speak to a Rental Specialist</button>
        `,
      };
    }
    if (type === "/rent" && queryParams.propertyType === "townhouse") {
      return {
        title: `Find Townhouses for Rent in ${locationText}`,
        content: `
          <h1>Find Townhouses for Rent in ${locationText}</h1>
          
          <h2>Luxury Townhomes for Rent Designed for Modern Living</h2>
          <p>The remarkable array of townhouses for rent in Dubai offers the perfect fusion of metropolitan living and home tranquility. Since they accommodate a variety of demands, these townhomes are perfect for long-term expatriates, working professionals, and families. There are townhouses in gated communities and emerging lifestyle districts to fit every taste.</p>
          
          <p>Luxury townhomes for rent frequently feature private gardens, maids' quarters, rooftop terraces, and upscale finishes. Due to its flexible layouts and conveniently accessible luxury, these homes appeal to tenants who demand freedom while being close to key city amenities.</p>
          
          <p>Our team of dedicated real estate agents in Dubai is here to assist you at every stage, streamlining your search. We can assist with budgeting, legal documentation, community comparisons, and even the registration procedures for DEWA (Dubai Electricity and Water Authority) and Ejari. You may rest easy knowing that you have help throughout your townhouse renting journey.</p>

          <h2>Why Townhouse Living Is the Best Option for You</h2>
          <p>New townhomes for rent, as opposed to apartments or villas, provide a compromise: more space than an apartment but without the maintenance of a huge villa. They offer multi-level housing, increased privacy, and frequently come with dedicated parking, shared community amenities, and landscaped green spaces, making them perfect for expanding families and professionals.</p>
          
          <h3>Popular Townhouse Developments Include</h3>
          
          <h3>Jumeirah Village Circle (JVC)</h3>
          <p>Family-friendly layouts with private outdoor areas</p>
          
          <h3>Dubai Hills Estate</h3>
          <p>Luxurious residences in gated communities</p>
          
          <h3>Meydan & MBR City</h3>
          <p>Premium, modern builds near Downtown</p>
          
          <h3>Al Furjan</h3>
          <p>Accessible, spacious townhouses with close metro connectivity</p>

          <h2>What to Expect When Renting a Townhouse in Dubai</h2>
          <p>Dubai's rental process is straightforward, provided you have the necessary documents in place. Here's what you'll typically need:</p>
          
          <ul>
            <li>Valid Emirates ID & passport copy</li>
            <li>Residence visa</li>
            <li>Proof of income: salary certificate or employment contract</li>
            <li>Security deposit (5% of annual rent for unfurnished, or 10% furnished)</li>
            <li>Post-dated rent cheques (usually 1-4)</li>
          </ul>
          
          <p>Our property agents in Dubai will guide you through community comparisons, budgeting, legal paperwork, and even DEWA (electricity/water) and Ejari registration.</p>

          <h2>Featured Listings: Townhouses Ready to Rent</h2>
          <p>At Arabian Estates, our listings include a hand-picked range of townhouses for rent:</p>
          
          <ul>
            <li>2 to 4-bedroom configurations</li>
            <li>Completely equipped kitchens and bathrooms</li>
            <li>Terrace and garden access</li>
            <li>Options that are pet-friendly</li>
            <li>Public gyms and swimming pools</li>
            <li>Every one of our listings is current and verified</li>
          </ul>
          
          <p>We streamline the search and customise it to your requirements, whether you're planning or wanting to move in right now.</p>

          <h2>Simplify Your Townhouse Rental with Arabian Estates</h2>
          <p>From start to finish, our team of skilled real estate agents in Dubai is available to assist with your townhouse search. We assist tenants in finding property in Dubai that fits their lifestyle and budget by providing local insights, assistance with renting negotiations, and thorough local expertise. Looking for something other than a townhouse? You can also explore our listings for:</p>
          
          <button>Apartments for Rent in Dubai</button>
          <button>Villas for Rent in UAE</button>

          <h2>Make Your Move Seamless – Rent Your Ideal Townhouse Today</h2>
          <p>From new townhomes for rent in emerging developments to luxury townhomes for rent in prime communities, Arabian Estates ensures you find a home that reflects your lifestyle. Contact our team to secure your ideal townhouse today.</p>

          <button>Speak to a Rental Specialist</button>
        `,
      };
    }

    // Offplan
    if (
      type === "/offplan" &&
      (queryParams.propertyType === null ||
        queryParams.propertyType === "" ||
        (queryParams.propertyType !== "apartment" &&
          queryParams.propertyType !== "villa" &&
          queryParams.propertyType !== "townhouse"))
    ) {
      return {
        title: `Explore the Best Off Plan Projects in Dubai`,
        content: `
    <h1>Explore the Best Off Plan Projects in Dubai</h1>
    <h2>Invest Smart, Buy Early</h2>
      
      <h2>Invest in Off Plan Properties In Dubai</h2>
      <p>Dubai's real estate market continues to thrive, and off plan properties in Dubai are at the center of its long-term investment appeal. Whether you're an investor looking for capital appreciation or a first-time buyer entering the market, purchasing an off-plan property offers flexibility, attractive pricing, and payment plans that suit a wide range of budgets. At <a href="/">Arabian Estates, real estate agency</a> we bring you access to the most reliable and best off plan property in Dubai—direct from top developers, fully verified, and presented with transparent pricing, floor plans, and handover timelines.</p>

      <h2>Why Buy Off Plan Property in Dubai?</h2>
      <p>Purchasing a property that is either in the planning or building stages is known as buying off-plan. This offers you several advantages:</p>
      <ul>
        <li><strong>Reduced Entry Prices:</strong> Compared to finished homes, off-plan residences for sale in Dubai are generally more affordable.</li>
        <li><strong>Flexible Payment Plans:</strong> Make partial payments during construction and settle the remaining amount upon completion.</li>
        <li><strong>Greater ROI Potential:</strong> As values increase with completion and advancement, capital appreciation is frequently higher.</li>
        <li><strong>Numerous Unit Options:</strong> Gain first dibs on the greatest floor plans, views, and layouts.</li>
        <li><strong>Developer Guarantees:</strong> The Dubai Land Department (DLD) guarantees that post-handover payment alternatives are included with many apartments.</li>
      </ul>

      <h2>Types of Off Plan Properties for Sale in Dubai</h2>
      <p>Dubai offers a diverse portfolio of off-plan options, from affordable apartments to luxury villas and branded residences. Whether you're buying to live or invest, you'll find a match in:</p>
      <ul>
        <li>High-rise off plan apartments in Downtown Dubai, Business Bay, and JVC</li>
        <li>Waterfront off plan villas in Palm Jumeirah, Dubai Islands, and Emaar Beachfront</li>
        <li>Boutique townhouses and duplexes in new master communities</li>
        <li>Mixed-use developments with retail, hospitality, and wellness facilities</li>
      </ul>

      <h3>Browse by property Type</h3>
      <ul>
        <li><a href="/off-plan-apartments">Off Plan Apartments</a></li>
        <li><a href="/off-plan-villas">Off Plan Villas</a></li>
      </ul>

      <h2>Top Developers Offering Off Plan Property for Sale in Dubai</h2>
      <p>We work closely with trusted and reputed developers to give you early access to Dubai's most exciting new projects.</p>
      
      <h3>Popular Developers:</h3>
      <ul>
        <li><strong>Emaar</strong> – Known for Downtown, Dubai Creek Harbour</li>
        <li><strong>Damac</strong> – High-luxury branded residences</li>
        <li><strong>Nakheel</strong> – Waterfront communities like Palm Jumeirah</li>
        <li><strong>Sobha Realty</strong> – High-quality gated living in Sobha Hartland</li>
        <li><strong>Meydan</strong> – Modern family-friendly communities near central Dubai</li>
        <li><strong>Select Group</strong> – Marina and beachside towers</li>
      </ul>

      <button>Explore By Developer</button>

      <h2>Where to Buy Off Plan Property in Dubai?</h2>
      <p>Dubai is home to rapidly growing and well-planned master communities that offer fantastic opportunities for off-plan buyers. These locations provide strong rental yields, resale potential, and integrated amenities.</p>

      <h3>Most Searched Off Plan Areas:</h3>
      <ul>
        <li><strong>Dubai Hills Estate</strong> – Green, family-centric living by Emaar</li>
        <li><strong>Dubai Creek Harbour</strong> – Waterfront luxury with Burj Khalifa views</li>
        <li><strong>Business Bay & Downtown</strong> – For investors seeking city-centric capital gains</li>
        <li><strong>Palm Jumeirah & Dubai Marina</strong> – Iconic beachfront high-rises</li>
        <li><strong>Jumeirah Village Circle (JVC)</strong> – Affordability meets accessibility</li>
        <li><strong>Meydan, MBR City</strong> – Expansive, modern master-planned zones</li>
      </ul>

      <h2>What You Need to Know Before You Buy Off Plan Properties in Dubai</h2>
      <p>When you buy off plan property in Dubai, here are the key considerations:</p>
      <ul>
        <li>10%–20% booking deposit is usually required</li>
        <li>DLD registration fees (typically 4%) apply</li>
        <li>Review the handover date and construction schedule</li>
        <li>Ensure developer is registered with RERA (Real Estate Regulatory Agency)</li>
        <li>Confirm escrow account compliance to protect your funds</li>
        <li>Understand the penalty clauses and refund policies in case of delays</li>
      </ul>
      <p>Our experts help you assess the full picture—ROI, resale potential, payment flexibility, and documentation.</p>

      <h2>Why Choose Arabian Estates for Off Plan Property in Dubai?</h2>
      <p>We streamline the purchasing process and assist you in obtaining the best units before public releases. With our in-depth knowledge of payment arrangements, industry insights, and early access to exclusive projects, we provide:</p>
      <ul>
        <li>Priority access to off-plan projects in Dubai before their official release</li>
        <li>Completely validated developer portfolios and availability of units</li>
        <li>Complete assistance, from reservation to DLD documentation and transfer</li>
        <li>Multilingual real estate brokers knowledgeable about Golden Visa eligibility</li>
        <li>Advice on establishing an exit strategy and buy-to-let possibilities</li>
      </ul>

      <h2>Are You Ready to Purchase Dubai Off-Plan Properties?</h2>
      <p>The time to look into off-plan properties for sale in Dubai is now, regardless of whether you're searching for a long-term investment opportunity or a house to grow into. Enjoy flexible terms, future-ready communities, and the expert guidance of <a href="/">Arabian Estates</a> every step of the way.</p>

      <button>Contact Our Team</button>
    `,
      };
    }
    if (type === "/offplan" && queryParams.propertyType === "apartment") {
      return {
        title: `Off Plan Apartments for Sale in Dubai`,
        content: `
    <h1>Off Plan Apartments for Sale in Dubai</h1>
    <h2>Early Investment, Long-Term Value</h2>
      
      <h2>Buy Off Plan Apartments in Dubai</h2>
      <p>Are you interested in investing in Dubai's rapidly expanding property market? Explore a carefully curated selection of off-plan apartments available for purchase in Dubai, suitable for both end-users and investors seeking flexible payment options, capital growth, and early entry into premium developments.</p>
      
      <p>To offer verified, RERA-approved off-plan apartments for sale throughout Dubai's most prestigious communities, <a href="/">Arabian Estates</a> collaborates with top developers. We help you locate the perfect future-ready home or a profitable investment opportunity, ranging from studio flats to roomy four-bedroom homes.</p>

      <h2>Why Pick Dubai's Off-Plan Apartments?</h2>
      <p>Purchasing an off-plan flat entails buying a unit that is either in the planning stage or currently under construction. This offers you several benefits:</p>

      <h3>Lower Purchase Price</h3>
      <p>Pre-completion prices are often below market rates.</p>

      <h3>Flexible Payment Plans</h3>
      <p>Pay over time, often with post-handover options.</p>

      <h3>Modern Layouts</h3>
      <p>New buildings come with energy-efficient designs and smart home features.</p>

      <h3>Capital Growth</h3>
      <p>Higher ROI expected as the area and infrastructure develop.</p>

      <h3>Choice of Units</h3>
      <p>Choose the best floor, view, and configuration before the public release.</p>

      <h2>Top Locations for Off Plan Apartments in Dubai</h2>
      <p>Dubai's off-plan market is booming, with new apartment developments launching in every major district. Whether you're looking for a beachfront lifestyle, city-center convenience, or community living, there's an ideal project waiting for you.</p>

      <h3>Popular Areas Include:</h3>
      <ul>
        <li><strong>Dubai Hills Estate</strong> – Park views, schools, and golf-course facing towers.</li>
        <li><strong>Downtown Dubai</strong> – Burj Khalifa views and luxury amenities.</li>
        <li><strong>Business Bay</strong> – Close to commercial hubs and metro connectivity.</li>
        <li><strong>Dubai Creek Harbour</strong> – Waterfront apartments with skyline backdrops.</li>
        <li><strong>Jumeirah Village Circle (JVC)</strong> – Affordable, family-friendly communities.</li>
        <li><strong>Emaar Beachfront & Palm Jumeirah</strong> – Coastal living with premium finishes.</li>
        <li><strong>MBR City & Meydan</strong> – Master-planned developments with modern infrastructure.</li>
      </ul>

      <h2>Types of Off Plan Apartments for Sale Dubai</h2>
      <p>Whether you're a solo buyer, young couple, or seasoned investor, we offer:</p>
      <ul>
        <li><strong>Studios</strong> – Ideal for singles and short-term investors</li>
        <li><strong>1 & 2 Bedrooms</strong> – Perfect for small families or rental portfolios</li>
        <li><strong>3+ Bedroom Apartments</strong> – Spacious, often with maid's rooms and sea views</li>
        <li><strong>Branded Residences</strong> – Managed by global names like Armani, Address, and Sobha</li>
        <li><strong>Hotel Apartments</strong> – Fully serviced, with guaranteed rental returns</li>
      </ul>

      <h2>What to Expect When You Buy Off Plan in Dubai</h2>
      <p>Buying an off-plan apartment is straightforward, especially with our team guiding you step by step.</p>

      <h3>You'll Need:</h3>
      <ul>
        <li>Passport copy (for international buyers)</li>
        <li>Emirates ID (if UAE resident)</li>
        <li>Initial booking fee (typically 5–20%)</li>
        <li>Signed Sales Purchase Agreement (SPA)</li>
        <li>DLD Registration (usually 4% of the purchase price)</li>
        <li>All funds are paid into RERA-approved escrow accounts for buyer protection.</li>
      </ul>

      <h2>Why Buy with Arabian Estates?</h2>
      <p>We simplify your off-plan journey with:</p>
      <ul>
        <li>Early access to off plan apartments for sale in Dubai</li>
        <li>Full project insights—floor plans, payment terms, handover timelines</li>
        <li>Price negotiation and preferred unit selection</li>
        <li>Legal support with DLD, SPA, and escrow coordination</li>
        <li>Post-handover assistance and rental advisory if buying for investment</li>
      </ul>

      <button>Explore our Off Plan Properties</button>

      <h2>Start Your Property Journey Today</h2>
      <p>Whether you're looking to buy off plan apartments in Dubai as your future home or to grow your real estate portfolio, <a href="/">Arabian Estates property brokers in Dubai</a> ensures a smooth, secure, and rewarding experience. With our direct access to Dubai's best developments and industry expertise, we help you make the right move at the right time.</p>

      <button>Register for Early Access to New Launches</button>
    `,
      };
    }
    if (type === "/offplan" && queryParams.propertyType === "villa") {
      return {
        title: `Discover Off Plan Villas for Sale in Dubai`,
        content: `
    <h1>Discover Off Plan Villas for Sale in Dubai</h1>
    <h2>Designed for Future-Ready Living</h2>
      
      <h2>Explore Off Plan Villas Designed for Spacious, Modern Living</h2>
      <p>Looking for more space, privacy, and long-term value in your next investment? Discover a carefully curated selection of off-plan homes in Dubai that combine smart community planning with contemporary architecture. With reasonable rates and flexible payment options, these properties provide you the opportunity to purchase your ideal home or next asset for your portfolio before it is even finished.</p>
      
      <p>One of the most alluring options in the UAE real estate market right now are Dubai's off-plan villas, whether you're an end-user seeking quiet community living, an investor seeking capital appreciation, or a growing family.</p>

      <h2>A New Generation of Villas – Why Off Plan?</h2>
      <p>Unlike ready <a href="/villas-for-sale">villas for sale</a>, offplan villas allow you to enter the market early, customize your options, and benefit from payment flexibility. With continued expansion across Dubai's suburbs and master-planned communities, these developments are built to accommodate modern lifestyles, focusing on sustainability, design, and wellness.</p>

      <h3>Key Benefits</h3>
      <ul>
        <li>Staged payment plans from booking to handover</li>
        <li>Wide range of unit layouts: 3 to 6+ bedrooms</li>
        <li>Customization options during early phases</li>
        <li>High potential for price appreciation</li>
        <li>Smart home integrations and green building features</li>
      </ul>

      <h2>Where Are the Best Off Plan Villas in Dubai?</h2>
      <p>Dubai's off-plan villa market has expanded significantly, with high demand in emerging and established areas. Most communities are gated, landscaped, and designed with family-focused amenities.</p>

      <h3>Top Locations for Off Plan Villas</h3>
      <ul>
        <li><strong>Dubai Hills Estate</strong> – Green spaces, international schools, golf-front villas</li>
        <li><strong>Tilal Al Ghaf</strong> – Lagoon-style luxury living by Majid Al Futtaim</li>
        <li><strong>Meydan & MBR City</strong> – Easy Downtown access with modern layouts</li>
        <li><strong>Arabian Ranches III</strong> – Emaar's legacy of community-focused development</li>
        <li><strong>The Valley & The Oasis</strong> – Quiet, nature-inspired suburban living</li>
        <li><strong>Jumeirah Golf Estates</strong> – Premium villas with golf course views</li>
      </ul>

      <p>Each location offers proximity to schools, healthcare, parks, and retail—all designed with long-term family comfort in mind.</p>

      <h2>What to Expect When Buying Off Plan Villas in Dubai</h2>
      <p>When you buy off-plan villas, you're entering a regulated and structured process backed by Dubai Land Department (DLD) guidelines. Here's how it typically works:</p>

      <h3>Purchase Process</h3>
      <ul>
        <li>Select your unit, view master plans & floor layouts</li>
        <li>Pay booking amount (usually 5–20%)</li>
        <li>Sign Sales Purchase Agreement (SPA)</li>
        <li>Oqood is given/registered with Land Department</li>
        <li>Golden Visa provided for properties over 2m</li>
        <li>Continue with installment plan during construction</li>
        <li>Pay remaining balance and/or mortgage on handover</li>
      </ul>

      <p>All developer payments are made via RERA-approved escrow accounts, ensuring complete financial security for buyers.</p>

      <h2>Types of Off Plan Villas Available</h2>
      <p>Off-plan villa designs cater to both premium and mid-market buyers, offering features such as:</p>
      <ul>
        <li>Private gardens & pools</li>
        <li>Rooftop terraces & family lounges</li>
        <li>Maid's quarters, storage, and driver's rooms</li>
        <li>Attached and standalone unit options</li>
        <li>Community clubhouses, gyms, and jogging tracks</li>
      </ul>

      <h3>Choose From</h3>
      <ul>
        <li>3–4 Bedroom Family Villas</li>
        <li>5+ Bedroom Signature Villas</li>
        <li>Twin Villas / Semi-Detached Options</li>
        <li>Contemporary, Mediterranean, or Arabic-style designs</li>
      </ul>

      <h2>Why Choose Arabian Estates?</h2>
      <p>At Arabian Estates, we offer you early and exclusive access to Dubai's top off plan villas for sale, including pre-launch units and developer incentives.</p>

      <h3>Our Services Include</h3>
      <ul>
        <li>Personalized project recommendations</li>
        <li>Developer background checks and ROI advice</li>
        <li>Full assistance with documentation, DLD registration, and SPA review</li>
        <li>Ongoing support until handover – and even beyond, for resale or rental management</li>
      </ul>
      <p>We're here to make your off-plan buying journey seamless, transparent, and profitable.</p>

      <h2>Secure the Right Off Plan Villa in Dubai Today</h2>
      <p>Now is the ideal time to consider off-plan villas in Dubai, whether you're investing or planning your family's future residence. Allow <a href="/">Arabian Estates</a> to assist you in navigating the market, understanding the available options, and selecting the ideal villa that meets your requirements and fits within your price range.</p>

      <button>Contact an Off Plan Specialist</button>
    `,
      };
    }
    if (type === "/offplan" && queryParams.propertyType === "townhouse") {
      return {
        title: `Off Plan Townhouses in Dubai`,
        content: `
<h1>Off Plan Townhouses in Dubai</h1>
<h2>Smart Living, Smart Investment</h2>
  
  <h2>Buy Townhouses With Easy Payment Plans</h2>
  <p>Looking to balance modern living with space, privacy, and value? Off plan townhouses in Dubai offer an ideal middle ground between apartment convenience and villa comfort—perfect for families, professionals, and investors. With flexible payment plans, prime locations, and contemporary architecture, these properties are among the most in-demand assets in Dubai's off-plan market.</p>
  
  <p>At <a href="/">Arabian Estates</a>, we bring you exclusive access to upcoming off-plan townhouses for sale in master-planned communities designed for walkable, family-friendly lifestyles.</p>

  <h2>Why Choose Off Plan Townhouses in Dubai?</h2>
  <p>Whether you're buying your first home or expanding your investment portfolio, off plan townhouses are a smart choice. They combine affordability, functional design, and strong long-term appreciation potential.</p>

  <h3>Key Benefits</h3>
  <ul>
    <li>Competitive pricing with staged payment plans</li>
    <li>Spacious layouts with 2 to 5 bedrooms</li>
    <li>Low-density neighborhoods with parks and shared amenities</li>
    <li>High rental demand and resale value</li>
    <li>Options for corner units, garden plots, and roof terraces</li>
  </ul>
  <p>Buying during the off-plan stage means you get the best units, views, and prices—before handover.</p>

  <h2>Where to Find the Best Off Plan Townhouses for Sale in Dubai</h2>
  <p>Dubai has launched several exciting new townhouse projects across its expanding residential zones. These developments are designed with lifestyle in mind—offering walkability, schools, green spaces, and retail hubs within minutes.</p>

  <h3>Top Areas to Buy Off Plan Townhouses</h3>
  <ul>
    <li><strong>Dubai Hills Estate</strong> – Emaar's premier family community</li>
    <li><strong>Tilal Al Ghaf</strong> – Lagoon living with luxury townhomes</li>
    <li><strong>Arabian Ranches III</strong> – Trusted Emaar design in a suburban setting</li>
    <li><strong>The Valley by Emaar</strong> – Affordable off-plan townhouses with modern design</li>
    <li><strong>Mudon & Dubailand</strong> – Established neighborhoods with new clusters</li>
    <li><strong>Town Square</strong> – Entry-level townhouses with community amenities</li>
  </ul>

  <h2>Types of Off Plan Townhouses Available</h2>
  <p>From affordable starter homes to upscale lifestyle townhomes, Dubai's off-plan market offers a wide variety of configurations:</p>
  <ul>
    <li><strong>2 & 3 Bedroom Townhouses</strong> – Ideal for young families</li>
    <li><strong>4–5 Bedroom Corner Units</strong> – More space, privacy, and garden areas</li>
    <li><strong>Cluster & Row-Style Designs</strong> – Available in modern, contemporary, and Arabic-inspired architecture</li>
    <li><strong>Gated Communities</strong> – With pools, playgrounds, gyms, and event spaces</li>
  </ul>
  <p>Units can come with dedicated parking, built-in wardrobes, maid's rooms (in larger units), and landscaped community access.</p>

  <h2>What's Involved in Buying Off Plan Townhouses in Dubai?</h2>
  <p>Purchasing an off-plan townhouse is a regulated, secure process in Dubai:</p>

  <h3>What You'll Need:</h3>
  <ul>
    <li>Valid Passport (or Emirates ID if resident)</li>
    <li>Booking deposit (5–20%)</li>
    <li>Signed Sales Purchase Agreement (SPA)</li>
    <li>Payment plan via cheque or bank transfer</li>
    <li>Registration with Dubai Land Department (4% of purchase price)</li>
    <li>Final payment and handover documentation upon completion</li>
  </ul>
  <p>All projects listed through Arabian Estates are approved by RERA and follow payment compliance, ensuring full buyer protection.</p>

  <h2>Why Buy with Arabian Estates?</h2>
  <p>We're not just here to sell—we're here to help you buy right.</p>

  <h3>Our Advantages</h3>
  <ul>
    <li>Early access to off plan townhouses for sale in Dubai</li>
    <li>In-depth knowledge of developer reputations and track records</li>
    <li>Customized advice based on your goals—end-use or rental</li>
    <li>Full legal and financial support, from booking to handover</li>
    <li>Assistance with post-handover rental or resale planning</li>
  </ul>

  <h2>Your New Townhouse Is Just a Step Away</h2>
  <p>Whether you're looking for space to grow, a secure investment, or your next property milestone, off plan townhouses in Dubai offer flexible choices backed by long-term value.</p>

  <button>Get in Touch with Our Off Plan Specialists</button>
`,
      };
    }

    // Default content for general property searches
    return {
    title: `Buy Property in Dubai`,
    content: `
<h1>Buy Property in Dubai</h1>
<h2>Discover a World of Investment & Lifestyle Opportunities with Arabian Estates</h2>

<h2>Dubai Properties for Sale Exclusive Listings</h2>
<p>With the perfect balance of opulent lifestyle and exciting investment prospects, Dubai has become one of the most sought-after real estate markets globally. At <a href="/">Arabian Estates</a>, we offer a premium inventory of properties for sale in Dubai, backed by up-to-date market intelligence and effective transaction support. We assist you in purchasing real estate in Dubai with complete transparency and professionalism, whether you're an investor seeking to optimise your return on investment or a family looking for your forever home.</p>

<h2>Filter Dubai Real Estate Listings by Category</h2>
<p>With our diverse and ever-growing selection of <a href="/">Dubai real estate</a> for sale, we promise that there is something for every lifestyle, budget, and investment strategy.</p>

<h3>Apartments for Sale in Dubai</h3>
<p>These apartments are perfect for both end users and short-term rental investors since they are modern, popular, and located in the centre of thriving neighbourhoods including Downtown Dubai, Dubai Marina, and Business Bay.</p>

<h4>Key Features:</h4>
<ul>
  <li>Freehold title ownership</li>
  <li>Studio to 4-bedroom layouts</li>
  <li>Ready and off-plan resale options</li>
</ul>

<button>Explore Apartments for Sale in Dubai</button>

<h3>Villas for Sale in Dubai</h3>
<p>Villas offer spacious living with private amenities, making them ideal for families or investors seeking capital growth. Choose from gated neighbourhoods such as Palm Jumeirah, Dubai Hills Estate, and Arabian Ranches.</p>

<h4>Important attributes:</h4>
<ul>
  <li>Large floor plans include gardens and private pools</li>
  <li>Family-centric neighborhoods with community parks</li>
  <li>High demand for rentals and resale</li>
</ul>

<button>View Dubai's Villas for Sale</button>

<h3>Townhouses & Penthouses for Sale</h3>
<p>Penthouses cater to those seeking ultra-luxury living with city views, while townhouses are ideal for middle-class customers seeking spacious accommodations without the high cost of a villa.</p>

<p><strong>Popular Locations:</strong> Jumeirah Golf Estates, Meydan, and JVC</p>
<p><strong>Important Terms:</strong> Capital Gain, Service Fees, and Freehold</p>

<button>Explore Townhouses | Penthouses</button>

<h2>Why Buy Property in Dubai with Arabian Estates?</h2>
<p>As leading Dubai property consultants, we're not just listing agents — we're strategic advisors. Here's what sets us apart when it comes to buying Dubai properties for sale:</p>

<ul>
  <li>Direct access to off-market deals and developer inventory</li>
  <li>Dedicated consultants for secondary and off-plan resale</li>
  <li>In-depth knowledge of DLD regulations and mortgage eligibility</li>
  <li>End-to-end support with title deed transfer, NOC clearance, and valuation reports</li>
</ul>

<p>Whether you're looking for high-yield properties in new hotspots or luxury residences in Dubai's most iconic neighborhoods, we're here to simplify your purchase journey.</p>

<h2>Popular Areas to Buy Property in Dubai</h2>
<p>Looking to buy property in Dubai based on lifestyle or growth prospects? Explore some of the top-performing areas:</p>

<ul>
  <li><strong>Downtown Dubai</strong> – Iconic Burj Khalifa views, unmatched demand</li>
  <li><strong>Dubai Marina</strong> – High rental yield and waterfront lifestyle</li>
  <li><strong>Palm Jumeirah</strong> – Exclusive villas and beachfront apartments</li>
  <li><strong>Dubai Hills Estate</strong> – Master-planned community ideal for families</li>
  <li><strong>Business Bay</strong> – Ideal for professionals and commercial investors</li>
</ul>

<button>Browse all Dubai Communities</button>

<h2>Ready to Buy Property in Dubai? Let's Guide You Home</h2>
<p>With the proper knowledge, buying a property for sale in Dubai can be extremely rewarding. Our staff makes sure that every stage is managed expertly and effectively, from mortgage advice to negotiation and closing. Begin your adventure with <a href="/">Arabian Estates real estate brokers in Dubai</a> and acquire a partner who is knowledgeable about the city's distinct real estate market, your objectives, and your aspirations.</p>

<h2>Speak to a Dubai Property Specialist Today</h2>
<p>Whether you're looking to invest, relocate, or upgrade, our experts are here to help you make the best decision in Dubai's fast-moving property market.</p>

<button>Get in Touch</button>
`,
  };
}

// Apartment sale condition
if (type === "/sale" && queryParams.propertyType === "apartment") {
  return {
    title: `Apartments for Sale in Dubai`,
    content: `
<h1>Apartments for Sale in Dubai</h1>
<h2>Modern Urban Living & Investment Opportunities</h2>

<p>Discover premium apartments for sale in Dubai's most sought-after communities. Whether you're looking for your dream home or a profitable investment, our curated selection offers the perfect blend of luxury, convenience, and capital growth potential.</p>

<p>From studio apartments in vibrant Downtown Dubai to spacious 4-bedroom units with stunning Marina views, find your ideal property with <a href="/">Arabian Estates</a>.</p>

<h3>Key Features:</h3>
<ul>
  <li>Freehold title ownership</li>
  <li>Studio to 4-bedroom layouts</li>
  <li>Ready and off-plan options available</li>
  <li>Prime locations with high rental yields</li>
  <li>Modern amenities and world-class facilities</li>
</ul>

<button>Explore Apartments for Sale</button>
`,
  };
}

// Villa sale condition
if (type === "/sale" && queryParams.propertyType === "villa") {
  return {
    title: `Villas for Sale in Dubai`,
    content: `
<h1>Villas for Sale in Dubai</h1>
<h2>Luxury Family Living & Premium Investment</h2>

<p>Discover exclusive villas for sale in Dubai's most prestigious gated communities. Perfect for families seeking spacious living or investors looking for premium assets with strong capital appreciation potential.</p>

<p>Choose from stunning waterfront villas on Palm Jumeirah to family-friendly homes in Dubai Hills Estate and Arabian Ranches, all offering the ultimate in privacy and luxury.</p>

<h3>Important Attributes:</h3>
<ul>
  <li>Large floor plans with private gardens and pools</li>
  <li>Family-centric neighborhoods with community parks</li>
  <li>High demand for rentals and resale</li>
  <li>Freehold ownership available</li>
  <li>Premium locations with excellent amenities</li>
</ul>

<button>View Dubai's Villas for Sale</button>
`,
  };
}

// Townhouse sale condition
if (type === "/sale" && queryParams.propertyType === "townhouse") {
  return {
    title: `Townhouses for Sale in Dubai`,
    content: `
<h1>Townhouses for Sale in Dubai</h1>
<h2>Perfect Balance of Space & Value</h2>

<p>Discover townhouses for sale in Dubai that offer the ideal middle ground between apartment convenience and villa luxury. Perfect for growing families and savvy investors seeking quality properties in master-planned communities.</p>

<p>Our townhouse selection features modern designs, private outdoor spaces, and access to world-class community amenities across Dubai's most desirable neighborhoods.</p>

<h3>Key Benefits:</h3>
<ul>
  <li>Spacious multi-level layouts</li>
  <li>Private gardens and terraces</li>
  <li>Gated community living</li>
  <li>Competitive pricing compared to villas</li>
  <li>Strong rental demand and resale value</li>
</ul>

<button>Explore Townhouses for Sale</button>
`,
  };
}

// Penthouse sale condition
if (type === "/sale" && queryParams.propertyType === "penthouse") {
  return {
    title: `Penthouses for Sale in Dubai`,
    content: `
<h1>Penthouses for Sale in Dubai</h1>
<h2>Ultra-Luxury Living with Iconic City Views</h2>

<p>Experience the pinnacle of luxury living with our exclusive collection of penthouses for sale in Dubai. These ultra-premium properties offer breathtaking panoramic views, private terraces, and world-class amenities.</p>

<p>From Downtown Dubai's sky-high residences to Marina's waterfront penthouses, find your perfect luxury sanctuary in the clouds.</p>

<h3>Luxury Features:</h3>
<ul>
  <li>Panoramic city and sea views</li>
  <li>Private elevators and terraces</li>
  <li>Premium finishes and fixtures</li>
  <li>Exclusive building amenities</li>
  <li>High investment potential</li>
</ul>

<button>View Penthouses for Sale</button>
`,
  };
}


  return (
    <>
      {/* SEO Accordion Section */}
      <div className="seo-accordion-section">
        <div
          className={`seo-accordion-header ${isAccordionOpen ? "active" : ""}`}
          onClick={toggleAccordion}
        >
          <h3>{getSeoContent().title}</h3>
          <button className="accordion-toggle">
            <span
              className={`accordion-arrow ${isAccordionOpen ? "open" : ""}`}
            >
              ▼
            </span>
          </button>
        </div>
        <div
          className={`seo-accordion-content ${isAccordionOpen ? "open" : ""}`}
        >
          <div
            className="seo-content-wrapper"
            dangerouslySetInnerHTML={{ __html: getSeoContent().content }}
          />
        </div>
      </div>
    </>
  );
}

export default SeoAccordianText;
