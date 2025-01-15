import axios from "axios";

export const getToorder = async (userId: any, jwt: any) => {
  const Urls = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/orders?filters[userId][$eq]=${userId}&populate[OrderItemList][populate][product][populate][img]=url`;

  try {
    const response = await axios.get(Urls, {
      headers: {
        Authorization: "Bearer " + jwt,
      },
    });

    const data = response.data.data;
    const orderList = data.map((item: any) => ({
      id: item.id,
      subtotal: item.attributes.subtotal,
      paymentText: item.attributes.paymentText,
      createdAt: item.attributes.createdAt,
      orderItemList: item.attributes.OrderItemList.map((orderItem: any) => ({
        amount: orderItem.amount,
        product: {
          data: {
            attributes: {
              name: orderItem.product.data.attributes.name,
              img: {
                data: {
                  attributes: {
                    url: orderItem.product.data.attributes.img.data.attributes.url,
                  },
                },
              },
            },
          },
        },
      })),
    }));
    return orderList;
  } catch (error) {
    console.log("Error fetching orders:", error);
    throw error;
  }
};
