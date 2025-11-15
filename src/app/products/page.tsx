import { redirect } from 'next/navigation';

// Redirect /products to /urunler (SEO-friendly Turkish URL)
// Permanent 301 redirect is handled by vercel.json
export default function ProductsPage() {
  redirect('/urunler');
}

