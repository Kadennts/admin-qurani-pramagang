import type { AdminUserFormData } from "./admin-users.types";

export const ADMIN_USERS_PAGE_SIZE = 10;

export const ADMIN_USER_ROLE_OPTIONS = ["Admin", "Support", "Billing", "Member"];

export const ADMIN_USER_STATUS_OPTIONS = ["Active", "Inactive"];

export const EMPTY_ADMIN_USER_FORM: AdminUserFormData = {
  username: "",
  full_name: "",
  email: "",
  country: "",
  province: "",
  city: "",
  role: "Member",
  status: "Active",
};
