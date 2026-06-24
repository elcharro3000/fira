import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type MemberDashboardData = {
  profile: {
    id: string;
    full_name: string | null;
    email: string;
    phone: string | null;
    class_credits_remaining: number;
  };
  upcomingReservations: MemberReservation[];
  pastReservations: MemberReservation[];
  purchases: MemberPurchase[];
};

export type MemberReservation = {
  id: string;
  service_name: string;
  slot_id: string;
  starts_at: string;
  status: string;
  created_at: string;
};

export type MemberPurchase = {
  id: string;
  package_name: string;
  classes_added: number;
  amount_cents: number;
  status: string;
  created_at: string;
};

export async function ensureMemberProfile(user: {
  id: string;
  email?: string | null;
  user_metadata?: { full_name?: string; name?: string; phone?: string };
}) {
  const supabase = createSupabaseAdminClient();
  if (!supabase || !user.email) return null;

  const fullName = user.user_metadata?.full_name ?? user.user_metadata?.name ?? null;
  const phone = user.user_metadata?.phone ?? null;

  const { data, error } = await supabase
    .from("member_profiles")
    .upsert(
      {
        id: user.id,
        email: user.email,
        full_name: fullName,
        phone,
      },
      { onConflict: "id", ignoreDuplicates: false },
    )
    .select("id, full_name, email, phone, class_credits_remaining")
    .single();

  if (error) {
    console.error("ensureMemberProfile failed", error);
    return null;
  }

  return data;
}

export async function getMemberDashboardData(userId: string): Promise<MemberDashboardData | null> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;

  const [profileResult, reservationsResult, purchasesResult] = await Promise.all([
    supabase
      .from("member_profiles")
      .select("id, full_name, email, phone, class_credits_remaining")
      .eq("id", userId)
      .single(),
    supabase
      .from("member_reservations")
      .select("id, service_name, slot_id, starts_at, status, created_at")
      .eq("member_id", userId)
      .order("starts_at", { ascending: true }),
    supabase
      .from("member_purchases")
      .select("id, package_name, classes_added, amount_cents, status, created_at")
      .eq("member_id", userId)
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  if (profileResult.error || !profileResult.data) {
    console.error("member profile fetch failed", profileResult.error);
    return null;
  }

  const now = Date.now();
  const reservations = (reservationsResult.data ?? []) as MemberReservation[];
  const upcomingReservations = reservations.filter(
    (item) => new Date(item.starts_at).getTime() >= now && item.status !== "cancelled",
  );
  const pastReservations = reservations
    .filter((item) => new Date(item.starts_at).getTime() < now || item.status === "cancelled")
    .reverse()
    .slice(0, 6);

  return {
    profile: profileResult.data,
    upcomingReservations,
    pastReservations,
    purchases: (purchasesResult.data ?? []) as MemberPurchase[],
  };
}
