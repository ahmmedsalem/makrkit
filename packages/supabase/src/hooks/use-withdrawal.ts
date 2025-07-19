import { useMutation } from '@tanstack/react-query';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import { useUser } from '@kit/supabase/hooks/use-user';

type WithdrawalParams = {
  amount: number;
  paymentMethod: 'paypal' | 'stripe' | 'bank' | 'crypto';
  paypalEmail?: string;
  paypalConfirm?: string;
  stripeEmail?: string;
  bankAccountNumber?: string;
  iban?: string;
  bankName?: string;
  bankAccountHolderName?: string;
  cryptoWalletAddress?: string;
  cryptoCoinType?: 'bitcoin' | 'ethereum' | 'usdt' | 'usdc';
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

    // Validate fields based on payment method
    if (params.paymentMethod === 'paypal') {
      if (!params.paypalEmail || !params.paypalConfirm || params.paypalEmail !== params.paypalConfirm) {
        throw new Error('PayPal emails must match');
      }
    }
    if (params.paymentMethod === 'stripe') {
      if (!params.stripeEmail) {
        throw new Error('Stripe email is required');
      }
    }
    if (params.paymentMethod === 'bank') {
      if (!params.bankAccountNumber || !params.iban || !params.bankName || !params.bankAccountHolderName) {
        throw new Error('Bank account details are required');
      }
    }
    if (params.paymentMethod === 'crypto') {
      if (!params.cryptoWalletAddress || !params.cryptoCoinType) {
        throw new Error('Crypto wallet address and coin type are required');
      }
    }

    // Prepare payment details
    let paymentDetails: Record<string, any>;
    switch (params.paymentMethod) {
      case 'paypal':
        paymentDetails = { email: params.paypalEmail };
        break;
      case 'stripe':
        paymentDetails = { email: params.stripeEmail };
        break;
      case 'bank':
        paymentDetails = {
          account_number: params.bankAccountNumber,
          iban: params.iban,
          bank_name: params.bankName,
          account_holder_name: params.bankAccountHolderName,
        };
        break;
      case 'crypto':
        paymentDetails = {
          wallet_address: params.cryptoWalletAddress,
          coin_type: params.cryptoCoinType,
        };
        break;
      default:
        paymentDetails = { method: params.paymentMethod };
    }

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