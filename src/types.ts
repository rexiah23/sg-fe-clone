export interface CarPhoto {
  photoId: string;
  carId: string;
  photoUrl: string;
}

export type Province = 'BC' | 'AB' | 'ON' | 'QC' | 'MB' | 'SK' | 'NS' | 'NB' | 'PE' | 'NL' | 'YT' | 'NT' | 'NU';

export interface Car {
  carId: string;
  make: string;
  model: string;
  trim: string;
  year: string;
  mileage: number;
  price: string;
  priceCad: number;
  fuelType: string;
  transmission: string;
  engine: string;
  color: string;
  bodyStyle: string;
  description: string;
  carPhotos: { photoUrl: string; photoId: string; carId: string }[];
  historyPhotos?: { photoUrl: string; photoId: string; carId: string }[];
  lineItems: { name: string; value: string }[];
  showTop?: boolean;
  originalUrl?: string;
  newCarPriceUrl?: string;
  optionsUrl?: string;
  reserved: boolean;
  reservedAt: string | null;
}