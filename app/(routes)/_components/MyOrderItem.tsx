import Image from "next/image";
import React from "react";

interface MyOrderItemProps {
  orderItem: {
    product: {
      data: {
        attributes: {
          name: string;
          img: {
            data: {
              attributes: {
                url: string;
              };
            };
          };
        };
      };
    };
    amount: number;
  };
}

const MyorderItem = ({ orderItem }: MyOrderItemProps) => {
  const imageUrl = orderItem.product.data.attributes.img.data.attributes.url;

  return (
    <div className="container">
      <div className="grid grid-cols-6 mt-3 items-center border borderone p-2 bgone gap-8">
        <Image
          unoptimized={true}
          src={imageUrl} // Sadece orijinal URL kullanılıyor
          width={80}
          height={80}
          alt="Product Image"
          className="bgone borderone p-2 col-span-1 rounded-md border"
        />
        <div className="col-span-1">
          <h2>{orderItem.product.data.attributes.name}</h2>
        </div>
        <div className="col-span-1">
          <h2>Fiyatı: {orderItem.amount}</h2>
        </div>
      </div>
    </div>
  );
};

export default MyorderItem;
