import { use } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { PageBody, PageHeader } from '@kit/ui/page';
import { Badge } from '@kit/ui/badge';

import { getVerificationWithImages } from '@kit/accounts/utils/verification-helpers';
import { requireUserInServerComponent } from '~/lib/server/require-user-in-server-component';

export default function AdminVerificationPage() {
  const user = use(requireUserInServerComponent());

  return (
    <>
      <PageHeader title="Verification Submissions" />
      <PageBody>
        <VerificationDisplay userId={user.id} />
      </PageBody>
    </>
  );
}

async function VerificationDisplay({ userId }: { userId: string }) {
  const verification = await getVerificationWithImages(userId);

  if (!verification) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">No verification requests found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Verification Request
            <Badge variant={
              verification.status === 'approved' ? 'success' : 
              verification.status === 'rejected' ? 'destructive' : 'warning'
            }>
              {verification.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Full Name</p>
              <p className="text-sm text-muted-foreground">{verification.full_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Phone Number</p>
              <p className="text-sm text-muted-foreground">{verification.phone_number}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Submitted</p>
              <p className="text-sm text-muted-foreground">
                {new Date(verification.submitted_at).toLocaleString()}
              </p>
            </div>
            {verification.reviewed_at && (
              <div>
                <p className="text-sm font-medium">Reviewed</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(verification.reviewed_at).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Photo */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Photo</CardTitle>
          </CardHeader>
          <CardContent>
            {verification.personalPhotoViewUrl ? (
              <img 
                src={verification.personalPhotoViewUrl} 
                alt="Personal photo"
                className="w-full max-w-sm rounded-lg border"
              />
            ) : (
              <p className="text-muted-foreground">Unable to load image</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Storage path: {verification.personal_photo_url}
            </p>
          </CardContent>
        </Card>

        {/* ID Document */}
        <Card>
          <CardHeader>
            <CardTitle>Government ID</CardTitle>
          </CardHeader>
          <CardContent>
            {verification.idDocumentViewUrl ? (
              <img 
                src={verification.idDocumentViewUrl} 
                alt="Government ID"
                className="w-full max-w-sm rounded-lg border"
              />
            ) : (
              <p className="text-muted-foreground">Unable to load document</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Storage path: {verification.id_document_url}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}