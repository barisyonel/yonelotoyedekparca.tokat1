import { redirect } from 'next/navigation';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function LegacyProductRedirect({ params }: PageProps) {
  redirect(`/urunler/urun/${params.slug}`);
}
