/**
 * File: app/Navbar.tsx
 * Purpose: Re-exports the refactored Navbar component from components directory
 * Author: Alejo Cagliolo
 * Date: 5/25/25
 * Version: 2.0.0
 */

export { Navbar as default } from '@/components/common/Navigation/Navbar';

/**
 * Change Log:
 * 06/15/25 - Version 1.4.0
 * - Removed top padding to eliminate white space between navbar and hero
 * - Increased logo size by removing width constraint
 * - Made navbar elements larger and more responsive
 * - Added responsive text sizes for navigation items
 * - Improved spacing and padding for different screen sizes
 * - Enhanced mobile menu button sizing
 * - Added z-index for proper layering
 * 
 * 06/11/25 - Version 1.3.0
 * - Added Solutions page to navigation items
 * - Updated navigation order for better user flow
 * 
 * 06/11/25 - Version 1.2.0
 * - Added mobile menu with hamburger button
 * - Improved responsive design for all screen sizes
 * - Added smooth animations for mobile menu
 * - Enhanced accessibility with proper ARIA labels
 * - Improved touch targets for mobile devices
 * - Added proper spacing and padding for mobile view
 * 
 * 06/11/25 - Version 1.1.0
 * - Enhanced documentation with detailed component information
 * - Added comprehensive state management documentation
 * - Improved code readability with additional comments
 * - Added dependency documentation
 * 
 * 5/25/25 - Initial version
 * - Created responsive navigation bar
 * - Implemented hover animations with Framer Motion
 * - Added authentication links
 * - Integrated gradient effects
 * - Enhanced mobile responsiveness
 * - Added sticky positioning
 * - Implemented backdrop blur effect
 */
