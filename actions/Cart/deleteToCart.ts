import axios from "axios";

export const DeleteToCart = async (id: string, jwt: string): Promise<void> => {
  const Urls = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/carts/${id}`;

  try {
    await axios.delete(Urls, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    throw error;
  }
};
