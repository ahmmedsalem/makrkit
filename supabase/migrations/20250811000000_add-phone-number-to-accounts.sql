-- Add phone_number column to accounts table
alter table public.accounts
add column phone_number varchar(20);

comment on column public.accounts.phone_number is 'The phone number of the account user';

-- Update the account creation trigger to include phone number from user metadata
create or replace function kit.new_user_created_setup() returns trigger
    language plpgsql
    security definer
    set search_path = '' as
$$
declare
    user_name text;
    picture_url text;
    phone_number text;
begin
    if new.raw_user_meta_data ->> 'name' is not null then
        user_name := new.raw_user_meta_data ->> 'name';
    end if;

    if user_name is null and new.email is not null then
        user_name := split_part(new.email, '@', 1);
    end if;

    if user_name is null then
        user_name := '';
    end if;

    if new.raw_user_meta_data ->> 'avatar_url' is not null then
        picture_url := new.raw_user_meta_data ->> 'avatar_url';
    else
        picture_url := null;
    end if;

    if new.raw_user_meta_data ->> 'phone_number' is not null then
        phone_number := new.raw_user_meta_data ->> 'phone_number';
    else
        phone_number := null;
    end if;

    insert into public.accounts(id,
                                name,
                                picture_url,
                                email,
                                phone_number)
    values (new.id,
            user_name,
            picture_url,
            new.email,
            phone_number);

    return new;
end;
$$;