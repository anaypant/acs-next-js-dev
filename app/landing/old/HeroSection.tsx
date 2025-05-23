// // Last Modified: 2025-04-14 by AI Assistant

// 'use client';

// import React, { useState, useRef, useEffect } from 'react';
// import Image from 'next/image';
// import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import Link from 'next/link';
// import { Button, ButtonProps } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import { HERO_CONSTANTS } from '../constants/hero';
// import Lottie from 'lottie-react';

// // Create styled components to avoid hydration issues
// const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
//   textTransform: 'none',
//   '&.MuiButton-outlined': {
//     borderColor: '#38b88b',
//     color: '#137954',
//     backgroundColor: 'rgba(255,255,255,0.92)',
//     fontWeight: 700,
//     boxShadow: '0 2px 8px 0 rgba(56,184,139,0.08)',
//     '&:hover': {
//       borderColor: '#38b88b',
//       backgroundColor: 'rgba(56,184,139,0.10)',
//       color: '#0A2F1F',
//     }
//   },
//   '&.MuiButton-contained': {
//     background: 'linear-gradient(90deg, #38b88b 0%, #137954 100%)',
//     color: 'white',
//     fontWeight: 700,
//     boxShadow: '0 4px 16px 0 rgba(56,184,139,0.15)',
//     '&:hover': {
//       background: 'linear-gradient(90deg, #4fd1a5 0%, #38b88b 100%)',
//       color: 'white',
//       boxShadow: '0 6px 24px 0 rgba(56,184,139,0.18)',
//     }
//   }
// }));

// const features = [
//   'Pricing Prediction',
//   'Virtual Staging',
//   'Marketing Optimization',
//   'Automated Lead Scoring',
//   'Lorem Ipsum',
// ];

// const NavDropdown = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
//   return (
//     <div 
//       className={`absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#d1e7dd] py-2 z-50 transform transition-all duration-200 ease-out ${
//         isOpen 
//           ? 'opacity-100 translate-y-0' 
//           : 'opacity-0 -translate-y-2 pointer-events-none'
//       }`}
//     >
//       {children}
//     </div>
//   );
// };

// const NavItem = ({ title, children }: { title: string; children: React.ReactNode }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const toggleDropdown = (e: React.MouseEvent) => {
//     e.preventDefault();
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <button 
//         onClick={toggleDropdown}
//         className="text-base font-bold text-[#137954] hover:text-[#38b88b] px-4 py-1.5 flex items-center gap-1 group bg-white/80 hover:bg-[#e6f7f0] rounded-full border border-[#d1e7dd] shadow-sm transition-all duration-200"
//       >
//         {title}
//         <KeyboardArrowDownIcon 
//           className={`text-[#137954] group-hover:text-[#38b88b] transition-colors duration-200 ${isOpen ? 'rotate-180' : ''}`} 
//         />
//       </button>
//       <NavDropdown isOpen={isOpen} onClose={() => setIsOpen(false)}>
//         {children}
//       </NavDropdown>
//     </div>
//   );
// };

// const DropdownItem = ({ href, children }: { href: string; children: React.ReactNode }) => (
//   <Link 
//     href={href}
//     className="block px-4 py-2 text-sm text-[#0A2F1F] hover:bg-[#e6f7f0] transition-colors duration-200"
//   >
//     {children}
//   </Link>
// );

// const HeroSection: React.FC = () => {
//   const suggestions = HERO_CONSTANTS.SEARCH_SUGGESTIONS;
//   const [placeholderIdx, setPlaceholderIdx] = useState(0);
//   const [fade, setFade] = useState(true);
//   const [inputValue, setInputValue] = useState("");
//   const [animationData, setAnimationData] = useState(null);
//   const lottieRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     // TEST: Fetch a known-good public Lottie animation
//     fetch('/animations/house-sketch.json')
//       .then(response => response.json())
//       .then(data => setAnimationData(data))
//       .catch(error => console.error('Error loading test animation:', error));
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setFade(false);
//       setTimeout(() => {
//         setPlaceholderIdx((prev) => (prev + 1) % suggestions.length);
//         setFade(true);
//       }, 350); // fade out duration
//     }, 2500);
//     return () => clearInterval(interval);
//   }, [suggestions.length]);

//   useEffect(() => {
//     if (lottieRef.current) {
//       const svg = lottieRef.current.querySelector('svg');
//       if (svg && svg instanceof SVGElement) {
//         svg.style.border = '2px solid yellow';
//       }
//     }
//   }, [animationData]);

//   return (
//     <div className="relative min-h-screen w-full overflow-hidden bg-[#f7faf9] grid-background shadow-xl flex flex-col font-inter">
//       {/* Subtle grid background */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a2f1f08_1px,transparent_1px),linear-gradient(to_bottom,#0a2f1f08_1px,transparent_1px)] bg-[size:3rem_3rem]" />
//       </div>
//       {/* Add this overlay div as the first child inside the main HeroSection container */}
//       <div className="absolute inset-0 z-0 pointer-events-none">
//         <div className="w-full h-full bg-gradient-to-b from-black/20 via-white/0 to-white/30" />
//       </div>
//       {/* Stronger vignette overlay */}
//       <div className="absolute inset-0 z-20 pointer-events-none">
//         <div
//           className="w-full h-full"
//           style={{
//             background:
//               'radial-gradient(ellipse at center, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.82) 100%, transparent 60%)',
//             maskImage:
//               'radial-gradient(ellipse at center, transparent 60%, black 100%)',
//             WebkitMaskImage:
//               'radial-gradient(ellipse at center, transparent 60%, black 100%)',
//           }}
//         />
//       </div>
//       {/* Bottom vignette overlay to reduce whiteness in the middle-bottom */}
//       <div className="pointer-events-none absolute left-0 right-0 bottom-0 z-30 h-2/3 w-full">
//         <div
//           className="w-full h-full"
//           style={{
//             background:
//               'linear-gradient(0deg, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.18) 40%, transparent 90%)',
//           }}
//         />
//       </div>
//       {/* Navbar inside HeroSection */}
//       <div className="relative z-30 px-2 sm:px-4 pt-3 pb-2">
//         <div className="flex items-center justify-between">
//           <div className="ml-16">
//             <Link href="/" className="relative flex items-center group">
//               <span
//                 className="text-5xl font-extrabold bg-gradient-to-r from-gray-200 via-emerald-400 to-emerald-900 bg-[length:200%_200%] bg-clip-text text-transparent drop-shadow-sm px-2 animate-gradient-move"
//                 style={{ WebkitBackgroundClip: 'text', backgroundClip: 'text' }}
//               >
//                 ACS
//                 <sup className="text-xs align-super ml-1 text-emerald-900 drop-shadow-sm">™</sup>
//               </span>
//             </Link>
//           </div>
//           <div className="flex items-center gap-2 sm:gap-4">
//             <NavItem title="Home">
//               <DropdownItem href="/home/overview">Overview</DropdownItem>
//               <DropdownItem href="/home/features">Features</DropdownItem>
//               <DropdownItem href="/home/pricing">Pricing</DropdownItem>
//               <DropdownItem href="/home/about">About Us</DropdownItem>
//             </NavItem>
//             <Link 
//               href="/solutions" 
//               className=" !important text-base font-bold text-[#137954] hover:text-[#38b88b] px-4 py-1.5 flex items-center gap-1 group bg-white/80 hover:bg-[#e6f7f0] rounded-full border border-[#d1e7dd] shadow-sm transition-all duration-200"
//             >
//               Solutions
//             </Link>
//             <Link 
//               href="/case-studies" 
//               className=" !important text-base font-bold text-[#137954] hover:text-[#38b88b] px-4 py-1.5 flex items-center gap-1 group bg-white/80 hover:bg-[#e6f7f0] rounded-full border border-[#d1e7dd] shadow-sm transition-all duration-200"
//             >
//               Case Studies
//             </Link>
//             <NavItem title="Contact">
//               <DropdownItem href="/contact/support">Support</DropdownItem>
//               <DropdownItem href="/contact/sales">Sales</DropdownItem>
//               <DropdownItem href="/contact/partners">Partners</DropdownItem>
//               <DropdownItem href="/contact/feedback">Feedback</DropdownItem>
//             </NavItem>
//           </div>
//           <div className="flex items-center gap-3 mr-12">
//             <StyledButton
//               component={Link as any}
//               href="/login"
//               variant="outlined"
//               className="px-3 py-1 text-base rounded-lg"
//             > 
//               Login
//             </StyledButton>
//             <StyledButton
//               component={Link as any}
//               href="/signup"
//               variant="contained"
//               className="px-3 py-1 text-base rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
//             >
//               Sign up
//             </StyledButton>
//           </div>
//         </div>
//       </div>
      
//       {/* Main hero content centered */}
//       <div>
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-12 gap-x-8 items-start h-full w-full max-w-none px-4 sm:px-8 md:px-16 xl:px-32 mt-8 md:mt-12">
//           {/* Left column */}
//           <div className="space-y-6 lg:pr-16 max-w-3xl w-full">

//             {/* Hero Title */}
//             <div className='p-4'>
//             <h1 className="text-[2.2rem] xs:text-[2.8rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] xl:text-[6rem] font-extrabold leading-[1.05] font-montserrat animate-hero-title"
//               style={{ textShadow: '0 4px 24px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.18)' }}
//             >
//               {/* Empowering */}
//               <span 
//                 className="font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow-lg tracking-wide"
//                 style={{ textShadow: '0 4px 24px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.18)' }}
//               >
//                 Empowering
//               </span>
//               <br />
//               {/* Realtors with AI */}
//               <span 
//                 className="font-black not-italic inline-block whitespace-nowrap text-[2rem] xs:text-[2.5rem] sm:text-[3.2rem] md:text-[4.2rem] lg:text-[5rem] leading-[1.1] bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow-xl tracking-tight"
//                 style={{ textShadow: '0 4px 24px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.18)' }}
//               >
//                 realtors with {' '}
//                 <span className="bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-900 bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-move-passive" style={{ textShadow: '0 4px 24px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.18)' }}>AI</span>
//               </span>
//             </h1>
//             </div>

//             {/* Get Started / Learn More Buttons */}
//             <div className='my-8 flex flex-row gap-12 items-center justify-center'>
//               <button className="bg-emerald-600 text-white text-lg sm:text-xl font-bold rounded-lg px-8 sm:px-10 py-3 sm:py-4 shadow-2xl hover:bg-emerald-400 transition-all duration-200 flex items-center gap-3 group overflow-hidden relative cursor-pointer">
//                 <span className="transition-transform duration-300 group-hover:translate-x-1">Get Started</span>
//                 <svg className="w-6 h-6 text-white transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                 </svg>
//               </button>
//               <a href="/home/overview" className="relative inline-flex items-center px-8 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl font-bold rounded-lg border-2 border-emerald-600 text-emerald-700 bg-white shadow-2xl transition-all duration-200 group overflow-hidden ml-2 hover:bg-emerald-50 focus:outline-none">
//                 <span className="relative z-10 transition-colors duration-300 group-hover:text-emerald-900">Learn More</span>
//                 <span className="absolute left-0 bottom-0 w-0 h-1 bg-emerald-400 transition-all duration-300 group-hover:w-full z-0" />
//               </a>
//             </div>
            
//             {/* Search Bar */}
//             <div className='flex flex-row w-full items-center justify-center py-12'>
//               <div className="relative w-full max-w-2xl">
//                 <input
//                   type="text"
//                   value={inputValue}
//                   onChange={e => setInputValue(e.target.value)}
//                   className="w-full px-7 py-4 text-lg bg-white/30 backdrop-blur-xl border border-emerald-900 rounded-full shadow-md focus:outline-none focus:border-emerald-600 transition-all duration-200 text-emerald-900"
//                   style={{ boxShadow: '0 4px 24px 0 rgba(56,184,139,0.08)' }}
//                 />
//                 {/* Animated placeholder overlay */}
//                 {inputValue === "" && (
//                   <span
//                     className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 text-lg text-emerald-900 select-none transition-opacity duration-300 opacity-50"
//                     style={{ opacity: fade ? 1 : 0 }}
//                   >
//                     {suggestions[placeholderIdx]}
//                   </span>
//                 )}
//                 <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
//                   <svg className="w-6 h-6 text-emerald-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* Right column */}
//           <div className="flex flex-col justify-center lg:justify-end items-center lg:items-end mt-10 lg:mt-0 w-full max-w-2xl ml-auto">
//             {/* <div className='w-full max-w-lg p-4'>
//             <p className="text-base sm:text-lg md:text-xl text-sky-900 max-w-lg italic text-center lg:text-center bg-white/90 rounded-xl shadow-lg px-8 py-6 border border-[#b6e2f1] backdrop-blur-sm lg:mx-0">
//               Leverage AI to generate real-time business solutions and make informed decisions faster than ever.
//             </p>
//             </div> */}
//             <div 
//               className="pt-8 md:pt-12 lg:pt-16 relative w-full h-[18rem] sm:h-[24rem] md:h-[28rem] max-w-[16rem] sm:max-w-[22rem] md:max-w-[26rem] drop-shadow-2xl rounded-3xl overflow-hidden mx-auto"
//             >
//               {/*
//               {animationData ? (
//                 <Lottie
//                   animationData={animationData}
//                   loop={true}
//                   autoplay={true}
//                   className="w-full h-full"
//                   style={{ 
//                     backdropFilter: 'blur(8px)',
//                     borderRadius: '1.5rem',
//                     padding: '1rem',
//                     position: 'relative',
//                     zIndex: 101,
//                     transform: 'scale(2)'
//                   }}
//                 />
//               ) : (
//                 <p className="absolute inset-0 flex items-center justify-center text-white" style={{ zIndex: 101 }}>
//                   Loading...
//                 </p>
//               )}
//               */}
//               <Image
//                 src="/mobile-phone-FIGMA.png"
//                 alt="AI Realtor Dashboard Phones"
//                 fill
//                 className="object-contain"
//                 sizes="(max-width: 420px) 100vw, 420px"
//                 priority
//                 unoptimized
//                 quality={100}
//                 onError={(e) => {
//                   console.error('Image failed to load:', e);
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HeroSection;