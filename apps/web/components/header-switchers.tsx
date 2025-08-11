'use client';

import dynamic from 'next/dynamic';

import { If } from '@kit/ui/if';

import featuresFlagConfig from '~/config/feature-flags.config';

const ModeToggle = dynamic(() =>
  import('@kit/ui/mode-toggle').then((mod) => ({
    default: mod.ModeToggle,
  })),
);

const LanguageToggle = dynamic(() =>
  import('@kit/ui/language-toggle').then((mod) => ({
    default: mod.LanguageToggle,
  })),
);

export function HeaderSwitchers() {
  return (
    <div className={'flex items-center space-x-2'}>
      <LanguageToggle />
      
      <If condition={featuresFlagConfig.enableThemeToggle}>
        <ModeToggle />
      </If>
    </div>
  );
}