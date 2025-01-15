import { TrashIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

interface CartItemProps {
  item: any;
  onDeleteItem: (id: string) => void;
}

const CartItem = ({ item, onDeleteItem }: CartItemProps) => {
  const imageUrl = item.img;

  return (
    <div className="flex justify-between items-center p-2 mb-1">
      <div className="flex gap-4 items-center">
        <Image
          unoptimized={true}
          src={imageUrl}
          width={90}
          height={90}
          alt={item.name}
          className="border borderone p-2"
        />
        <div className="space-y-2">
          <h2 className="font-bold">{item.name}</h2>
          <h2 className="text-lg font-bold text-mycolor3"> ${item.amount}</h2>
        </div>
      </div>
      <TrashIcon
        className="cursor-pointer"
        onClick={() => onDeleteItem(item.id)}
      />
    </div>
  );
};

export default CartItem;
