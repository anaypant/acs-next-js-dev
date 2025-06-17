'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { ShieldX, LogOut, Home } from 'lucide-react';

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Clear all cookies
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });

      // Sign out from NextAuth
      await signOut({ 
        callbackUrl: '/',
        redirect: false 
      });

      // Redirect to homepage
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
      // Force redirect even if there's an error
      router.push('/');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <ShieldX className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Session Expired
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Your session has expired or you don't have permission to access this resource. 
            Please log in again to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            size="lg"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out & Clear Session
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 