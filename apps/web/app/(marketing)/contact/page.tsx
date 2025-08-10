'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useState } from 'react';
import { z } from 'zod';
import { Mail, MapPin, Phone } from 'lucide-react';

import { Button } from '@kit/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@kit/ui/form';
import { Input } from '@kit/ui/input';
import { Textarea } from '@kit/ui/textarea';
import { Trans } from '@kit/ui/trans';
import { useTranslation } from 'react-i18next';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    
    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just simulate a successful submission
      console.log('Contact form data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(t('contact.messageSent'));
      form.reset();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error(t('contact.messageError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-8">
      <SitePageHeader
        title={<Trans i18nKey={'common:contact.title'} />}
        subtitle={<Trans i18nKey={'common:contact.subtitle'} />}
      />

      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <Trans i18nKey={'common:contact.sending'} />
                  ) : (
                    <Trans i18nKey={'common:contact.sendMessage'} />
                  )}
                </Button>
              </form>
            </Form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-6">
                <Trans i18nKey={'common:contact.contactInfo'} />
              </h2>
              <p className="text-muted-foreground mb-8">
                <Trans i18nKey={'common:contact.contactDescription'} />
              </p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 rounded-lg p-3">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">
                    <Trans i18nKey={'common:contact.emailTitle'} />
                  </h3>
                  <p className="text-muted-foreground">info@dragos-capital.net</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 rounded-lg p-3">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">
                    <Trans i18nKey={'common:contact.addressTitle'} />
                  </h3>
                  <p className="text-muted-foreground">
                    <Trans i18nKey={'common:contact.address'} />
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 rounded-lg p-3">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">
                    <Trans i18nKey={'common:contact.phoneTitle'} />
                  </h3>
                  <p className="text-muted-foreground">
                    <Trans i18nKey={'common:contact.phone'} />
                  </p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-medium mb-3">
                <Trans i18nKey={'common:contact.businessHours'} />
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span><Trans i18nKey={'common:contact.mondayFriday'} /></span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span><Trans i18nKey={'common:contact.saturday'} /></span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span><Trans i18nKey={'common:contact.sunday'} /></span>
                  <span><Trans i18nKey={'common:contact.closed'} /></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}