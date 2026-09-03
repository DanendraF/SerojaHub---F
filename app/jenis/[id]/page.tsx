import { redirect } from 'next/navigation';

export default function PublicJenisRedirect({ params }: { params: { id: string } }) {
  redirect(`/tanaman?jenis=${params.id}`);
}
