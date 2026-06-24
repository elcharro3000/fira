"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function updateMemberProfile(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();

  if (!supabase || !admin) {
    redirect("/dashboard?profile=not-configured");
  }

  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) redirect("/login");

  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!fullName) {
    redirect("/dashboard?profile=missing-name");
  }

  const { error } = await admin
    .from("member_profiles")
    .update({
      full_name: fullName,
      phone: phone || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("updateMemberProfile failed", error);
    redirect("/dashboard?profile=error");
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?profile=updated");
}
