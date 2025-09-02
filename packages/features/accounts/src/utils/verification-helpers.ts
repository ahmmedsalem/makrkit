import { getSupabaseServerClient } from '@kit/supabase/server-client';

export async function getVerificationImageUrl(storagePath: string): Promise<string | null> {
  const supabase = getSupabaseServerClient();
  
  try {
    const { data } = await supabase.storage
      .from('verification_documents')
      .createSignedUrl(storagePath, 3600); // 1 hour expiry

    return data?.signedUrl || null;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }
}

export async function getVerificationRequest(userId: string) {
  const supabase = getSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('verification_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching verification request:', error);
    return null;
  }

  return data;
}

export async function getVerificationWithImages(userId: string) {
  const verification = await getVerificationRequest(userId);
  
  if (!verification) {
    return null;
  }

  const [personalPhotoUrl, idDocumentUrl] = await Promise.all([
    getVerificationImageUrl(verification.personal_photo_url),
    getVerificationImageUrl(verification.id_document_url),
  ]);

  return {
    ...verification,
    personalPhotoViewUrl: personalPhotoUrl,
    idDocumentViewUrl: idDocumentUrl,
  };
}