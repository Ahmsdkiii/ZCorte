import { ProductCollection } from "./product";

export interface CollectionMeta {
  id: ProductCollection;
  name: string;
  tagline: string;
  focus: string;
  description: string;
  accentColor: string;
  heroImage: string;
  keywords: string[];
}
