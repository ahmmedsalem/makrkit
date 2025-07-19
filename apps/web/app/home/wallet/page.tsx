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
import { useUser } from "@kit/supabase/hooks/use-user";
import { useSupabase } from "@kit/supabase/hooks/use-supabase";
import { useCreateWithdrawal } from "@kit/supabase/hooks/use-withdrawal";
import { usePersonalAccountData } from "@kit/accounts/hooks/use-personal-account-data";

// Schema for form validation (focused on PayPal)
const WithdrawalSchema = z
    .object({
        amount: z.number().min(10, "Minimum withdrawal amount is $10"),
        paymentMethod: z.enum(["paypal", "stripe", "bank", "crypto"], {
            required_error: "Please select a payment method",
        }),
        paypalEmail: z.string().email("Invalid email address").optional(),
        paypalConfirm: z.string().email("Invalid email address").optional(),
    })
    .refine(
        (data) => {
            if (data.paymentMethod === "paypal") {
                return data.paypalEmail && data.paypalConfirm && data.paypalEmail === data.paypalConfirm;
            }
            return true;
        },
        {
            message: "PayPal emails must match",
            path: ["paypalConfirm"],
        }
    );

type WithdrawalFormData = z.infer<typeof WithdrawalSchema>;

export default function WithdrawPage() {
    const { data: user, isPending } = useUser();
    const ProfileData = usePersonalAccountData(user?.id!);

    const createWithdrawal = useCreateWithdrawal();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<WithdrawalFormData>({
        resolver: zodResolver(WithdrawalSchema),
        defaultValues: {
            amount: undefined,
            paymentMethod: undefined,
            paypalEmail: "",
            paypalConfirm: "",
        },
    });

    const watchedPaymentMethod = form.watch("paymentMethod");

    if (isPending) {
        return <LoadingOverlay fullPage={false} />;
    }

    if (!user) {
        toast.error("Please log in to access this page");
        return null;
    }


    const onSubmit = async (data: WithdrawalFormData) => {
        console.log("🚀 Form submitted with data:", data);
        setIsSubmitting(true);
        toast.info("Submitting withdrawal request...");

        try {
            const withdrawal = await createWithdrawal.mutateAsync(data);
            toast.success(`Withdrawal request submitted successfully! ID: ${withdrawal.request_id}`);
            form.reset();
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Error: ${error.message}`);
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderPaymentFields = () => {
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
                        <h3 className="font-semibold">PayPal Details</h3>
                    </div>
                    <FormField
                        name="paypalEmail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>PayPal Email Address</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="your-email@example.com" data-test="paypal-email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="paypalConfirm"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm PayPal Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="Confirm your PayPal email" data-test="paypal-confirm" {...field} />
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
            <div className="flex flex-col space-y-8">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Wallet Management</h1>
                    <p className="text-muted-foreground mt-2">Manage your account balance and withdraw funds</p>
                </div>

                {/* Balance Display Section */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-medium opacity-90">Available Balance</h2>
                            <p className="text-3xl font-bold mt-1">${(ProfileData?.data?.amount_invested && ProfileData?.data?.total_profit) ? ProfileData?.data?.amount_invested! + ProfileData?.data?.total_profit! : 0}</p>
                            <p className="text-sm opacity-75 mt-1">Last updated: Today at 2:30 PM</p>
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
                            <h2 className="text-xl font-semibold">Request Withdrawal</h2>
                            <p className="text-muted-foreground mt-1">
                                Enter the amount to withdraw and your PayPal email (if selected).
                            </p>
                        </div>

                        <Form {...form}>
                            <form
                                data-test="withdrawal-form"
                                className="flex flex-col space-y-4"
                                onSubmit={form.handleSubmit(onSubmit)}
                            >
                                <FormField
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Withdrawal Amount</FormLabel>
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
                                                Available balance: $2,450.00 • Minimum withdrawal: $10.00
                                            </p>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment Method</FormLabel>
                                            <FormControl>
                                                <select
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    data-test="payment-method"
                                                    {...field}
                                                >
                                                    <option value="">Select payment method</option>
                                                    <option value="paypal">PayPal</option>
                                                    <option value="stripe">Stripe</option>
                                                    <option value="bank">Bank Transfer</option>
                                                    <option value="crypto">Cryptocurrency</option>
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {watchedPaymentMethod && renderPaymentFields()}

                                {watchedPaymentMethod && (
                                    <div className="bg-muted/50 border rounded-lg p-4">
                                        <h4 className="font-semibold mb-2">Processing Information</h4>
                                        <div className="text-sm text-muted-foreground">
                                            {watchedPaymentMethod === "paypal" && (
                                                <p>
                                                    PayPal withdrawals typically process within 1-2 business days. A 2.9% processing fee applies.
                                                </p>
                                            )}
                                            {watchedPaymentMethod === "stripe" && (
                                                <p>Stripe transfers usually complete within 2-7 business days depending on your bank.</p>
                                            )}
                                            {watchedPaymentMethod === "bank" && (
                                                <p>
                                                    Bank transfers can take 3-5 business days to complete. A $5 flat fee applies.
                                                </p>
                                            )}
                                            {watchedPaymentMethod === "crypto" && (
                                                <p>
                                                    Cryptocurrency withdrawals typically process within 1-6 hours. A 0.5% fee applies.
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
                                        {isSubmitting || createWithdrawal.isPending ? "Processing..." : "Submit Withdrawal Request"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </PageBody>
    );
}
