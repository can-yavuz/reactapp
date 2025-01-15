import { getToCart } from "@/actions/Cart/getToCart";
import { create } from "zustand";

interface Item {
  id: string;
  name: string;
  amount: number;
}

interface CartStore {
  items: Item[];
  fetchItems: (userId: string, jwt: string) => Promise<void>;
}

const useCartStore = create<CartStore>((set) => ({
  items: [],
  fetchItems: async (userId: string, jwt: string) => {
    const data = await getToCart(userId, jwt);
    set({ items: data });
  },
}));

export default useCartStore;
