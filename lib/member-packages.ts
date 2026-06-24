export const MEMBER_PACKAGES = [
  {
    id: "essential-5",
    name: "Esencial",
    classes: 5,
    priceCents: 160000,
    description: "5 clases para usar en FIRA Wellness Club.",
  },
  {
    id: "balance-8",
    name: "Balance",
    classes: 8,
    priceCents: 240000,
    description: "8 clases para usar en FIRA Wellness Club.",
  },
  {
    id: "intense-12",
    name: "Intenso",
    classes: 12,
    priceCents: 336000,
    description: "12 clases para usar en FIRA Wellness Club.",
  },
  {
    id: "unlimited-30",
    name: "Ilimitado",
    classes: 30,
    priceCents: 450000,
    description: "30 creditos mensuales para representar clases ilimitadas operativamente.",
  },
] as const;

export type MemberPackageId = (typeof MEMBER_PACKAGES)[number]["id"];

export function getMemberPackage(packageId: string) {
  return MEMBER_PACKAGES.find((item) => item.id === packageId) ?? null;
}
