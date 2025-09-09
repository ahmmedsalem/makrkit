'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useState } from 'react';
import { z } from 'zod';

import { Button } from '@kit/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@kit/ui/form';
import { Input } from '@kit/ui/input';
import { Textarea } from '@kit/ui/textarea';
import { Trans } from '@kit/ui/trans';
import { useTranslation } from 'react-i18next';
import { useContactSubmission } from '@kit/supabase/hooks/use-contact-submission';

import { SitePageHeader } from '../_components/site-page-header';

// Schema for contact form validation
const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof ContactSchema>;

export default function ContactPage() {
  const { t } = useTranslation('common');
  const contactSubmission = useContactSubmission();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      console.log('Contact form data:', data);
      
      await contactSubmission.mutateAsync(data);
      
      toast.success(t('contact.messageSent'));
      form.reset();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(errorMessage || t('contact.messageError'));
    }
  };

  return (
    <div className="flex flex-col space-y-8">
      <SitePageHeader
        title={<Trans i18nKey={'common:contact.title'} />}
        subtitle={<Trans i18nKey={'common:contact.subtitle'} />}
      />

      <div className="container mx-auto max-w-2xl px-4">
        <div className="w-full">
          {/* Contact Form */}
          <div className="bg-background border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">
              <Trans i18nKey={'common:contact.getInTouch'} />
            </h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Trans i18nKey={'common:contact.name'} />
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('contact.namePlaceholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Trans i18nKey={'common:contact.email'} />
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t('contact.emailPlaceholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Trans i18nKey={'common:contact.subject'} />
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('contact.subjectPlaceholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Trans i18nKey={'common:contact.message'} />
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('contact.messagePlaceholder')}
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={contactSubmission.isPending}
                  className="w-full"
                >
                  {contactSubmission.isPending ? (
                    <Trans i18nKey={'common:contact.sending'} />
                  ) : (
                    <Trans i18nKey={'common:contact.sendMessage'} />
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}