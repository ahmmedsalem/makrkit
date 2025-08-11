'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { cn } from '../lib/utils';
import {
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '../shadcn/dropdown-menu';
import { Trans } from './trans';

export function ModeToggle(props: { className?: string }) {
  const { setTheme, theme } = useTheme();
  
  const isDark = theme === 'dark';

  const handleToggle = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
    setCookeTheme(newTheme);
  };

  return (
    <button
      onClick={handleToggle}
      className={cn("flex items-center justify-center p-2 rounded-md hover:bg-muted transition-colors", props.className)}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}

export function SubMenuModeToggle() {
  const { setTheme, theme } = useTheme();
  
  const isDark = theme === 'dark';

  const handleToggle = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
    setCookeTheme(newTheme);
  };

  return (
    <>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger
          className={
            'hidden w-full items-center justify-between gap-x-3 lg:flex'
          }
        >
          <span className={'flex space-x-2'}>
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}

            <span>
              <Trans i18nKey={'common:theme'} />
            </span>
          </span>
        </DropdownMenuSubTrigger>

        <DropdownMenuSubContent>
          <button
            onClick={handleToggle}
            className="p-2 hover:bg-muted rounded-md transition-colors w-full flex items-center justify-center"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </DropdownMenuSubContent>
      </DropdownMenuSub>

      <div className={'lg:hidden'}>
        <DropdownMenuLabel>
          <Trans i18nKey={'common:theme'} />
        </DropdownMenuLabel>
        
        <div className="px-2 py-1">
          <button
            onClick={handleToggle}
            className="hover:bg-muted rounded-md transition-colors w-full p-1 flex items-center justify-center"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}

function setCookeTheme(theme: string) {
  document.cookie = `theme=${theme}; path=/; max-age=31536000`;
}
