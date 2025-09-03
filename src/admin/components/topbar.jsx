import { useState, useRef, useEffect } from "react";
import { Search, Bell, Menu, Sun, Moon, LogOut, User, Settings } from "lucide-react";
import "../styles/topbar.css";

export default function Topbar({ onMenuClick, isDarkMode, onToggleDarkMode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false);
        setIsSearchFocused(false);
        if (searchRef.current) {
          searchRef.current.blur();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleProfileMenuToggle = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Add your search logic here
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
    setIsProfileMenuOpen(false);
    // Add your profile navigation logic here
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
    setIsProfileMenuOpen(false);
    // Add your settings navigation logic here
  };

  const handleLogoutClick = () => {
    console.log('Logout clicked');
    setIsProfileMenuOpen(false);
    // Add your logout logic here
  };

  const handleNotificationClick = () => {
    console.log('Notifications clicked');
    // Add your notification logic here
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button 
          className="icon-button menu-button" 
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu />
          <span className="sr-only">Toggle menu</span>
        </button>
        
        {/* <form className="search-container" onSubmit={handleSearchSubmit}>
          <input
            ref={searchRef}
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            className={`search-input2 ${isSearchFocused ? 'search-focused' : ''}`}
            aria-label="Search"
          />
        </form> */}
      </div>

      <div className="topbar-right">
        <button 
          className="icon-button" 
          onClick={onToggleDarkMode}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun /> : <Moon />}
          <span className="sr-only">Toggle dark mode</span>
        </button>

        <button 
          className="icon-button" 
          onClick={handleNotificationClick}
          aria-label="Notifications"
        >
          <Bell />
          <span className="sr-only">Notifications</span>
        </button>

        <div className="profile-dropdown" ref={dropdownRef}>
          <button 
            className="avatar-button" 
            onClick={handleProfileMenuToggle}
            aria-label="User menu"
            aria-expanded={isProfileMenuOpen}
            aria-haspopup="true"
          >
            <img 
              src="/placeholder.svg?height=32&width=32" 
              alt="User avatar" 
              className="avatar"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div 
              className="avatar-loading" 
              style={{ display: 'none' }}
            >
              <User size={16} />
            </div>
          </button>
          
          {isProfileMenuOpen && (
            <div className="dropdown-menu" role="menu">
              <div className="dropdown-header">My Account</div>
              <div className="dropdown-divider"></div>
              
              <button 
                className="dropdown-item" 
                onClick={handleProfileClick}
                role="menuitem"
              >
                <User className="dropdown-icon" />
                <span>Profile</span>
              </button>
              
              <button 
                className="dropdown-item" 
                onClick={handleSettingsClick}
                role="menuitem"
              >
                <Settings className="dropdown-icon" />
                <span>Settings</span>
              </button>
              
              <div className="dropdown-divider"></div>
              
              <button 
                className="dropdown-item logout" 
                onClick={handleLogoutClick}
                role="menuitem"
              >
                <LogOut className="dropdown-icon" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}