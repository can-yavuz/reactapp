import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import useCartStore from "@/hooks/useCartStore";
import { DeleteToCart } from "@/actions/Cart/deleteToCart";
import CartItem from "./CartItem";

interface CartProps {
  jwt: any;
  userId: string;
}

const Cart = ({ jwt, userId }: CartProps) => {
  const { items, fetchItems } = useCartStore();
  const [subtotal, setSubTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetchItems(userId, jwt);
  }, [fetchItems, userId, jwt]);

  useEffect(() => {
    let total = 0;
    items.forEach((element) => {
      total = total + element.amount;
    });
    setSubTotal(total);
  }, [items]);

  const onDeleteItem = async (id: string) => {
    await DeleteToCart(id, jwt);
    fetchItems(userId, jwt);
  };

  return (
    <Sheet>
      <SheetTrigger>
        <div className="relative cursor-pointer">
          <span
            className="absolute
        bg-mycolor3 text-mycolor1 text-xs font-semibold
        -right-2 -top-1 w-5 h-5
        rounded-lg items-center justify-center text-center"
          >
            {items.length}
          </span>
          <ShoppingBag />
        </div>
      </SheetTrigger>
      <SheetContent className="bgone">
        <SheetHeader>
          <SheetTitle>Your Shopping Cart</SheetTitle>
          <SheetDescription>
            Here are the items currently in your cart.
          </SheetDescription>
          <div>
            {items.length === 0 ? (
              <p>Your Cart is Empty</p>
            ) : (
              <ul>
                {items.map((item) => (
                  <CartItem key={item.id}  item={item} onDeleteItem={onDeleteItem}/>
                ))}
              </ul>
            )}
          </div>

          <SheetClose asChild>
            <div className="absolute w-[90%] bottom-6 flex-col">
              <h2 className="text-lg flex justify-between">
                SubTotal <span>${subtotal}</span>{" "}
              </h2>

              <div>
                <Button
                  disabled={items.length == 0}
                  onClick={() => router.push(jwt ? "/checkout" : "/login")}
                >
                  {" "}
                  Checkout{" "}
                </Button>
              </div>
            </div>
          </SheetClose>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
