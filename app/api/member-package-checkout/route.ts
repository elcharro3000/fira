import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getMemberPackage } from "@/lib/member-packages";
import { ensureMemberProfile } from "@/lib/members";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getStripe(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  return secretKey ? new Stripe(secretKey) : null;
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const stripe = getStripe();

  if (!supabase || !stripe) {
    return NextResponse.redirect(new URL("/dashboard?error=not-configured", request.url));
  }

  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  await ensureMemberProfile(user);

  const formData = await request.formData();
  const packageId = String(formData.get("packageId") ?? "");
  const memberPackage = getMemberPackage(packageId);

  if (!memberPackage) {
    return NextResponse.redirect(new URL("/dashboard?error=invalid-package", request.url));
  }

  const origin = request.nextUrl.origin;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email ?? undefined,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "mxn",
          unit_amount: memberPackage.priceCents,
          product_data: {
            name: `Paquete ${memberPackage.name}`,
            description: memberPackage.description,
          },
        },
      },
    ],
    metadata: {
      purchaseType: "member-package",
      memberId: user.id,
      packageId: memberPackage.id,
      packageName: memberPackage.name,
      classesAdded: String(memberPackage.classes),
      amountCents: String(memberPackage.priceCents),
    },
    success_url: `${origin}/dashboard?purchase=success`,
    cancel_url: `${origin}/dashboard?purchase=cancelled`,
  });

  if (!session.url) {
    return NextResponse.redirect(new URL("/dashboard?error=checkout", request.url));
  }

  return NextResponse.redirect(session.url, 303);
}
