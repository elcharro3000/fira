import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureMemberProfile } from "@/lib/members";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";
  const error = requestUrl.searchParams.get("error") ?? requestUrl.searchParams.get("error_description");

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, requestUrl.origin),
    );
  }

  if (code) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) {
        return NextResponse.redirect(
          new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin),
        );
      }
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        await ensureMemberProfile(data.user);
      }
    }
  } else {
    return NextResponse.redirect(new URL("/login?error=missing-code", requestUrl.origin));
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
