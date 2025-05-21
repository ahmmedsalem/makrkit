alter table public.accounts
add column amount_invested float4 default 0.0 not null,
add column total_profit float4 default 0.0 not null,
add column return_percentage float4 default 0.0 not null;