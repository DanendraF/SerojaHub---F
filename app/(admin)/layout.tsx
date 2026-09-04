import { CatalogProviders } from '@/lib/catalog-providers';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CatalogProviders>{children}</CatalogProviders>;
}
