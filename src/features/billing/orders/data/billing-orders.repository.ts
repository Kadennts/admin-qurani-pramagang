import type { createClient } from "@/utils/supabase/client";

import type {
  BillingGuru,
  BillingMember,
  BillingOrderDetail,
  BillingOrderInsert,
  BillingOrderRow,
} from "../model/billing-orders.types";

type BillingOrdersClient = ReturnType<typeof createClient>;

export async function fetchBillingOrders(client: BillingOrdersClient) {
  const { data, error } = await client
    .from("billing_pesanan")
    .select("*")
    .order("order_date", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as BillingOrderRow[];
}

export async function fetchBillingMembers(client: BillingOrdersClient) {
  const { data, error } = await client.from("billing_members").select("*");

  if (error) {
    throw error;
  }

  return (data ?? []) as BillingMember[];
}

export async function fetchBillingGurus(client: BillingOrdersClient) {
  const { data, error } = await client.from("master_guru").select("*");

  if (error) {
    throw error;
  }

  return (data ?? []) as BillingGuru[];
}

export async function fetchBillingOrdersPageSnapshot(
  client: BillingOrdersClient,
) {
  const [orders, members, gurus] = await Promise.all([
    fetchBillingOrders(client),
    fetchBillingMembers(client),
    fetchBillingGurus(client),
  ]);

  return {
    gurus,
    members,
    orders,
  };
}

export async function insertBillingOrder(
  client: BillingOrdersClient,
  payload: BillingOrderInsert,
) {
  const { error } = await client.from("billing_pesanan").insert([payload]);

  if (error) {
    throw error;
  }
}

export async function fetchBillingOrderDetail(
  client: BillingOrdersClient,
  id: string,
) {
  const { data, error } = await client
    .from("billing_pesanan")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data as BillingOrderDetail;
}

export async function fetchBillingGuruProfileByOrder(
  client: BillingOrdersClient,
  guruName: string | null,
) {
  if (!guruName) {
    return null;
  }

  const { data, error } = await client
    .from("master_guru")
    .select("*")
    .ilike("name", `%${guruName}%`)
    .limit(1);

  if (error) {
    throw error;
  }

  return ((data ?? [])[0] ?? null) as BillingGuru | null;
}
