import { Badge } from '@kit/ui/badge';

export interface AccountStatusBadgeProps {
  status: 'active' | 'inactive' | 'pending';
  className?: string;
}

export function AccountStatusBadge({ status, className }: AccountStatusBadgeProps) {
  const getStatusConfig = (status: 'active' | 'inactive' | 'pending') => {
    switch (status) {
      case 'active':
        return {
          variant: 'success' as const,
          text: 'Active',
        };
      case 'inactive':
        return {
          variant: 'destructive' as const,
          text: 'Inactive',
        };
      case 'pending':
        return {
          variant: 'warning' as const,
          text: 'Pending',
        };
      default:
        return {
          variant: 'default' as const,
          text: 'Unknown',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={className}>
      {config.text}
    </Badge>
  );
}