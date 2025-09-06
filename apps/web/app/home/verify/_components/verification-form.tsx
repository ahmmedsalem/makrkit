'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import type { User } from '@supabase/supabase-js';

import { CheckCircle, Upload, User as UserIcon, Mail, Phone, Camera } from 'lucide-react';

import { usePersonalAccountData, useRevalidatePersonalAccountDataQuery } from '@kit/accounts/hooks/use-personal-account-data';
import { Button } from '@kit/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kit/ui/card';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';
import { PhoneInput } from '@kit/ui/phone-input';
import { Alert, AlertDescription } from '@kit/ui/alert';
import { Trans } from '@kit/ui/trans';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import { toast } from '@kit/ui/sonner';

export interface VerificationFormProps {
  user: User;
}

export function VerificationForm({ user }: VerificationFormProps) {
  const router = useRouter();
  const supabase = useSupabase();
  const personalAccountData = usePersonalAccountData(user.id);
  const revalidateAccountData = useRevalidatePersonalAccountDataQuery();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user.user_metadata?.name || '',
    phoneNumber: personalAccountData?.data?.phone_number || user.phone || '',
    idDocument: null as File | null,
    personalPhoto: null as File | null,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (field: 'idDocument' | 'personalPhoto', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const uploadFile = async (file: File, folder: 'personal_photos' | 'id_documents') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${folder}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('verification_documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    return data.path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required files
      if (!formData.personalPhoto || !formData.idDocument) {
        toast.error(
          <Trans i18nKey="account:filesRequired" defaults="Please upload both personal photo and government ID document." />
        );
        return;
      }

      // Upload files to storage
      const [personalPhotoPath, idDocumentPath] = await Promise.all([
        uploadFile(formData.personalPhoto, 'personal_photos'),
        uploadFile(formData.idDocument, 'id_documents')
      ]);

      // Create verification request
      const { error: insertError } = await supabase
        .from('verification_requests')
        .insert({
          user_id: user.id,
          account_id: user.id,
          full_name: formData.fullName,
          phone_number: formData.phoneNumber,
          personal_photo_url: personalPhotoPath,
          id_document_url: idDocumentPath,
          status: 'pending'
        });

      if (insertError) {
        throw insertError;
      }

      // Update account status to pending
      const { error: updateError } = await supabase
        .from('accounts')
        .update({ 
          status: 'pending',
          phone_number: formData.phoneNumber 
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Invalidate the account data cache to trigger immediate UI update
      revalidateAccountData(user.id);

      toast.success(
        <Trans i18nKey="account:verificationSubmissionSuccess" defaults="Verification request submitted successfully! We will review your submission and notify you once approved." />
      );
      
      // Redirect back to home after a short delay to show the updated status
      setTimeout(() => {
        router.push('/home');
      }, 2000);
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(
        <Trans i18nKey="account:verificationSubmissionError" defaults="Failed to submit verification request. Please try again." />
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          <Trans i18nKey="account:accountVerification" defaults="Account Verification" />
        </CardTitle>
        <CardDescription>
          <Trans 
            i18nKey="account:verificationInstructions" 
            defaults="Please provide the following information to verify your account. This process helps us ensure the security of our platform." 
          />
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Display */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <Trans i18nKey="common:email" defaults="Email" />
            </Label>
            <Input
              id="email"
              type="email"
              value={user.email || ''}
              disabled
              className="bg-muted"
            />
            <p className="text-sm text-muted-foreground">
              <Trans i18nKey="account:emailVerified" defaults="Your email is already verified" />
            </p>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">
              <Trans i18nKey="account:fullName" defaults="Full Name" /> <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              required
              placeholder="Enter your full legal name"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <Trans i18nKey="account:phoneNumber" defaults="Phone Number" /> <span className="text-destructive">*</span>
            </Label>
            <PhoneInput
              value={formData.phoneNumber}
              onChange={(value) => handleInputChange('phoneNumber', value)}
              placeholder="50 123 4567"
              defaultCountryCode="+971"
            />
            <p className="text-sm text-muted-foreground">
              <Trans i18nKey="account:phoneNumberHelp" defaults="Your phone number for verification purposes" />
            </p>
          </div>

          {/* Personal Photo Upload */}
          <div className="space-y-2">
            <Label htmlFor="personalPhoto" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              <Trans i18nKey="account:personalPhoto" defaults="Personal Photo" /> <span className="text-destructive">*</span>
            </Label>
            <Input
              id="personalPhoto"
              type="file"
              onChange={(e) => handleFileChange('personalPhoto', e)}
              accept="image/*"
              required
              className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            <p className="text-sm text-muted-foreground">
              <Trans 
                i18nKey="account:personalPhotoHelp" 
                defaults="Upload a clear photo of yourself to verify identity matches the government ID" 
              />
            </p>
          </div>

          {/* ID Document Upload */}
          <div className="space-y-2">
            <Label htmlFor="idDocument" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <Trans i18nKey="account:idDocument" defaults="Government ID Document" /> <span className="text-destructive">*</span>
            </Label>
            <Input
              id="idDocument"
              type="file"
              onChange={(e) => handleFileChange('idDocument', e)}
              accept="image/*,.pdf"
              required
              className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            <p className="text-sm text-muted-foreground">
              <Trans 
                i18nKey="account:idDocumentHelp" 
                defaults="Please upload a clear photo of your government-issued ID (passport, driver's license, etc.)" 
              />
            </p>
          </div>

          {/* Info Alert */}
          <Alert>
            <AlertDescription>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <Trans 
                  i18nKey="account:verificationProcessInfo" 
                  defaults="Your verification request will be reviewed within 1-2 business days. You will be notified via email once your account is approved." 
                />
              </div>
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <Trans i18nKey="account:submittingVerification" defaults="Submitting..." />
              ) : (
                <Trans i18nKey="account:submitVerification" defaults="Submit for Verification" />
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/home')}
              disabled={isSubmitting}
            >
              <Trans i18nKey="common:cancel" defaults="Cancel" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}