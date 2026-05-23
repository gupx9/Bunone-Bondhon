import { SiteHeader } from '@/components/site-header';
import { SectionShell } from '@/components/section-shell';
import { AdminUsersTable } from '@/components/admin-users-table';
import { requireAdminSession } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  await requireAdminSession();
  const users = await prisma.profile.findMany({ orderBy: { createdAt: 'asc' } });

  return (
    <div className="min-h-screen bg-warm-radial">
      <SiteHeader />
      <SectionShell
        eyebrow="Admin / Users"
        title="Manage roles"
        description="Open a user modal to promote or demote an account without crowding the page."
      >
        <AdminUsersTable
          users={users.map((user) => ({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phoneNo: user.phoneNo,
            userAddress: user.userAddress,
            role: user.role
          }))}
        />
      </SectionShell>
    </div>
  );
}
