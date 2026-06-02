export interface HomeSlider {
  Id: number;
  Title: string;
  Subtitle: string;
  Description: string;
  ImageUrl: string;
  CloudinaryPublicId: string;
  ButtonText: string;
  ButtonLink: string;
  SortOrder: number;
  IsActive: boolean;
  CreatedAt: Date;
}

export interface CreateHomeSliderDto {
  Title: string;
  Subtitle: string;
  Description: string;
  ImageUrl: string;
  CloudinaryPublicId: string;
  ButtonText: string;
  ButtonLink: string;
  SortOrder?: number;
  IsActive?: boolean;
}

export interface UpdateHomeSliderDto {
  Title?: string;
  Subtitle?: string;
  Description?: string;
  ImageUrl?: string;
  CloudinaryPublicId?: string;
  ButtonText?: string;
  ButtonLink?: string;
  SortOrder?: number;
  IsActive?: boolean;
}
