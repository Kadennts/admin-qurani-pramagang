"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { createClient } from "@/utils/supabase/client";

import {
  fetchAdminCitiesByStateId,
  fetchAdminCountries,
  fetchAdminStatesByCountryId,
  fetchAdminUserProfiles,
  updateAdminUserProfile,
} from "../data/admin-users.repository";
import { ADMIN_USERS_PAGE_SIZE, EMPTY_ADMIN_USER_FORM } from "../model/admin-users.constants";
import {
  buildAdminUserFormData,
  filterAdminUsers,
  findCountryByName,
  findStateByName,
  getAdminUsersPageNumbers,
  paginateAdminUsers,
} from "../model/admin-users.utils";
import type { AdminCity, AdminCountry, AdminState, AdminUserFormData, AdminUserProfile } from "../model/admin-users.types";

export function useAdminUsers() {
  const [supabase] = useState(() => createClient());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<AdminUserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [countries, setCountries] = useState<AdminCountry[]>([]);
  const [states, setStates] = useState<AdminState[]>([]);
  const [cities, setCities] = useState<AdminCity[]>([]);
  const [editingUser, setEditingUser] = useState<AdminUserProfile | null>(null);
  const [formData, setFormData] = useState<AdminUserFormData>(EMPTY_ADMIN_USER_FORM);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await fetchAdminUserProfiles(supabase);
      setUsers(data);
    } catch (error) {
      console.error("Failed to load admin users", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const loadCountries = useCallback(async () => {
    try {
      const data = await fetchAdminCountries(supabase);
      setCountries(data);
    } catch (error) {
      console.error("Failed to load countries", error);
      setCountries([]);
    }
  }, [supabase]);

  useEffect(() => {
    void loadUsers();
    void loadCountries();
  }, [loadCountries, loadUsers]);

  useEffect(() => {
    async function loadStates() {
      if (!formData.country) {
        setStates([]);
        return;
      }

      const country = findCountryByName(countries, formData.country);
      if (!country) {
        setStates([]);
        return;
      }

      try {
        const data = await fetchAdminStatesByCountryId(supabase, country.id);
        setStates(data);
      } catch (error) {
        console.error("Failed to load states", error);
        setStates([]);
      }
    }

    void loadStates();
  }, [countries, formData.country, supabase]);

  useEffect(() => {
    async function loadCities() {
      if (!formData.province) {
        setCities([]);
        return;
      }

      const state = findStateByName(states, formData.province);
      if (!state) {
        setCities([]);
        return;
      }

      try {
        const data = await fetchAdminCitiesByStateId(supabase, state.id);
        setCities(data);
      } catch (error) {
        console.error("Failed to load cities", error);
        setCities([]);
      }
    }

    void loadCities();
  }, [formData.province, states, supabase]);

  const filteredUsers = useMemo(() => filterAdminUsers(users, search), [search, users]);
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredUsers.length / ADMIN_USERS_PAGE_SIZE)),
    [filteredUsers.length],
  );
  const paginatedUsers = useMemo(
    () => paginateAdminUsers(filteredUsers, currentPage),
    [currentPage, filteredUsers],
  );
  const pageNumbers = useMemo(
    () => getAdminUsersPageNumbers(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const openEditModal = useCallback((user: AdminUserProfile) => {
    setEditingUser(user);
    setFormData(buildAdminUserFormData(user));
    setIsModalOpen(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData(EMPTY_ADMIN_USER_FORM);
  }, []);

  const updateFormField = useCallback(<K extends keyof AdminUserFormData>(field: K, value: AdminUserFormData[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
  }, []);

  const handleCountryChange = useCallback((country: string) => {
    setFormData((current) => ({ ...current, country, province: "", city: "" }));
  }, []);

  const handleProvinceChange = useCallback((province: string) => {
    setFormData((current) => ({ ...current, province, city: "" }));
  }, []);

  const toggleStatus = useCallback(() => {
    setFormData((current) => ({
      ...current,
      status: current.status === "Active" ? "Inactive" : "Active",
    }));
  }, []);

  const saveUser = useCallback(async () => {
    if (!editingUser) {
      return;
    }

    try {
      const updatedUser = await updateAdminUserProfile(supabase, editingUser.id, formData);
      setUsers((current) => current.map((user) => (user.id === editingUser.id ? updatedUser : user)));
      closeEditModal();
    } catch (error) {
      console.error("Failed to save user", error);
    }
  }, [closeEditModal, editingUser, formData, supabase]);

  return {
    cities,
    closeEditModal,
    countries,
    currentPage,
    editingUser,
    filteredUsers,
    formData,
    handleCountryChange,
    handleProvinceChange,
    handleSearch,
    isLoading,
    isModalOpen,
    openEditModal,
    pageNumbers,
    paginatedUsers,
    saveUser,
    search,
    setCurrentPage,
    states,
    toggleStatus,
    totalPages,
    updateFormField,
  };
}
