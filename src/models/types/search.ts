export interface ProductSearchResultDTO {
  id: string;
  name: string;
  slug: string;
  price: number;
  collectionName: string;
  categoryName: string;
  image: string | null;
}
