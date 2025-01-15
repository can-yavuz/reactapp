"use client";
import { Product } from "@/constans/type";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { AddToCart } from "@/actions/Cart/addToCart";
import { useToast } from "@/hooks/use-toast";
import useCartStore from "@/hooks/useCartStore";
import { useRouter } from "next/navigation";

interface ProductForm {
  product: Product;
  btnVisible?: boolean;
}
const ProductForm = ({ product, btnVisible }: ProductForm) => {
  const [loading, setLoading] = useState(false);

  const fetchItems = useCartStore((state) => state.fetchItems);
  const router = useRouter();

  const { toast } = useToast();

  const TotalPrice = (product?.attributes?.sellingPrice).toFixed(2);

  let jwt = "";
  let user = "";
  let userId = "";

  try {
    jwt = localStorage.getItem("jwt") || "";
    user = localStorage.getItem("user") || "";
    if (user) {
      const userObj = JSON.parse(user);
      userId = userObj.id;
    }
  } catch (error) {
    console.log("Error", error);
  }

  const onAddCart = async () => {
    if (!userId && !jwt) {
      router.push("/login");
    }
    try {
      setLoading(true);

      const data = {
        data: {
          amount: TotalPrice,
          products: product.id,
          users_permissions_user: userId,
          userId: userId,
        },
      };

      await AddToCart(data, jwt);
      fetchItems(userId, jwt);
      toast({
        title: "Add to Cart ",
        variant: "success",
      });
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-row gap-2 mt-8">
        <Button onClick={onAddCart} variant="destructive">
          {loading ? <Loader2Icon className="animate-spin" /> : "Add To Cart"}
        </Button>

        {btnVisible && (
          <Button asChild>
            <Link href={`product/${product?.attributes?.slug}`}>Detail</Link>
          </Button>
        )}
      </div>
    </>
  );
};

export default ProductForm;
