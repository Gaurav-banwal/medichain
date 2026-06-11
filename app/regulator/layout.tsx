import RoleGuard from '@/components/shared/RoleGuard';

export default function RegulatorLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={['REGULATOR']}>{children}</RoleGuard>;
}
