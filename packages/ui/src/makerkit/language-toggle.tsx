'use client';

import { useMemo } from 'react';

import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { cn } from '../lib/utils';
import { Button } from '../shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../shadcn/dropdown-menu';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
];

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const handleLanguageChange = async (languageCode: string) => {
    // Set language cookie
    document.cookie = `lang=${languageCode}; path=/; max-age=31536000`;

    // Change language using i18n
    await i18n.changeLanguage(languageCode);

    // Refresh the page to apply the new language
    window.location.reload();
  };

  const Items = useMemo(() => {
    return LANGUAGES.map((language) => {
      const isSelected = currentLanguage === language.code;

      return (
        <DropdownMenuItem
          className={cn('flex items-center', {
            'bg-muted': isSelected,
          })}
          key={language.code}
          onClick={() => handleLanguageChange(language.code)}
        >
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>{language.name}</span>
          </div>
        </DropdownMenuItem>
      );
    });
  }, [currentLanguage]);

  // Get the current language letter/symbol
  const getCurrentLanguageSymbol = () => {
    if (currentLanguage === 'ar') {
      return 'العربية'; // Arabic
    }
    return 'EN'; // English
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={cn("h-9 px-2", className)}>
          <div className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            <span className="text-sm font-medium">{getCurrentLanguageSymbol()}</span>
          </div>
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">{Items}</DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SubMenuLanguageToggle() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const handleLanguageChange = async (languageCode: string) => {
    // Set language cookie
    document.cookie = `lang=${languageCode}; path=/; max-age=31536000`;

    // Change language using i18n
    await i18n.changeLanguage(languageCode);

    // Refresh the page to apply the new language
    window.location.reload();
  };

  const MenuItems = useMemo(
    () =>
      LANGUAGES.map((language) => {
        const isSelected = currentLanguage === language.code;

        return (
          <DropdownMenuItem
            className={cn('flex cursor-pointer items-center', {
              'bg-muted': isSelected,
            })}
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
          >
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>{language.name}</span>
            </div>
          </DropdownMenuItem>
        );
      }),
    [currentLanguage],
  );

  // Get the current language symbol for submenu
  const getCurrentLanguageSymbol = () => {
    if (currentLanguage === 'ar') {
      return 'العربية'; // Arabic
    }
    return 'EN'; // English
  };

  return (
    <>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger
          className={
            'hidden w-full items-center justify-between gap-x-3 lg:flex'
          }
        >
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="font-medium">{getCurrentLanguageSymbol()}</span>
          </div>
        </DropdownMenuSubTrigger>

        <DropdownMenuSubContent>{MenuItems}</DropdownMenuSubContent>
      </DropdownMenuSub>

      <div className={'lg:hidden'}>
        <DropdownMenuLabel className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span>{getCurrentLanguageSymbol()}</span>
        </DropdownMenuLabel>
        {MenuItems}
      </div>
    </>
  );
}