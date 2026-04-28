export type AdminUserProfile = {
  id: string;
  username: string | null;
  full_name: string | null;
  email: string | null;
  created_at: string;
  role: string | null;
  status: string | null;
  country: string | null;
  province: string | null;
  city: string | null;
};

export type AdminCountry = {
  id: string;
  name: string;
};

export type AdminState = {
  id: string;
  country_id: string;
  name: string;
};

export type AdminCity = {
  id: string;
  state_id: string;
  name: string;
};

export type AdminUserFormData = {
  username: string;
  full_name: string;
  email: string;
  country: string;
  province: string;
  city: string;
  role: string;
  status: string;
};
