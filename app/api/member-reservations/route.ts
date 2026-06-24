import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSheetScheduleSlots } from "@/lib/google-sheets-schedule";
import { getSlotStartsAt, slotFromId } from "@/lib/schedule";
import { sendMemberReservationPhoneNotification } from "@/lib/booking-notifications";

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();

  if (!supabase || !admin) {
    return NextResponse.redirect(new URL("/dashboard/reservar?error=not-configured", request.url));
  }

  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const formData = await request.formData();
  const slotId = String(formData.get("slotId") ?? "");
  const serviceId = String(formData.get("serviceId") ?? "");
  const serviceName = String(formData.get("serviceName") ?? "Clase FIRA");
  const slot = slotFromId(slotId);

  if (!slot.date || !serviceId) {
    return NextResponse.redirect(new URL("/dashboard/reservar?error=invalid-slot", request.url));
  }

  const startsAt = getSlotStartsAt(slot.date, slot.hour, slot.minute);
  if (startsAt < new Date()) {
    return NextResponse.redirect(new URL("/dashboard/reservar?error=past-slot", request.url));
  }

  const from = new Date(`${slot.date}T00:00:00`);
  const to = new Date(`${slot.date}T23:59:59`);
  const scheduleSlot = (await getSheetScheduleSlots(from, to)).find(
    (item) => item.slotId === slotId,
  );

  if (!scheduleSlot) {
    return NextResponse.redirect(new URL("/dashboard/reservar?error=slot-unavailable", request.url));
  }

  const [{ count: bookedCount }, { data: profile }] = await Promise.all([
    admin
      .from("member_reservations")
      .select("id", { count: "exact", head: true })
      .eq("slot_id", slotId)
      .eq("status", "confirmed"),
    admin
      .from("member_profiles")
      .select("email, full_name, class_credits_remaining")
      .eq("id", user.id)
      .single(),
  ]);

  if ((bookedCount ?? 0) >= scheduleSlot.capacity) {
    return NextResponse.redirect(new URL("/dashboard/reservar?error=full", request.url));
  }

  const credits = Number(profile?.class_credits_remaining ?? 0);
  if (credits <= 0) {
    return NextResponse.redirect(new URL("/dashboard?error=no-credits", request.url));
  }

  const { data: reservation, error: insertError } = await admin
    .from("member_reservations")
    .insert({
      member_id: user.id,
      service_id: serviceId,
      service_name: serviceName,
      slot_id: slotId,
      starts_at: startsAt.toISOString(),
      status: "confirmed",
    })
    .select("id")
    .single();

  if (insertError) {
    return NextResponse.redirect(new URL("/dashboard/reservar?error=reservation-failed", request.url));
  }

  const remainingCredits = Math.max(credits - 1, 0);

  await admin
    .from("member_profiles")
    .update({
      class_credits_remaining: remainingCredits,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  await sendMemberReservationPhoneNotification({
    reservationId: reservation?.id,
    serviceName,
    startsAt: startsAt.toISOString(),
    memberEmail: profile?.email ?? user.email ?? "Sin email",
    memberName: profile?.full_name,
    remainingCredits,
  });

  return NextResponse.redirect(new URL("/dashboard?reserved=success", request.url));
}
