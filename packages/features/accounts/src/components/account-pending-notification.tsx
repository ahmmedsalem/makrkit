'use client';

import { Clock } from 'lucide-react';

import { Alert, AlertDescription } from '@kit/ui/alert';
import { Trans } from '@kit/ui/trans';

export interface AccountPendingNotificationProps {
  className?: string;
}

export function AccountPendingNotification({ 
  className 
}: AccountPendingNotificationProps) {
  return (
    <Alert className={`border-warning/50 bg-warning/10 ${className || ''}`}>
      <AlertDescription>
        <div className="flex items-start gap-2">
          <Clock className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-medium">
              <Trans i18nKey="account:statusPending" defaults="Account Under Review" />
            </span>
            <span className="block text-sm mt-1">
              <Trans 
                i18nKey="account:pendingMessage" 
                defaults="Your verification request is being reviewed. You will be notified via email once your account is approved. This process typically takes 1-2 business days." 
              />
            </span>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}