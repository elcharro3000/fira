import Stripe from "stripe";
import { sendMemberPackagePhoneNotification } from "@/lib/booking-notifications";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function creditMemberPackageFromStripeSession(
  session: Stripe.Checkout.Session,
): Promise<"credited" | "already-credited" | "skipped" | "error"> {
  const metadata = session.metadata ?? {};
  if (metadata.purchaseType !== "member-package") return "skipped";
  if (session.payment_status !== "paid") return "skipped";

  const memberId = metadata.memberId;
  const packageId = metadata.packageId;
  const packageName = metadata.packageName;
  const classesAdded = Number(metadata.classesAdded ?? 0);

  if (!memberId || !packageId || !packageName || classesAdded <= 0) {
    console.error("member package credit skipped: missing metadata", {
      sessionId: session.id,
      metadata,
    });
    return "error";
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) return "error";

  const { data: existing } = await supabase
    .from("member_purchases")
    .select("id, status")
    .eq("stripe_session_id", session.id)
    .maybeSingle();

  if (existing?.status === "paid") return "already-credited";

  const { data: profile, error: profileError } = await supabase
    .from("member_profiles")
    .select("email, class_credits_remaining")
    .eq("id", memberId)
    .single();

  if (profileError || !profile) {
    console.error("member package credit failed: profile not found", {
      sessionId: session.id,
      memberId,
      error: profileError,
    });
    return "error";
  }

  const amountCents = session.amount_total ?? Number(metadata.amountCents ?? 0);

  const { error: purchaseError } = await supabase.from("member_purchases").upsert(
    {
      member_id: memberId,
      stripe_session_id: session.id,
      package_id: packageId,
      package_name: packageName,
      classes_added: classesAdded,
      amount_cents: amountCents,
      status: "paid",
    },
    { onConflict: "stripe_session_id" },
  );

  if (purchaseError) {
    console.error("member package purchase upsert failed", purchaseError);
    return "error";
  }

  const remainingCredits = Number(profile.class_credits_remaining ?? 0) + classesAdded;

  const { error: updateError } = await supabase
    .from("member_profiles")
    .update({
      class_credits_remaining: remainingCredits,
      updated_at: new Date().toISOString(),
    })
    .eq("id", memberId);

  if (updateError) {
    console.error("member credit update failed", updateError);
    return "error";
  }

  await sendMemberPackagePhoneNotification({
    sessionId: session.id,
    packageName,
    classesAdded,
    amountCents,
    memberEmail: profile.email,
    remainingCredits,
  });

  return "credited";
}
