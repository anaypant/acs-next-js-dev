// Last Modified: 2025-04-14 by AI Assistant

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';
import type { User } from '../types/auth';

// Constants for User Dropdown
const PROFILE_PATH = "/profile";
const SETTINGS_PATH = "/settings";
const PROFILE_TEXT = "Profile";
const SETTINGS_TEXT = "Settings";
const LOGOUT_TEXT = "Sign Out";

interface UserDropdownProps {
  user: User; // Pass the user object provided by useAuth
  onLogout: () => Promise<void>; // Pass the logout function from useAuth
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    if (mounted && dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [dropdownOpen, mounted, handleClickOutside]);

  const handleLogoutClick = async () => {
    setDropdownOpen(false);
    await onLogout();
  };

  const handleLinkClick = () => {
    setDropdownOpen(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div ref={dropdownRef} className="relative">
      {/* User Avatar / Button */}
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        aria-label="User menu"
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
        className="flex items-center px-3 py-2 bg-[#33354A] text-gray-100 rounded-full shadow-sm hover:bg-[#454766] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1B1C28] focus:ring-[#8FA1D0] transition-all"
      >
        {/* Display user initial or avatar if available, fallback to icon */}
        {user?.profileImageUrl ? (
           <img src={user.profileImageUrl} alt="User avatar" className="w-6 h-6 rounded-full" />
        ) : user?.email ? (
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#4B5C99] text-xs font-semibold">
                {user.email.charAt(0).toUpperCase()}
            </span>
        ) : (
            <FaUserCircle size={20} /> // Smaller icon for button fit
        )}
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button" // Link button to menu for accessibility
          className="absolute right-0 mt-2 w-48 origin-top-right bg-[#24253A] border border-[#33354A] rounded-md shadow-lg z-50 ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <ul className="py-1 text-sm text-gray-300" role="none">
             {/* Optional: Display user email */}
             {user?.email && (
                <li className="px-4 py-2 text-xs text-gray-400 border-b border-[#33354A]">
                    Signed in as<br/>
                    <span className="font-medium text-gray-200">{user.email}</span>
                </li>
             )}
            <li>
              <Link
                href={PROFILE_PATH}
                onClick={handleLinkClick}
                className="block px-4 py-2 hover:bg-[#33354A] transition-colors"
                role="menuitem"
              >
                {PROFILE_TEXT}
              </Link>
            </li>
            <li>
              <Link
                href={SETTINGS_PATH}
                onClick={handleLinkClick}
                className="block px-4 py-2 hover:bg-[#33354A] transition-colors"
                role="menuitem"
              >
                {SETTINGS_TEXT}
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogoutClick}
                className="block w-full text-left px-4 py-2 text-red-400 hover:bg-[#33354A] hover:text-red-300 transition-colors"
                role="menuitem"
              >
                {LOGOUT_TEXT}
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;