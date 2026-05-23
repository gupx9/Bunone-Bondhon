import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function requireAdminSession() {
  const session = getSession();

  if (!session) {
    redirect('/login');
  }

  const profile = await prisma.profile.findUnique({ where: { id: session.id } });

  if (!profile || profile.role !== 'admin') {
    redirect('/shop');
  }

  return { session, profile };
}
