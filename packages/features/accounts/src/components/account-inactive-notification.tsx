'use client';

import Link from 'next/link';

import { AlertTriangle } from 'lucide-react';

import { Alert, AlertDescription } from '@kit/ui/alert';
import { Button } from '@kit/ui/button';
import { Trans } from '@kit/ui/trans';

export interface AccountInactiveNotificationProps {
  className?: string;
}

export function AccountInactiveNotification({ 
  className 
}: AccountInactiveNotificationProps) {
  return (
    <Alert className={`border-destructive/50 bg-destructive/10 ${className || ''}`}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between w-full">
        <span className="flex-1">
          <Trans i18nKey="account:inactiveProfileMessage" 
                defaults="Your profile is inactive until verification is completed. Please verify your account to access all features." />
        </span>
        <Button 
          asChild 
          size="sm" 
          variant="destructive"
          className="ml-4 shrink-0"
        >
          <Link href="/home/verify">
            <Trans i18nKey="account:verifyAccount" defaults="Verify Account" />
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}