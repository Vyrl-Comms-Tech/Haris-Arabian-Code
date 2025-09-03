import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../src/App.css";
import Home from "../src/Pages/Home";
import PropertyListing from "./Pages/PropertyListing";
import HeroOffplanProperty from "./Components/HeroOffplanProperty";
import { Route, Routes } from "react-router-dom";
import Singlepage from "../src/Components/SinglePropertyPage";
// ! admin
import Blogs from "./admin/pages/Blogs";
import Contact from "./admin/pages/Contact";
import Dashboard from "./admin/pages/Dashboard";
import DashboardLayout from "./admin/pages/DashboardLayout";
import Login from "./admin/pages/Login";
import ReferralTracking from "./admin/pages/ReferralTrackingPage";
import CommunityGuides from "./admin/pages/CommunityGuide";
import ProtectedRoute from "./admin/components/ProptectedRoute";
import { PropertyProvider } from "./Context/PropertyContext";
import Agents from "./admin/pages/Agents";
import KnowledgeHub from "./Pages/KnowledgeHub";
import NewOffPlanPage from "./Pages/NewOffPlanPage";
import MortgageCalculator from "./Pages/MortgageCalculator";
import Referrals from "./Pages/Referrals";
import CommunityGuide from "./Pages/CommunityGuide";
import CommunityGuideArea from "./Pages/CommunityGuideArea";
import Career from "./Pages/Career";
import AboutUs from "./Pages/AboutUs";
import PeopleProfile from "./Pages/PeopleProfile";
import ContactUs from "./Pages/ContactUs";
import Mortgages from './Pages/Mortgages'
import PodcastInner from "./Pages/PodcastInner";
import PeopleResult from "./Pages/PeopleResult";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function App() {
  const lenisRef = useRef(null);
  const containerRef = useRef(null);
  const rafRef = useRef(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode");
  };
  // Set up Lenis smooth scrolling
  useGSAP(() => {
    // Initialize Lenis
    lenisRef.current = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      wheelMultiplier: 2,
      touchMultiplier: 1.5,
      smoothTouch: true,
      touchInertiaMultiplier: 0.8,
      infinite: false,
    });

    // Sync Lenis with GSAP ScrollTrigger
    const scrollUpdate = () => ScrollTrigger.update();
    lenisRef.current.on("scroll", scrollUpdate);

    // Single RAF loop using GSAP ticker
    const tickerFunction = (time) => {
      if (lenisRef.current) {
        lenisRef.current.raf(time * 1000);
      }
    };

    gsap.ticker.add(tickerFunction);
    gsap.ticker.lagSmoothing(0);

    // Cleanup function
    return () => {
      if (lenisRef.current) {
        lenisRef.current.off("scroll", scrollUpdate);
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      gsap.ticker.remove(tickerFunction);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <PropertyProvider>
      <Routes>
        <Route path="/" element={<Home lenis={lenisRef.current} />} />
        {/* <Route
          path="/Mortgagepage"
          element={<MortgageCalculator lenis={lenisRef.current} />}
        /> */}
        <Route path="/KH" element={<KnowledgeHub lenis={lenisRef.current} />} />
        <Route path="/single-property" element={<Singlepage />} />
        <Route
          path="/referral"
          element={<Referrals lenis={lenisRef.current} />}
        />{" "}
        {/* haris kai paas thk wala hai*/}
        <Route
          path="/community-guide"
          element={<CommunityGuide lenis={lenisRef.current} />}
        />
        <Route
          path="/community-guide-area"
          element={<CommunityGuideArea lenis={lenisRef.current} />}
        />
        <Route
          path="/properties/:id"
          element={<PropertyListing lenis={lenisRef.current} />}
        />
        <Route
          path="/properties/newoffplan"
          element={<NewOffPlanPage lenis={lenisRef.current} />}
        />
        {/* New pages that Haris merged */}
        <Route
          path="/knowledge-hub"
          element={<KnowledgeHub lenis={lenisRef.current} />}
        />
        <Route path="/career" element={<Career lenis={lenisRef.current} />} />
        <Route
          path="/about-us"
          element={<AboutUs lenis={lenisRef.current} />}
        />
        <Route
          path="/people-profile"
          element={<PeopleProfile lenis={lenisRef.current} />}
        />
        {/*! 27/aug/wed !*/}
        <Route
          path="/contact-us"
          element={<ContactUs lenis={lenisRef.current} />}
        />
        <Route
          path="/Mortgagepage"
          element={<Mortgages lenis={lenisRef.current} />}
        />
        {/* 28/aug/thus */}
        <Route
          path="/podcast-inner"
          element={<PodcastInner lenis={lenisRef.current} />}
        />
        {/*2/sep/tues  */}
        <Route
          path="/people-result"
          element={<PeopleResult lenis={lenisRef.current} />}
        />
      
      
      </Routes>

      {/* Container wrap for admin/dashboard/etc. */}
      <div ref={containerRef} className="app-container-main">
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                >
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <DashboardLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                >
                  <Contact />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/blogs"
            element={
              <ProtectedRoute>
                <DashboardLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                >
                  <Blogs />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/agents"
            element={
              <ProtectedRoute>
                <DashboardLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                >
                  <Agents />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/CommunityGuide"
            element={
              <ProtectedRoute>
                <DashboardLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                >
                  <CommunityGuides />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/dashboard-layout" element={<DashboardLayout />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/referral-tracking" element={<ReferralTracking />} />
        </Routes>
      </div>
    </PropertyProvider>
  );
}

export default App;