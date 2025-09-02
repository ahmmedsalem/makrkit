export function canAccessProtectedRoutes(status: 'active' | 'inactive' | 'pending' | null | undefined): boolean {
  return status === 'active';
}

export function isAccountActive(status: 'active' | 'inactive' | 'pending' | null | undefined): boolean {
  return status === 'active';
}

export function isAccountInactive(status: 'active' | 'inactive' | 'pending' | null | undefined): boolean {
  return status === 'inactive';
}

export function isAccountPending(status: 'active' | 'inactive' | 'pending' | null | undefined): boolean {
  return status === 'pending';
}