import { useMutation } from '@tanstack/react-query';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import { useUser } from '@kit/supabase/hooks/use-user';

type WithdrawalParams = {
  amount: number;
  paymentMethod: 'paypal' | 'stripe' | 'bank' | 'crypto';
  paypalEmail?: string;
  paypalConfirm?: string;
};

/**
 * @name useCreateWithdrawal
 * @description Use Supabase to create a withdrawal request
 */
export function useCreateWithdrawal() {
  const client = useSupabase();
  const { data: user } = useUser();
  const mutationKey = ['supabase:withdrawal'];

  // Generate unique request ID
  const generateRequestId = (): string => {
    return `WD${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  };

  // Calculate processing fee based on payment method
  const calculateProcessingFee = (amount: number, paymentMethod: string): number => {
    const fees = {
      paypal: 0.029, // 2.9%
      stripe: 0.029, // 2.9%
      bank: 5.0, // $5 flat fee
      crypto: 0.005, // 0.5%
    };
    const feeRate = fees[paymentMethod as keyof typeof fees] || 0;
    return paymentMethod === 'bank' ? feeRate : amount * feeRate;
  };

  const mutationFn = async (params: WithdrawalParams) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log('🚀 Creating withdrawal with data:', params);
    console.log('👤 User ID:', user.id);

    // Validate PayPal emails
    if (params.paymentMethod === 'paypal') {
      if (!params.paypalEmail || !params.paypalConfirm || params.paypalEmail !== params.paypalConfirm) {
        throw new Error('PayPal emails must match');
      }
    }

    // Prepare payment details
    const paymentDetails: Record<string, any> = params.paymentMethod === 'paypal'
      ? { email: params.paypalEmail }
      : { method: params.paymentMethod };

    // Calculate processing fee and net amount
    const processingFee = calculateProcessingFee(params.amount, params.paymentMethod);
    const netAmount = params.amount - processingFee;
    const requestId = generateRequestId();

    console.log('💰 Processing fee:', processingFee);
    console.log('💵 Net amount:', netAmount);
    console.log('🆔 Request ID:', requestId);

    // Insert withdrawal into Supabase
    const withdrawalData = {
      user_id: user.id,
      amount: params.amount,
      payment_method: params.paymentMethod,
      payment_details: paymentDetails,
      request_id: requestId,
      processing_fee: processingFee,
      net_amount: netAmount,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    console.log('📝 Withdrawal data to insert:', withdrawalData);

    const { data, error } = await client
      .from('withdrawals')
      .insert(withdrawalData)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw new Error(`Database error: ${error.message}`);
    }

    console.log('✅ Withdrawal created successfully:', data);
    return data;
  };

  return useMutation({
    mutationKey,
    mutationFn,
  });
}
