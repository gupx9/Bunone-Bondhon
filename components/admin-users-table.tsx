import { AdminModal } from '@/components/admin-modal';
import { updateUserRole } from '@/app/actions';

type AdminUsersTableProps = {
  users: Array<{
    id: string;
    fullName: string;
    email: string;
    phoneNo: string | null;
    userAddress: string | null;
    role: string;
  }>;
};

export function AdminUsersTable({ users }: AdminUsersTableProps) {
  return (
    <div className="overflow-x-auto surface">
      <table className="min-w-full divide-y divide-line text-left">
        <thead className="bg-white/60 text-xs uppercase tracking-wide text-brown/60">
          <tr>
            <th className="px-5 py-4 font-semibold">Name</th>
            <th className="px-5 py-4 font-semibold">Email</th>
            <th className="px-5 py-4 font-semibold">Phone</th>
            <th className="px-5 py-4 font-semibold">Address</th>
            <th className="px-5 py-4 font-semibold">Role</th>
            <th className="px-5 py-4 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line bg-white/30">
          {users.map((user) => (
            <tr key={user.id} className="align-top">
              <td className="px-5 py-4 font-semibold text-brown">{user.fullName}</td>
              <td className="px-5 py-4 text-brown/75">{user.email}</td>
              <td className="px-5 py-4 text-brown/75">{user.phoneNo ?? '—'}</td>
              <td className="px-5 py-4 text-brown/75">{user.userAddress ?? '—'}</td>
              <td className="px-5 py-4">
                <span className="rounded-full bg-maroon/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-maroon">
                  {user.role}
                </span>
              </td>
              <td className="px-5 py-4">
                <AdminModal title={`Edit ${user.fullName}`} triggerLabel="Edit user" panelClassName="surface w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-6">
                  <form action={updateUserRole} className="space-y-4">
                    <input type="hidden" name="profileId" value={user.id} />
                    <div>
                      <label className="mb-2 block text-sm font-medium text-brown">Role</label>
                      <select name="role" defaultValue={user.role} className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3">
                        <option value="customer">customer</option>
                        <option value="admin">admin</option>
                      </select>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button type="submit" className="button-primary">Save role</button>
                    </div>
                  </form>
                </AdminModal>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}