"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@kit/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@kit/ui/form";
import { Input } from "@kit/ui/input";
import { PageBody } from "@kit/ui/page";
import { LoadingOverlay } from "@kit/ui/loading-overlay";
import { Trans } from "@kit/ui/trans";
import { useTranslation } from "react-i18next";
import { useUser } from "@kit/supabase/hooks/use-user";
import { useCreateWithdrawal } from "@kit/supabase/hooks/use-withdrawal";
import { usePersonalAccountData } from "@kit/accounts/hooks/use-personal-account-data";
import { RequireActiveAccount } from "~/home/_components/require-active-account";

// Schema for form validation
const WithdrawalSchema = z
    .object({
        amount: z.number().min(10, "Minimum withdrawal amount is $10"),
        paymentMethod: z.enum(["paypal", "stripe", "bank", "crypto"], {
            required_error: "Please select a payment method",
        }),
        paypalEmail: z.string().email("Invalid email address").optional(),
        paypalConfirm: z.string().email("Invalid email address").optional(),
        stripeEmail: z.string().email("Invalid email address").optional(),
        bankAccountNumber: z.string().min(8, "Account number must be at least 8 characters").optional(),
        iban: z.string().min(15, "IBAN must be at least 15 characters").optional(),
        bankName: z.string().min(1, "Bank name is required").optional(),
        bankAccountHolderName: z.string().min(1, "Account holder name is required").optional(),
        cryptoWalletAddress: z.string().min(20, "Wallet address must be at least 20 characters").optional(),
        cryptoCoinType: z.enum(["bitcoin", "ethereum", "usdt", "usdc"], {
            required_error: "Please select a coin type",
        }).optional(),
    })
    .refine(
        (data) => {
            if (data.paymentMethod === "paypal") {
                return data.paypalEmail && data.paypalConfirm && data.paypalEmail === data.paypalConfirm;
            }
            if (data.paymentMethod === "stripe") {
                return data.stripeEmail;
            }
            if (data.paymentMethod === "bank") {
                return data.bankAccountNumber && data.iban && data.bankName && data.bankAccountHolderName;
            }
            if (data.paymentMethod === "crypto") {
                return data.cryptoWalletAddress && data.cryptoCoinType;
            }
            return true;
        },
        {
            message: "Required fields are missing or invalid for the selected payment method",
            path: ["paymentMethod"],
        }
    );

type WithdrawalFormData = z.infer<typeof WithdrawalSchema>;

export default function WithdrawPage() {
    const { t } = useTranslation('common');
    const { data: user, isPending: isUserPending, error: userError } = useUser();
    
    // Early returns BEFORE any other hooks to avoid hook order violations
    if (isUserPending) {
        console.log("⏳ User data is pending");
        return <LoadingOverlay fullPage={false} />;
    }

    if (!user) {
        console.log("❌ No user found");
        toast.error("Please log in to access this page");
        return null;
    }

    if (userError) {
        console.error("❌ User error:", userError);
        toast.error("Error loading user data");
        return null;
    }
    
    // Calculate last updated time (current time minus 1 hour 43 minutes)
    const getLastUpdatedTime = () => {
        const now = new Date();
        now.setHours(now.getHours() - 1);
        now.setMinutes(now.getMinutes() - 43);
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    
    const createWithdrawal = useCreateWithdrawal();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Now we know user exists, so we can safely call this hook
    const ProfileData = usePersonalAccountData(user.id);

    const form = useForm<WithdrawalFormData>({
        resolver: zodResolver(WithdrawalSchema),
        defaultValues: {
            amount: undefined,
            paymentMethod: undefined,
            paypalEmail: undefined,
            paypalConfirm: undefined,
            stripeEmail: undefined,
            bankAccountNumber: undefined,
            iban: undefined,
            bankName: undefined,
            bankAccountHolderName: undefined,
            cryptoWalletAddress: undefined,
            cryptoCoinType: undefined,
        },
    });

    const watchedPaymentMethod = form.watch("paymentMethod");

    const onSubmit = async (data: WithdrawalFormData) => {
        console.log("🚀 Form submit triggered with data:", data);
        setIsSubmitting(true);
        toast.info("Submitting withdrawal request...");

        try {
            // Validate form data
            const validatedData = WithdrawalSchema.parse(data);
            console.log("✅ Validated form data:", validatedData);

            // Prepare withdrawal data with user info
            const availableAmount = (ProfileData?.data?.amount_invested || 0) + (ProfileData?.data?.total_profit || 0);
            const withdrawalData = {
                ...validatedData,
                username: ProfileData?.data?.name || 'Unknown',
                userEmail: user.email || 'Unknown',
                availableAmount,
            };

            // Call mutation
            console.log("🔄 Calling createWithdrawal.mutateAsync...");
            const withdrawal = await createWithdrawal.mutateAsync(withdrawalData);
            console.log("✅ Withdrawal created:", withdrawal);

            toast.success(`Withdrawal request submitted successfully! ID: ${withdrawal.request_id}`);
            form.reset();
        } catch (error) {
            console.error("💥 Submission error:", error);
            if (error instanceof z.ZodError) {
                console.log("❌ Zod validation errors:", error.flatten());
                toast.error("Form validation failed. Please check your inputs and console for details.");
            } else if (error instanceof Error) {
                toast.error(`Error: ${error.message}`);
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        } finally {
            console.log("🏁 Submission complete, resetting isSubmitting");
            setIsSubmitting(false);
        }
    };

    const renderPaymentFields = () => {
        console.log("🎨 Rendering payment fields for:", watchedPaymentMethod);
        if (watchedPaymentMethod === "paypal") {
            return (
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                        </svg>
                        <h3 className="font-semibold">
                            <Trans i18nKey={'common:wallet.paypalDetails'} />
                        </h3>
                    </div>
                    <FormField
                        name="paypalEmail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <Trans i18nKey={'common:wallet.paypalEmail'} />
                                </FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="your-email@example.com" data-test="paypal-email" {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="paypalConfirm"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <Trans i18nKey={'common:wallet.confirmPaypalEmail'} />
                                </FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="Confirm your PayPal email" data-test="paypal-confirm" {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            );
        }
        if (watchedPaymentMethod === "stripe") {
            return (
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                        </svg>
                        <h3 className="font-semibold">
                            <Trans i18nKey={'common:wallet.stripeDetails'} />
                        </h3>
                    </div>
                    <FormField
                        name="stripeEmail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <Trans i18nKey={'common:wallet.stripeEmail'} />
                                </FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="your-email@example.com" data-test="stripe-email" {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            );
        }
        if (watchedPaymentMethod === "bank") {
            return (
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                        <h3 className="font-semibold">
                            <Trans i18nKey={'common:wallet.bankTransferDetails'} />
                        </h3>
                    </div>
                    <FormField
                        name="bankAccountNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <Trans i18nKey={'common:wallet.accountNumber'} />
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your bank account number" data-test="bank-account-number" {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="iban"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <Trans i18nKey={'common:wallet.iban'} />
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your IBAN (e.g., DE89370400440532013000)" data-test="bank-iban" {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="bankName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <Trans i18nKey={'common:wallet.bankName'} />
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your bank name" data-test="bank-name" {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="bankAccountHolderName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <Trans i18nKey={'common:wallet.accountHolderName'} />
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter the account holder's name" data-test="bank-account-holder-name" {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            );
        }
        if (watchedPaymentMethod === "crypto") {
            return (
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                        <h3 className="font-semibold">
                            <Trans i18nKey={'common:wallet.cryptoDetails'} />
                        </h3>
                    </div>
                    <FormField
                        name="cryptoWalletAddress"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <Trans i18nKey={'common:wallet.walletAddress'} />
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your cryptocurrency wallet address" data-test="crypto-wallet-address" {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="cryptoCoinType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <Trans i18nKey={'common:wallet.cryptoType'} />
                                </FormLabel>
                                <FormControl>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        data-test="crypto-coin-type"
                                        {...field}
                                        value={field.value ?? ""}
                                        onChange={(e) => field.onChange(e.target.value || undefined)}
                                    >
                                        <option value="">{t('wallet.selectCoinType')}</option>
                                        <option value="bitcoin">{t('wallet.bitcoin')}</option>
                                        <option value="ethereum">{t('wallet.ethereum')}</option>
                                        <option value="usdt">{t('wallet.tether')}</option>
                                        <option value="usdc">{t('wallet.usdCoin')}</option>
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            );
        }
        return null;
    };

    return (
        <PageBody>
            <RequireActiveAccount user={user}>
                <div className="flex flex-col space-y-8">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">
                        <Trans i18nKey={'common:wallet.title'} />
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        <Trans i18nKey={'common:wallet.description'} />
                    </p>
                </div>

                {/* Balance Display Section */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-medium opacity-90">
                                <Trans i18nKey={'common:wallet.availableBalance'} />
                            </h2>
                            <p className="text-3xl font-bold mt-1">
                                ${ProfileData?.data?.amount_invested && ProfileData?.data?.total_profit
                                    ? (ProfileData.data.amount_invested + ProfileData.data.total_profit).toFixed(2)
                                    : "0.00"}
                            </p>
                            <p className="text-sm opacity-75 mt-1">
                                <Trans 
                                    i18nKey={'common:wallet.lastUpdated'} 
                                    values={{ time: getLastUpdatedTime() }}
                                />
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="bg-white/20 rounded-lg p-3">
                                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Withdrawal Form */}
                <div className="lg:max-w-2xl">
                    <div className="bg-card border rounded-lg p-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold">
                                <Trans i18nKey={'common:wallet.requestWithdrawal'} />
                            </h2>
                            <p className="text-muted-foreground mt-1">
                                <Trans i18nKey={'common:wallet.withdrawalInstructions'} />
                            </p>
                        </div>

                        <Form {...form}>
                            <form
                                data-test="withdrawal-form"
                                className="flex flex-col space-y-4"
                                onSubmit={(e) => {
                                    form.handleSubmit(onSubmit)(e);
                                }}
                            >
                                <FormField
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans i18nKey={'common:wallet.withdrawalAmount'} />
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <svg
                                                            className="h-4 w-4 text-muted-foreground"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <Input
                                                        type="number"
                                                        placeholder="0.00"
                                                        className="pl-10"
                                                        min={10}
                                                        step={0.01}
                                                        data-test="withdrawal-amount"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || undefined)}
                                                    />
                                                </div>
                                            </FormControl>
                                            <p className="text-sm text-muted-foreground">
                                                <Trans 
                                                    i18nKey={'common:wallet.availableBalanceInfo'}
                                                    values={{
                                                        balance: ProfileData?.data?.amount_invested && ProfileData?.data?.total_profit
                                                            ? (ProfileData.data.amount_invested + ProfileData.data.total_profit).toFixed(2)
                                                            : "0.00"
                                                    }}
                                                />
                                            </p>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans i18nKey={'common:wallet.paymentMethod'} />
                                            </FormLabel>
                                            <FormControl>
                                                <select
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    data-test="payment-method"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    onChange={(e) => field.onChange(e.target.value || undefined)}
                                                >
                                                    <option value="">{t('wallet.selectPaymentMethod')}</option>
                                                    <option value="paypal">PayPal</option>
                                                    <option value="stripe">Stripe</option>
                                                    <option value="bank">{t('wallet.bankTransfer')}</option>
                                                    <option value="crypto">{t('wallet.cryptocurrency')}</option>
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {watchedPaymentMethod && renderPaymentFields()}

                                {watchedPaymentMethod && (
                                    <div className="bg-muted/50 border rounded-lg p-4">
                                        <h4 className="font-semibold mb-2">
                                            <Trans i18nKey={'common:wallet.processingInfo'} />
                                        </h4>
                                        <div className="text-sm text-muted-foreground">
                                            {watchedPaymentMethod === "paypal" && (
                                                <p>
                                                    <Trans i18nKey={'common:wallet.paypalProcessing'} />
                                                </p>
                                            )}
                                            {watchedPaymentMethod === "stripe" && (
                                                <p>
                                                    <Trans i18nKey={'common:wallet.stripeProcessing'} />
                                                </p>
                                            )}
                                            {watchedPaymentMethod === "bank" && (
                                                <p>
                                                    <Trans i18nKey={'common:wallet.bankProcessing'} />
                                                </p>
                                            )}
                                            {watchedPaymentMethod === "crypto" && (
                                                <p>
                                                    <Trans i18nKey={'common:wallet.cryptoProcessing'} />
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <Button
                                        disabled={isSubmitting || createWithdrawal.isPending}
                                        data-test="submit-withdrawal"
                                        type="submit"
                                    >
                                        {isSubmitting || createWithdrawal.isPending ? (
                                            <Trans i18nKey={'common:wallet.processing'} />
                                        ) : (
                                            <Trans i18nKey={'common:wallet.submitWithdrawal'} />
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
            </RequireActiveAccount>
        </PageBody>
    );
}