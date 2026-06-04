import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

// Redirect /products to /urunler (SEO-friendly Turkish URL)
// Permanent 301 redirect is handled by vercel.json
export default function ProductsPage() {
  redirect('/urunler');
}

