'use client';

import React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Link from 'next/link';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  top: 0,
  width: '100%',
  zIndex: 1100,
  background: 'radial-gradient(circle at 0% 50%, rgba(19,121,84,0.35) 0%, rgba(10,47,31,0.85) 70%, rgba(10,47,31,0.95) 100%)',
  boxShadow: 'none',
  minHeight: '40px',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundBlendMode: 'overlay',
  backgroundRepeat: 'no-repeat',
  fontFamily: 'Inter, Arial, Helvetica, sans-serif',
}));

const StyledToolbar = styled(Toolbar)({
  justifyContent: 'center',
  minHeight: '40px',
  paddingLeft: 0,
  paddingRight: 0,
});

const TopBar = () => {
  return (
    <StyledAppBar position="fixed" className="shadow-none">
      <StyledToolbar variant="dense" className="justify-center min-h-[40px] px-0">
        <div className="flex items-center justify-center gap-8 w-full font-inter">
          <span className="bg-white text-[#0A2F1F] text-xs font-semibold rounded-full px-4 py-1 shadow-sm cursor-pointer hover:bg-[#38b88b] hover:text-white transition border border-[#e0e0e0] tracking-[0.02em]">
            Post
          </span>
          <span className="text-white text-xs font-medium cursor-pointer hover:underline transition tracking-[0.02em]">
            Chat with Us
          </span>
          <Link href="/learn-more" className="text-xs font-medium underline cursor-pointer transition-colors duration-200 !text-[#38b88b] !hover:text-white tracking-[0.02em]">
            Learn more
          </Link>
        </div>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default TopBar; 