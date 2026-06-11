import RoleGuard from '@/components/shared/RoleGuard';

export default function PharmacyLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={['PHARMACY']}>{children}</RoleGuard>;
}
