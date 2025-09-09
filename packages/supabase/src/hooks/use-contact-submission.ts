import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';

// Define the contact form data type
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Define the response type
export interface ContactApplicationResponse {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'resolved';
  created_at: string;
  updated_at: string;
}

/**
 * Hook to submit contact form data
 */
export function useContactSubmission() {
  const client = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ContactFormData): Promise<ContactApplicationResponse> => {
      console.log('🚀 Submitting contact form:', data);

      // Validate required fields
      if (!data.name || !data.email || !data.subject || !data.message) {
        throw new Error('All fields are required');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Insert into contact_applications table
      const { data: contactApplication, error } = await client
        .from('contact_applications')
        .insert({
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          subject: data.subject.trim(),
          message: data.message.trim(),
          status: 'new'
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Contact submission error:', error);
        throw new Error(error.message || 'Failed to submit contact form');
      }

      if (!contactApplication) {
        throw new Error('Failed to create contact application');
      }

      console.log('✅ Contact application created:', contactApplication);
      return contactApplication;
    },
    onSuccess: (data) => {
      console.log('✅ Contact form submitted successfully:', data);
      
      // Invalidate any relevant queries if needed
      queryClient.invalidateQueries({
        queryKey: ['contact-applications'],
      });
    },
    onError: (error) => {
      console.error('💥 Contact submission failed:', error);
    },
  });
}

/**
 * Hook to fetch contact applications (for admin use)
 */
export function useContactApplications() {
  const client = useSupabase();

  return {
    queryKey: ['contact-applications'],
    queryFn: async (): Promise<ContactApplicationResponse[]> => {
      const { data, error } = await client
        .from('contact_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
  };
}