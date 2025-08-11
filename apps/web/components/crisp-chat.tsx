'use client';

import { useEffect } from 'react';

interface CrispChatProps {
  websiteId: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  } | null;
}

declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}

export function CrispChat({ websiteId, user }: CrispChatProps) {
  useEffect(() => {
    // Set the website ID
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = websiteId;

    // Create and append the Crisp script
    const script = document.createElement('script');
    script.src = 'https://client.crisp.chat/l.js';
    script.async = true;
    document.head.appendChild(script);

    // Set user identification when script loads
    script.onload = () => {
      if (user && window.$crisp) {
        // Push user data to Crisp
        window.$crisp.push(['set', 'user:email', user.email]);
        window.$crisp.push(['set', 'user:nickname', user.name || user.email]);
        
        // Set user data for identification
        window.$crisp.push(['set', 'session:data', [
          ['user_id', user.id],
          ['email', user.email],
          ...(user.name ? [['name', user.name]] : [])
        ]]);
      }
    };

    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Remove the script when component unmounts
      const existingScript = document.querySelector('script[src="https://client.crisp.chat/l.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
      
      // Clean up global variables
      delete window.$crisp;
      delete window.CRISP_WEBSITE_ID;
    };
  }, [websiteId, user]);

  // Update user data when user changes (login/logout)
  useEffect(() => {
    if (window.$crisp) {
      if (user) {
        // User logged in - set user data
        window.$crisp.push(['set', 'user:email', user.email]);
        window.$crisp.push(['set', 'user:nickname', user.name || user.email]);
        window.$crisp.push(['set', 'session:data', [
          ['user_id', user.id],
          ['email', user.email],
          ...(user.name ? [['name', user.name]] : [])
        ]]);
      } else {
        // User logged out - reset user data
        window.$crisp.push(['reset']);
      }
    }
  }, [user]);

  // This component doesn't render anything visible
  return null;
}