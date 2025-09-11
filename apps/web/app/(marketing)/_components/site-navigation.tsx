'use client';

import Link from 'next/link';

import type { User } from '@supabase/supabase-js';
import { Menu, Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@kit/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuList } from '@kit/ui/navigation-menu';
import { Trans } from '@kit/ui/trans';

import { useFilteredNavigation } from '~/home/_components/use-filtered-navigation';
import pathsConfig from '~/config/paths.config';

import { SiteNavigationItem } from './site-navigation-item';

/**
 * Add your navigation links here
 *
 * @example
 *
 * {
 *   FAQ: {
 *     label: 'marketing:faq',
 *     path: '/faq',
 *   },
 *   Pricing: {
 *     label: 'marketing:pricing',
 *     path: '/pricing',
 *   },
 * }
 */

const basicLinks: Record<
  string,
  {
    label: string;
    path: string;
  }
> = {
  Home: {
    label: 'common:routes.home',
    path: '/',
  },
  Contact: {
    label: 'common:routes.contact',
    path: '/contact',
  },
};

const authenticatedLinks: Record<
  string,
  {
    label: string;
    path: string;
  }
> = {
  Dashboard: {
    label: 'common:routes.home',
    path: pathsConfig.app.home,
  },
  Market: {
    label: 'common:routes.marketNews',
    path: pathsConfig.app.marketNews,
  },
  Screener: {
    label: 'common:routes.screener',
    path: pathsConfig.app.screener,
  },
  Wallet: {
    label: 'common:routes.wallet', 
    path: pathsConfig.app.wallet,
  },
  Contact: {
    label: 'common:routes.contact',
    path: '/contact',
  },
};

export function SiteNavigation({ user }: { user: User | null }) {
  return (
    <>
      <div className={'hidden items-center justify-center md:flex'}>
        {/* Desktop navigation is hidden */}
      </div>

      <div className={'flex justify-start sm:items-center md:hidden'}>
        <MobileDropdown user={user} />
      </div>
    </>
  );
}

function MobileDropdown({ user }: { user: User | null }) {
  const { setTheme, theme } = useTheme();
  const { i18n } = useTranslation();
  
  const isDark = theme === 'dark';
  const isArabic = i18n.language === 'ar';

  // Determine which links to show
  let linksToShow;
  
  if (!user) {
    // For non-authenticated users, show basic links
    linksToShow = basicLinks;
  } else {
    // For authenticated users, check access and filter accordingly
    const filteredNavigation = useFilteredNavigation(user.id);
    
    // Get allowed paths from filtered navigation
    const allowedPaths = new Set<string>();
    filteredNavigation.routes.forEach((section: any) => {
      if ('children' in section) {
        section.children.forEach((route: any) => {
          if ('path' in route) {
            allowedPaths.add(route.path);
          }
        });
      }
    });

    // Debug: log allowed paths
    console.log('Mobile nav - allowed paths:', Array.from(allowedPaths));
    console.log('Mobile nav - user id:', user.id);

    // Filter authenticated links based on allowed paths
    linksToShow = Object.fromEntries(
      Object.entries(authenticatedLinks).filter(([key, link]) => {
        // Always show Dashboard and Contact
        if (key === 'Dashboard' || key === 'Contact') return true;
        // Show only if path is in allowed paths
        const isAllowed = allowedPaths.has(link.path);
        console.log(`Mobile nav - ${key} (${link.path}): ${isAllowed}`);
        return isAllowed;
      })
    );
  }

  const handleToggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
    // Set cookie for theme persistence
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000`;
  };

  const handleToggleLanguage = async () => {
    const newLanguage = isArabic ? 'en' : 'ar';
    await i18n.changeLanguage(newLanguage);
    // Set cookie for language persistence
    document.cookie = `lang=${newLanguage}; path=/; max-age=31536000`;
    // Refresh to apply language changes
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={'Open Menu'}>
        <Menu className={'h-8 w-8'} />
      </DropdownMenuTrigger>

      <DropdownMenuContent className={'w-56'} align={isArabic ? "end" : "start"} side="bottom">
        {/* Navigation Links */}
        {Object.values(linksToShow).map((item) => {
          const className = `flex w-full h-full items-center ${isArabic ? 'justify-end text-right' : 'justify-start text-left'}`;

          return (
            <DropdownMenuItem key={item.path} asChild>
              <Link className={className} href={item.path}>
                <Trans i18nKey={item.label} />
              </Link>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />

        {/* Theme Switcher */}
        <DropdownMenuLabel className={`px-2 py-1.5 text-sm font-medium ${isArabic ? 'text-right' : 'text-left'}`}>
          <Trans i18nKey={'common:theme'} />
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={handleToggleTheme}>
          <div className={`flex w-full items-center gap-2 ${isArabic ? 'flex-row-reverse justify-start' : 'flex-row justify-start'}`}>
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span>
              {isDark ? (
                <Trans i18nKey={'common:lightTheme'} />
              ) : (
                <Trans i18nKey={'common:darkTheme'} />
              )}
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Language Switcher */}
        <DropdownMenuLabel className={`px-2 py-1.5 text-sm font-medium ${isArabic ? 'text-right' : 'text-left'}`}>
          Language
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={handleToggleLanguage}>
          <div className={`flex w-full items-center gap-2 ${isArabic ? 'flex-row-reverse justify-start' : 'flex-row justify-start'}`}>
            <Globe className="h-4 w-4" />
            <span>
              {isArabic ? 'English' : 'العربية'}
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
