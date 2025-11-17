interface CategoryLike {
  Name: string;
}

export function resolveProductsHeading(
  activeCategory?: CategoryLike | null,
  searchQuery?: string | null,
): string {
  const search = searchQuery?.trim() || '';
  let heading = 'Yedek Parça Kataloğu';

  if (activeCategory) {
    const categoryName = activeCategory.Name.toLowerCase();
    if (categoryName.includes('iveco')) {
      heading = 'İveco Daily Yedek Parçaları';
    } else if (categoryName.includes('ducato') || categoryName.includes('fiat')) {
      heading = 'Fiat Ducato Yedek Parçaları';
    } else if (categoryName.includes('foton')) {
      heading = 'Foton Traktör Yedek Parçaları';
    } else if (categoryName.includes('karataş')) {
      heading = 'Karataş Traktör Yedek Parçaları';
    } else if (categoryName.includes('mutlu')) {
      heading = 'Mutlu Akü Çeşitleri';
    } else {
      heading = `${activeCategory.Name} Yedek Parçaları`;
      if (heading.length > 60) {
        heading = activeCategory.Name.length > 45
          ? `${activeCategory.Name.substring(0, 45)}... Yedek Parça`
          : `${activeCategory.Name} Yedek Parça`;
      }
    }
  } else if (search) {
    const searchLower = search.toLowerCase();
    if (searchLower.includes('iveco')) {
      heading = 'İveco Daily Yedek Parçaları';
    } else if (searchLower.includes('ducato') || searchLower.includes('fiat')) {
      heading = 'Fiat Ducato Yedek Parçaları';
    } else if (searchLower.includes('foton')) {
      heading = 'Foton Traktör Yedek Parçaları';
    } else if (searchLower.includes('karataş')) {
      heading = 'Karataş Traktör Yedek Parçaları';
    } else if (searchLower.includes('mutlu')) {
      heading = 'Mutlu Akü Çeşitleri';
    } else {
      const searchText = search.length > 40 ? `${search.substring(0, 40)}...` : search;
      heading = `${searchText} Yedek Parçaları`;
    }
  }

  return heading;
}

