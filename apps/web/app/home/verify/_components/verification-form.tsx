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
import { useTranslation } from 'react-i18next';

export interface VerificationFormProps {
  user: User;
}

export function VerificationForm({ user }: VerificationFormProps) {
  const router = useRouter();
  const supabase = useSupabase();
  const { t, i18n } = useTranslation(['account']);
  const personalAccountData = usePersonalAccountData(user.id);
  const revalidateAccountData = useRevalidatePersonalAccountDataQuery();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user.user_metadata?.name || '',
    phoneNumber: personalAccountData?.data?.phone_number || user.phone || '',
    idDocument: null as File | null,
    personalPhoto: null as File | null,
  });
  const [errors, setErrors] = useState({
    fullName: '',
    phoneNumber: '',
    personalPhoto: '',
    idDocument: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileChange = (field: 'idDocument' | 'personalPhoto', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
      // Clear error when file is selected
      if (errors[field]) {
        setErrors(prev => ({
          ...prev,
          [field]: ''
        }));
      }
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
      // Clear previous errors
      setErrors({
        fullName: '',
        phoneNumber: '',
        personalPhoto: '',
        idDocument: '',
      });

      let hasErrors = false;
      const newErrors = {
        fullName: '',
        phoneNumber: '',
        personalPhoto: '',
        idDocument: '',
      };

      // Validate all required fields
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'fullNameRequired';
        hasErrors = true;
      }

      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = 'phoneNumberRequired';
        hasErrors = true;
      }

      if (!formData.personalPhoto) {
        newErrors.personalPhoto = 'personalPhotoRequired';
        hasErrors = true;
      }

      if (!formData.idDocument) {
        newErrors.idDocument = 'idDocumentRequired';
        hasErrors = true;
      }

      if (hasErrors) {
        setErrors(newErrors);
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
              <Trans i18nKey="account:email" defaults="Email" />
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
              placeholder={t('fullNamePlaceholder')}
              className={errors.fullName ? "border-destructive" : ""}
            />
            {errors.fullName && (
              <p className="text-sm text-destructive">
                <Trans i18nKey={`account:${errors.fullName}`} />
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <Trans i18nKey="account:phoneNumber" defaults="Phone Number" /> <span className="text-destructive">*</span>
            </Label>
            <div className={i18n.language === 'ar' ? '[&_input]:text-right [&_input]:dir-rtl' : ''}>
              <PhoneInput
                value={formData.phoneNumber}
                onChange={(value) => handleInputChange('phoneNumber', value)}
                placeholder={t('phoneNumberPlaceholder')}
                defaultCountryCode="+971"
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-sm text-destructive">
                <Trans i18nKey={`account:${errors.phoneNumber}`} />
              </p>
            )}
          </div>

          {/* Personal Photo Upload */}
          <div className="space-y-2">
            <Label htmlFor="personalPhoto" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              <Trans i18nKey="account:personalPhoto" defaults="Personal Photo" /> <span className="text-destructive">*</span>
            </Label>
            <div className={`relative ${errors.personalPhoto ? "border border-destructive rounded-md" : ""}`}>
              <Input
                id="personalPhoto"
                type="file"
                onChange={(e) => handleFileChange('personalPhoto', e)}
                accept="image/*"
                className="sr-only"
              />
              <Label
                htmlFor="personalPhoto"
                className={`flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors ${errors.personalPhoto ? "border-destructive" : "border-muted-foreground/25"}`}
              >
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">
                  {formData.personalPhoto ? (
                    <span className="text-foreground">{formData.personalPhoto.name}</span>
                  ) : (
                    <span className="text-muted-foreground">
                      <Trans i18nKey="account:choosePersonalPhoto" />
                    </span>
                  )}
                </span>
              </Label>
            </div>
            {errors.personalPhoto ? (
              <p className="text-sm text-destructive">
                <Trans i18nKey={`account:${errors.personalPhoto}`} />
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                <Trans 
                  i18nKey="account:personalPhotoHelp" 
                  defaults="Upload a clear photo of yourself to verify identity matches the government ID" 
                />
              </p>
            )}
          </div>

          {/* ID Document Upload */}
          <div className="space-y-2">
            <Label htmlFor="idDocument" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <Trans i18nKey="account:idDocument" defaults="Government ID Document" /> <span className="text-destructive">*</span>
            </Label>
            <div className={`relative ${errors.idDocument ? "border border-destructive rounded-md" : ""}`}>
              <Input
                id="idDocument"
                type="file"
                onChange={(e) => handleFileChange('idDocument', e)}
                accept="image/*,.pdf"
                className="sr-only"
              />
              <Label
                htmlFor="idDocument"
                className={`flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors ${errors.idDocument ? "border-destructive" : "border-muted-foreground/25"}`}
              >
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">
                  {formData.idDocument ? (
                    <span className="text-foreground">{formData.idDocument.name}</span>
                  ) : (
                    <span className="text-muted-foreground">
                      <Trans i18nKey="account:chooseIdDocument" />
                    </span>
                  )}
                </span>
              </Label>
            </div>
            {errors.idDocument ? (
              <p className="text-sm text-destructive">
                <Trans i18nKey={`account:${errors.idDocument}`} />
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                <Trans 
                  i18nKey="account:idDocumentHelp" 
                  defaults="Please upload a clear photo of your government-issued ID (passport, driver's license, etc.)" 
                />
              </p>
            )}
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