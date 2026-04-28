"use client";

import { useAdminUsers } from "@/features/admin/users/hooks/use-admin-users";
import { AdminUsersView } from "@/features/admin/users/ui/admin-users-view";

export default function UsersPage() {
  const state = useAdminUsers();

  return <AdminUsersView state={state} />;
}
