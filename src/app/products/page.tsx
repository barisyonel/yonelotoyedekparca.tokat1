import { redirect } from 'next/navigation';

// Redirect /products to /urunler (SEO-friendly Turkish URL)
// Permanent 301 redirect for SEO
export default function ProductsPage() {
  redirect('/urunler', 'replace'); // Next.js 14'te bu 301 permanent redirect olarak çalışır
}

