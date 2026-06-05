import { resolveProductsHeading } from '@/app/products/heading';

interface Props {
  activeCategory?: { Name: string } | null;
  searchQuery?: string | null;
}

export default function ProductsHeader({ activeCategory, searchQuery }: Props) {
  const h1Text = resolveProductsHeading(activeCategory, searchQuery);
  const hasSearch = Boolean(searchQuery?.trim());

  return (
    <header className="mb-6 md:mb-8">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 leading-tight">
        {h1Text}
      </h1>
      {hasSearch && searchQuery && (
        <p className="mt-2 text-gray-600 text-base md:text-lg">
          &quot;{searchQuery}&quot; için arama sonuçları
        </p>
      )}
    </header>
  );
}
