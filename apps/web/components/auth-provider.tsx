'use client';

import { usePathname } from 'next/navigation';
import { useAuthChangeListener } from '@kit/supabase/hooks/use-auth-change-listener';

import pathsConfig from '~/config/paths.config';

export function AuthProvider(props: React.PropsWithChildren) {
  const pathname = usePathname();
  
  // Skip auth change listening on marketing pages to prevent interference
  const isMarketingPage = pathname === '/' || 
                         pathname.startsWith('/contact') || 
                         pathname.startsWith('/faq') || 
                         pathname.startsWith('/blog') ||
                         pathname.startsWith('/privacy-policy') ||
                         pathname.startsWith('/terms-of-service') ||
                         pathname.startsWith('/cookie-policy');

  // Pass the marketing page flag to the hook so it can decide whether to listen
  useAuthChangeListener({
    appHomePath: pathsConfig.app.home,
    skipOnMarketingPages: isMarketingPage,
  });

  return props.children;
}
