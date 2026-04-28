export type AdminDashboardStats = {
  totalUsers: number;
  admins: number;
  active: number;
  blocked: number;
};

export type AdminDashboardGenderData = {
  male: number;
  unknown: number;
};

export type AdminDashboardTooltip = {
  visible: boolean;
  x: number;
  y: number;
  title: string;
  count: number;
  color: string;
};

export type AdminDashboardLocationDatum = {
  name: string;
  count: number;
};

export type AdminDashboardUserRow = {
  id: string;
  role?: string | null;
  status?: string | null;
  gender?: string | null;
  country?: string | null;
  province?: string | null;
  city?: string | null;
};

export type AdminDashboardSnapshot = {
  stats: AdminDashboardStats;
  genderData: AdminDashboardGenderData;
  countriesData: AdminDashboardLocationDatum[];
  statesData: AdminDashboardLocationDatum[];
  citiesData: AdminDashboardLocationDatum[];
};
