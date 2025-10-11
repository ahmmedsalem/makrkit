'use client';

import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@kit/supabase/browser-client';

export function SessionDebug() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    supabase.auth.getSession().then(({ data, error }) => {
      console.log('🔍 Client session data:', data);
      console.log('🔍 Client error:', error);
      if (error) {
        setError(error.message);
      }
      setSession(data.session);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">Loading session...</div>;

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded mb-4">
      <h3 className="font-bold mb-2">🔍 Session Debug (Client-side):</h3>
      {error && (
        <div className="text-sm text-red-500 mb-2">
          <p>⚠️ Error: {error}</p>
        </div>
      )}
      {session ? (
        <div className="text-sm space-y-1">
          <p className="text-green-600 font-semibold">✅ Session exists on client</p>
          <p>User: {session.user?.email}</p>
          <p className="text-xs text-gray-500">User ID: {session.user?.id}</p>
        </div>
      ) : (
        <p className="text-red-500 font-semibold">❌ No session found on client</p>
      )}
    </div>
  );
}
