import { Header } from "@/components/layout/header";
import { getCollections } from "@/lib/ecommerce";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const collections = await getCollections();

  return (
    <main data-vaul-drawer-wrapper="true">
      <Header collections={collections} />
      {children}
    </main>
  );
}
