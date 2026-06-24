import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Classes from "@/components/Classes";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; token_hash?: string; type?: string; next?: string }>;
}) {
  const params = await searchParams;

  if (params.code) {
    redirect(`/auth/callback?code=${encodeURIComponent(params.code)}&next=/dashboard`);
  }

  if (params.token_hash && params.type) {
    redirect(
      `/auth/confirm?token_hash=${encodeURIComponent(params.token_hash)}&type=${encodeURIComponent(params.type)}&next=/dashboard`,
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Benefits />
        <Classes />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
