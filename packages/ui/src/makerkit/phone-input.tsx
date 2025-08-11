'use client';

import { forwardRef, useState } from 'react';

import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '../shadcn/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../shadcn/command';
import { Input } from '../shadcn/input';
import { Popover, PopoverContent, PopoverTrigger } from '../shadcn/popover';
import { cn } from '../lib/utils';

const COUNTRIES = [
  { code: '+1', country: 'US', name: 'United States', flag: '🇺🇸' },
  { code: '+1', country: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: '+44', country: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+33', country: 'FR', name: 'France', flag: '🇫🇷' },
  { code: '+49', country: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: '+39', country: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: '+34', country: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: '+31', country: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: '+46', country: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: '+47', country: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: '+45', country: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: '+41', country: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: '+43', country: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: '+32', country: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: '+351', country: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: '+30', country: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: '+48', country: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: '+420', country: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
  { code: '+36', country: 'HU', name: 'Hungary', flag: '🇭🇺' },
  { code: '+86', country: 'CN', name: 'China', flag: '🇨🇳' },
  { code: '+81', country: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: '+82', country: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: '+91', country: 'IN', name: 'India', flag: '🇮🇳' },
  { code: '+852', country: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
  { code: '+65', country: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: '+61', country: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: '+64', country: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: '+971', country: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: '+966', country: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+965', country: 'KW', name: 'Kuwait', flag: '🇰🇼' },
  { code: '+974', country: 'QA', name: 'Qatar', flag: '🇶🇦' },
  { code: '+968', country: 'OM', name: 'Oman', flag: '🇴🇲' },
  { code: '+973', country: 'BH', name: 'Bahrain', flag: '🇧🇭' },
  { code: '+962', country: 'JO', name: 'Jordan', flag: '🇯🇴' },
  { code: '+961', country: 'LB', name: 'Lebanon', flag: '🇱🇧' },
  { code: '+20', country: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: '+212', country: 'MA', name: 'Morocco', flag: '🇲🇦' },
  { code: '+216', country: 'TN', name: 'Tunisia', flag: '🇹🇳' },
  { code: '+213', country: 'DZ', name: 'Algeria', flag: '🇩🇿' },
  { code: '+27', country: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: '+234', country: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: '+254', country: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: '+55', country: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: '+52', country: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: '+54', country: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: '+56', country: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: '+57', country: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: '+51', country: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: '+58', country: 'VE', name: 'Venezuela', flag: '🇻🇪' },
];

export interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  defaultCountryCode?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value = '', onChange, placeholder = '50 123 4567', disabled = false, className, defaultCountryCode = '+971' }, ref) => {
    const [open, setOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(() => {
      return COUNTRIES.find(country => country.code === defaultCountryCode) || COUNTRIES[0];
    });

    // Parse the current value to extract country code and phone number
    const parsePhoneValue = (phoneValue: string) => {
      if (!phoneValue) return { countryCode: selectedCountry?.code, phoneNumber: '' };

      // Find matching country code
      const matchingCountry = COUNTRIES.find(country => phoneValue.startsWith(country.code));
      if (matchingCountry) {
        return {
          countryCode: matchingCountry.code,
          phoneNumber: phoneValue.slice(matchingCountry.code.length).trim()
        };
      }

      return { countryCode: selectedCountry?.code, phoneNumber: phoneValue };
    };

    const { countryCode, phoneNumber } = parsePhoneValue(value);

    const handleCountrySelect = (country: typeof COUNTRIES[0]) => {
      setSelectedCountry(country);
      setOpen(false);
      const newValue = country.code + (phoneNumber ? ' ' + phoneNumber : '');
      onChange?.(newValue);
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPhoneNumber = e.target.value.replace(/[^\d\s-()]/g, ''); // Allow only digits, spaces, hyphens, and parentheses
      const newValue = selectedCountry?.code + (newPhoneNumber ? ' ' + newPhoneNumber : '');
      onChange?.(newValue);
    };

    return (
      <div className={cn('flex', className)}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[140px] justify-between rounded-r-none border-r-0 rtl:rounded-r-none rtl:rounded-l-none rtl:rounded-tr-md rtl:rounded-br-md rtl:border-r rtl:border-l-0"
              disabled={disabled}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{selectedCountry?.flag}</span>
                <span className="font-mono text-sm">{selectedCountry?.code}</span>
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search country..." />
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {COUNTRIES.map((country) => (
                    <CommandItem
                      key={`${country.code}-${country.country}`}
                      value={`${country.name} ${country.code}`}
                      onSelect={() => handleCountrySelect(country)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedCountry?.code === country.code && selectedCountry.country === country.country
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{country.flag}</span>
                        <span className="font-mono text-sm">{country.code}</span>
                        <span className="text-sm">{country.name}</span>
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Input
          ref={ref}
          type="tel"
          placeholder={placeholder}
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          disabled={disabled}
          className="rounded-l-none rtl:rounded-l-none rtl:rounded-r-none rtl:rounded-tl-md rtl:rounded-bl-md"
        />
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';