import { ADMIN_USERS_PAGE_SIZE, EMPTY_ADMIN_USER_FORM } from "./admin-users.constants";
import type { AdminCountry, AdminState, AdminUserFormData, AdminUserProfile } from "./admin-users.types";

export function filterAdminUsers(users: AdminUserProfile[], search: string) {
  const normalized = search.toLowerCase();

  return users.filter((user) => {
    return (
      (user.username || "").toLowerCase().includes(normalized) ||
      (user.full_name || "").toLowerCase().includes(normalized) ||
      (user.email || "").toLowerCase().includes(normalized)
    );
  });
}

export function paginateAdminUsers<T>(items: T[], currentPage: number) {
  return items.slice((currentPage - 1) * ADMIN_USERS_PAGE_SIZE, currentPage * ADMIN_USERS_PAGE_SIZE);
}

export function getAdminUsersPageNumbers(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5];
  }

  if (currentPage >= totalPages - 2) {
    return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
}

export function buildAdminUserFormData(user: AdminUserProfile | null): AdminUserFormData {
  if (!user) {
    return EMPTY_ADMIN_USER_FORM;
  }

  return {
    username: user.username || "",
    full_name: user.full_name || "",
    email: user.email || "",
    country: user.country || "",
    province: user.province || "",
    city: user.city || "",
    role: user.role || "Member",
    status: user.status || "Active",
  };
}

export function findCountryByName(countries: AdminCountry[], countryName: string) {
  return countries.find((country) => country.name === countryName) || null;
}

export function findStateByName(states: AdminState[], stateName: string) {
  return states.find((state) => state.name === stateName) || null;
}

export function getAdminUserInitial(user: AdminUserProfile) {
  return user.username ? user.username.substring(0, 1).toUpperCase() : "U";
}
