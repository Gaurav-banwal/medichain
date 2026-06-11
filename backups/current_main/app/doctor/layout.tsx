import RoleGuard from '@/components/shared/RoleGuard';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={['DOCTOR']}>{children}</RoleGuard>;
}
