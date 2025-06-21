/**
 * File: app/dashboard/contacts/page.tsx
 * Purpose: Renders the contacts dashboard for managing and viewing client information with search and filtering capabilities.
 * Author: Alejo Cagliolo
 * Date: 5/25/25
 * Version: 1.0.0
 */

"use client"
import { ArrowLeft, Search, Calendar, Filter, Plus, Phone, Mail, MapPin, Building2, User2, Briefcase, Home } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Logo } from "@/app/utils/Logo"
import { ErrorBoundary } from '@/components/common/Feedback/ErrorBoundary';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/common/Feedback/LoadingSpinner';
import ContactsContent from './ContactsContent';

/**
 * ContactsPage Component
 * Main contacts dashboard component for managing client information
 * 
 * Features:
 * - Contact search and filtering
 * - Contact type and status indicators
 * - Contact details display
 * - Last contact tracking
 * 
 * @returns {JSX.Element} Complete contacts dashboard
 */
export default function ContactsPage() {
  return (
    <div className="h-full overflow-hidden">
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <ContactsContent />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

/**
 * Change Log:
 * 5/25/25 - Initial version
 * - Created contacts dashboard with grid view
 * - Implemented contact search and filtering
 * - Added contact status and type indicators
 * - Integrated contact details display
 * - Added responsive design for all screen sizes
 */
