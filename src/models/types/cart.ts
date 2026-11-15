import { Product, ProductColorId, ProductSize } from "./product";

export interface CartItem {
  id: string;
  product: Product;
  colorId: ProductColorId;
  size: ProductSize | null;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}
