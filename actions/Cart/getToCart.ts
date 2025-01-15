import axios from "axios";

interface CartItem {
  id: string;
  name: string;
  amount: number;
  product: string;
  img: string | null; // Resim URL'si olmayabilir
}

export const getToCart = async (userId: string, jwt: string): Promise<CartItem[]> => {
  const Urls = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/carts?filters[userId][$eq]=${userId}&[populate][products][populate][img][populate]=url`;

  try {
    const response = await axios.get(Urls, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    const data = response.data.data;

    // Gelen veriyi map ederken türleri açıkça belirtelim
    const cartItemList: CartItem[] = data.map((item: any) => ({
      id: item.id,
      name: item?.attributes?.products?.data[0]?.attributes?.name || "Unknown",
      amount: item.attributes.amount || 0,
      product: item.attributes.products?.data[0]?.id || "Unknown",
      img:
        item.attributes.products?.data[0]?.attributes?.img?.data?.attributes
          .url || null, // Eğer img URL'si yoksa null olarak ayarla
    }));

    return cartItemList;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};
