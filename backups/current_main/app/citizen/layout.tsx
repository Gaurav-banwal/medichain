import RoleGuard from '@/components/shared/RoleGuard';

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={['CITIZEN']}>{children}</RoleGuard>;
}
