export interface Product {
  id: string;
  name: string;
  category: "T-Shirts" | "Shirts" | "Pants" | "Hoodies";
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  tagline: string;
  details: string[];
  sizes: string[];
  colors: string[];
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  avatar: string;
}

export interface Message {
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}
