'use client';

import Pagination from '@mui/material/Pagination';
import { useRouter, useSearchParams } from 'next/navigation';
import { buildUrunlerUrl } from '@/lib/utils/urunlerUrls';

interface Props {
  currentPage: number;
  totalPages: number;
  categoryPath?: string;
}

export default function ProductsPagination({ currentPage, totalPages, categoryPath }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());

    router.push(
      buildUrunlerUrl({
        categoryPath,
        searchParams: params,
      }),
    );
  };

  return (
    <Pagination
      count={totalPages}
      page={currentPage}
      onChange={handlePageChange}
      color="primary"
      size="large"
    />
  );
}
