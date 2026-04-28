import type {
  AdminDashboardLocationDatum,
  AdminDashboardSnapshot,
  AdminDashboardUserRow,
} from "./admin-dashboard.types";

function toSortedLocationData(tally: Record<string, number>) {
  return Object.entries(tally)
    .map(([name, count]) => ({ name, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 6);
}

function normalizeLocationValue(value?: string | null) {
  return value?.trim() || "Unknown";
}

export function buildAdminDashboardSnapshot(
  users: AdminDashboardUserRow[],
  adminUsersCount: number,
): AdminDashboardSnapshot {
  const totalUsers = users.length;
  const admins =
    users.filter((user) => user.role?.toLowerCase() === "admin").length + adminUsersCount;
  const active = users.filter((user) => user.status === "Active").length || totalUsers;
  const blocked = users.filter((user) => user.status === "Blocked").length;
  const male = users.filter((user) => user.gender === "Male").length;
  const unknown = totalUsers - male;

  const countryTally: Record<string, number> = {};
  const stateTally: Record<string, number> = {};
  const cityTally: Record<string, number> = {};

  users.forEach((user) => {
    const country = normalizeLocationValue(user.country);
    const province = normalizeLocationValue(user.province);
    const city = normalizeLocationValue(user.city);

    countryTally[country] = (countryTally[country] || 0) + 1;
    stateTally[province] = (stateTally[province] || 0) + 1;
    cityTally[city] = (cityTally[city] || 0) + 1;
  });

  return {
    stats: {
      totalUsers,
      admins,
      active,
      blocked,
    },
    genderData: {
      male,
      unknown,
    },
    countriesData: toSortedLocationData(countryTally),
    statesData: toSortedLocationData(stateTally),
    citiesData: toSortedLocationData(cityTally),
  };
}

export function getAdminDashboardAxisValues(data: AdminDashboardLocationDatum[]) {
  const maxCount = Math.max(...data.map((item) => item.count), 1);

  return [0, Math.ceil(maxCount / 4), Math.ceil(maxCount / 2), Math.ceil((maxCount / 4) * 3), maxCount];
}
