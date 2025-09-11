'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { SignInMethodsContainer } from '@kit/auth/sign-in';
import { SignUpMethodsContainer } from '@kit/auth/sign-up';
import { Heading } from '@kit/ui/heading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@kit/ui/tabs';
import { Trans } from '@kit/ui/trans';

import authConfig from '~/config/auth.config';
import pathsConfig from '~/config/paths.config';

const signInPaths = {
  callback: pathsConfig.auth.callback,
  home: pathsConfig.app.home,
};

const signUpPaths = {
  callback: pathsConfig.auth.callback,
  appHome: pathsConfig.app.home,
};

function AuthPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>(() => {
    // Default to sign-up, but allow URL params to override
    const tab = searchParams.get('tab');
    return tab === 'signin' ? 'signin' : 'signup';
  });

  // Determine where to redirect after successful sign-in
  const nextPath = searchParams.get('next');
  const returnPath = nextPath === '/' || nextPath?.startsWith('/faq') || nextPath?.startsWith('/contact') 
    ? '/' 
    : pathsConfig.app.home;

  const dynamicSignInPaths = {
    ...signInPaths,
    home: returnPath,
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signup">
          <Trans i18nKey={'auth:signUp'} />
        </TabsTrigger>
        <TabsTrigger value="signin">
          <Trans i18nKey={'auth:signIn'} />
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="signup" className="space-y-6">
        <Heading level={5} className={'tracking-tight text-center'}>
          <Trans i18nKey={'auth:signUpHeading'} />
        </Heading>

        <SignUpMethodsContainer
          providers={authConfig.providers}
          displayTermsCheckbox={authConfig.displayTermsCheckbox}
          paths={signUpPaths}
        />
      </TabsContent>
      
      <TabsContent value="signin" className="space-y-6">
        <Heading level={5} className={'tracking-tight text-center'}>
          <Trans i18nKey={'auth:signInHeading'} />
        </Heading>

        <SignInMethodsContainer 
          paths={dynamicSignInPaths} 
          providers={authConfig.providers} 
        />
      </TabsContent>
    </Tabs>
  );
}

export default AuthPage;