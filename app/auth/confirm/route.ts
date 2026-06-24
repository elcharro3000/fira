import { type EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { ensureMemberProfile } from "@/lib/members";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (!tokenHash || !type) {
    return NextResponse.redirect(new URL("/login?error=missing-token", requestUrl.origin));
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.redirect(new URL("/login?error=supabase-not-configured", requestUrl.origin));
  }

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin),
    );
  }

  const { data } = await supabase.auth.getUser();
  if (data.user) {
    await ensureMemberProfile(data.user);
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
