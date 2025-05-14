// Last Modified: 2025-04-14 by AI Assistant

'use client';

import React from 'react';
import Image from 'next/image';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Link from 'next/link';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

// Create styled components to avoid hydration issues
const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
  textTransform: 'none',
  '&.MuiButton-outlined': {
    borderColor: '#0A2F1F',
    color: '#0A2F1F',
    '&:hover': {
      borderColor: '#0A2F1F',
      backgroundColor: 'rgba(10, 47, 31, 0.08)'
    }
  },
  '&.MuiButton-contained': {
    backgroundColor: '#0A2F1F',
    color: 'white',
    '&:hover': {
      backgroundColor: '#0D3B26'
    }
  }
}));

const features = [
  'Pricing Prediction',
  'Virtual Staging',
  'Marketing Optimization',
  'Automated Lead Scoring',
  'Lorem Ipsum',
];

const HeroSection: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#f7faf9] grid-background rounded-t-3xl shadow-xl flex flex-col font-inter">
      {/* Subtle grid background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a2f1f08_1px,transparent_1px),linear-gradient(to_bottom,#0a2f1f08_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      </div>
      {/* Navbar inside HeroSection */}
      <div className="relative z-10 px-2 sm:px-4 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="ml-16">
            <Link href="/" className="text-5xl acs-logo">
              ACS
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/" className="text-base font-bold text-[#137954] hover:text-[#38b88b] px-2 py-1 flex items-center gap-1 group">
              Home
              <KeyboardArrowDownIcon className="text-[#137954] group-hover:text-[#38b88b] transition-colors duration-200" />
            </Link>
            <Link href="/solutions" className="text-base font-bold text-[#137954] hover:text-[#38b88b] px-2 py-1 flex items-center gap-1 group">
              Solutions
              <KeyboardArrowDownIcon className="text-[#137954] group-hover:text-[#38b88b] transition-colors duration-200" />
            </Link>
            <Link href="/case-studies" className="text-base font-bold text-[#137954] hover:text-[#38b88b] px-2 py-1 flex items-center gap-1 group">
              Case Studies
              <KeyboardArrowDownIcon className="text-[#137954] group-hover:text-[#38b88b] transition-colors duration-200" />
            </Link>
            <Link href="/contact" className="text-base font-bold text-[#137954] hover:text-[#38b88b] px-2 py-1 flex items-center gap-1 group">
              Contact
              <KeyboardArrowDownIcon className="text-[#137954] group-hover:text-[#38b88b] transition-colors duration-200" />
            </Link>
          </div>
          <div className="flex items-center gap-3 mr-12">
            <StyledButton
              component={Link as any}
              href="/login"
              variant="outlined"
              className="px-3 py-1 text-base rounded-lg"
            > 
              Login
            </StyledButton>
            <StyledButton
              component={Link as any}
              href="/signup"
              variant="contained"
              className="px-3 py-1 text-base rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              Sign up
            </StyledButton>
          </div>
        </div>
      </div>
      {/* Main hero content centered */}
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-12 gap-x-8 items-start h-full w-full max-w-none px-4 sm:px-8 md:px-16 xl:px-32 mt-8 md:mt-12">
          {/* Left column */}
          <div className="space-y-6 lg:pr-16 max-w-3xl w-full">
            <h1 className="text-[2.2rem] xs:text-[2.8rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] xl:text-[6rem] font-bold italic text-[#137954] leading-[1.05] drop-shadow-md">
              <span className="italic font-bold text-[#137954] drop-shadow-[0_4px_16px_rgba(19,121,84,0.35)] text-[2.8rem] xs:text-[3.5rem] sm:text-[5rem] md:text-[6rem] lg:text-[7rem] leading-[1.1]">Empowering</span>
              <br />
              <span className="font-black not-italic text-[#0A2F1F] inline-block whitespace-nowrap text-[2rem] xs:text-[2.5rem] sm:text-[3.2rem] md:text-[4.2rem] lg:text-[5rem] leading-[1.1]">
                Realtors with AI
              </span>
            </h1>
            <button className="bg-[#0A2F1F] text-white text-lg sm:text-xl font-bold rounded-lg px-8 sm:px-10 py-3 sm:py-4 shadow-2xl hover:bg-[#134d36] transition-all duration-200">
              Get Started
            </button>
            {/* Features List - Modern Accordion Style */}
            <div className="mt-8 w-full max-w-full sm:max-w-xl divide-y divide-[#d1e7dd] bg-white/60 rounded-2xl shadow-lg border border-[#e0f2e9]">
              {features.map((feature, idx) => (
                <button
                  key={feature}
                  className="group w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 text-left focus:outline-none hover:bg-[#e6f7f0] transition-colors"
                  aria-expanded="false"
                >
                  <span className="flex items-center gap-3 text-[#0A2F1F] text-base sm:text-lg font-semibold">
                    <ArrowOutwardIcon fontSize="small" className="text-[#137954] group-hover:text-[#38b88b] transition-colors duration-200" />
                    {feature}
                  </span>
                  <span className="flex items-center justify-center w-7 h-7 rounded-full border border-[#b6e2d3] bg-white group-hover:bg-[#38b88b]/10 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 4V14" stroke="#137954" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M4 9H14" stroke="#137954" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </span>
                </button>
              ))}
            </div>
          </div>
          {/* Right column */}
          <div className="flex flex-col justify-center lg:justify-end items-center lg:items-end mt-10 lg:mt-0 w-full max-w-2xl ml-auto">
            <p className="pt-8 md:pt-12 lg:pt-16 text-base sm:text-lg md:text-xl text-[#0A2F1F]/80 max-w-md sm:max-w-lg md:max-w-xl italic text-center lg:text-right">
              Leverage AI to generate real-time business solutions and make informed decisions faster than ever.
            </p>
            <div className="pt-8 md:pt-12 lg:pt-16 relative w-full h-[18rem] sm:h-[24rem] md:h-[28rem] max-w-[16rem] sm:max-w-[22rem] md:max-w-[26rem] drop-shadow-2xl rounded-3xl overflow-hidden mx-auto">
              <Image
                src="/mobile-phone-FIGMA.png"
                alt="AI Realtor Dashboard Phones"
                fill
                className="object-contain"
                sizes="(max-width: 420px) 100vw, 420px"
                priority
                unoptimized
                quality={100}
                onError={(e) => {
                  console.error('Image failed to load:', e);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;