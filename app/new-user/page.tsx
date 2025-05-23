'use client';

// This page is currently disabled and will be used in the future to handle new user onboarding
// Redirecting to dashboard instead

import { redirect } from 'next/navigation';

export default function NewUserPage() {
  redirect('/dashboard');
}

/*
Original implementation commented out for future use:

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { config } from '@/lib/local-api-config';
import { goto404 } from '../utils/error';
import { useEffect, useState } from 'react';

export default function NewUserPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responseEmail, setResponseEmail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (status === 'unauthenticated') {
          goto404('401', 'No active session found', router);
          return;
        }

        if (!session?.user?.email) {
          return;
        }

        const response = await fetch(`${config.API_URL}/db/select`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            table_name: 'Users',
            key_name: 'id',
            key_value: session.user.email,
          }),
        });

        if (!response.ok) {
          throw new Error(`Database query failed with status ${response.status}`);
        }

        const result = await response.json();
        if (Array.isArray(result) && result.length > 1) {
          goto404('500', 'Multiple entries found for this user', router);
          return;
        }
        setData(result[0] || null);
        setResponseEmail(result[0]?.responseEmail || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
        // goto404('500', 'Failed to fetch user data', router);
      } finally {
        setLoading(false);
      }
    };

    if (status !== 'loading') {
      fetchData();
    }
  }, [session, status, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A2F1F] text-white p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A2F1F] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Welcome New User!</h1>
        <div className="bg-white/10 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4"><span className="text-gray-300">Your Account Information</span></h2>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Your ACS Mail is:</label>
            <p className="text-sm text-gray-400 mb-2">This is the domain ACS has created for you. It will be the default, but you can customize the domain to another domain of your choosing.</p>
            <input
              type="email"
              className="w-full p-2 rounded bg-black/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={responseEmail}
              onChange={e => setResponseEmail(e.target.value)}
              placeholder="Enter your response email"
            />
            <button
              className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
              onClick={() => { }} // Custom logic for this button will be added in the future
              type="button"
            >
              Customize
            </button>
          </div>
          <pre className="bg-black/20 p-4 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
*/
