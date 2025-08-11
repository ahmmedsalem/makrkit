'use client';

import { useTranslation } from 'react-i18next';

import { cn } from '../lib/utils';
import {
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '../shadcn/dropdown-menu';

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

  const isArabic = currentLanguage === 'ar';

  const handleToggle = () => {
    const newLanguage = isArabic ? 'en' : 'ar';
    handleLanguageChange(newLanguage);
  };

  return (
    <button
      onClick={handleToggle}
      className={cn("px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium", className)}
      aria-label={`Switch to ${isArabic ? 'English' : 'Arabic'}`}
    >
      {isArabic ? 'EN' : 'العربية'}
    </button>
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

  const isArabic = currentLanguage === 'ar';

  const handleToggle = () => {
    const newLanguage = isArabic ? 'en' : 'ar';
    handleLanguageChange(newLanguage);
  };

  // Get the next language symbol for submenu trigger
  const getNextLanguageSymbol = () => {
    if (currentLanguage === 'ar') {
      return 'EN'; // Show EN when Arabic is current
    }
    return 'العربية'; // Show Arabic when English is current
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
            <span className="font-medium">{getNextLanguageSymbol()}</span>
          </div>
        </DropdownMenuSubTrigger>

        <DropdownMenuSubContent>
          <button
            onClick={handleToggle}
            className="p-2 hover:bg-muted rounded-md transition-colors w-full text-sm font-medium"
            aria-label={`Switch to ${isArabic ? 'English' : 'Arabic'}`}
          >
            {isArabic ? 'EN' : 'العربية'}
          </button>
        </DropdownMenuSubContent>
      </DropdownMenuSub>

      <div className={'lg:hidden'}>
        <DropdownMenuLabel>
          <span>Language</span>
        </DropdownMenuLabel>
        
        <div className="px-2 py-1">
          <button
            onClick={handleToggle}
            className="hover:bg-muted rounded-md transition-colors w-full p-1 text-sm font-medium"
            aria-label={`Switch to ${isArabic ? 'English' : 'Arabic'}`}
          >
            {isArabic ? 'EN' : 'العربية'}
          </button>
        </div>
      </div>
    </>
  );
}