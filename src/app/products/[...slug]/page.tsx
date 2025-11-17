import { redirect } from 'next/navigation';

interface PageProps {
  params: {
    slug: string[];
  };
}

export default function LegacyProductRedirect({ params }: PageProps) {
  const slugString = params.slug.join('/');
  redirect(`/urunler/urun/${slugString}`);
}
