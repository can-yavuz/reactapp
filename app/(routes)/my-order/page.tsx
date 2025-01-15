"use client";

import { getToorder } from "@/actions/Cart/getToOrder";
import useCartStore from "@/hooks/useCartStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import moment from "moment";
import { ArrowDownIcon } from "lucide-react";
import MyorderItem from "../_components/MyOrderItem";

type OrderItem = {
  amount: number;
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
};

type Order = {
  createdAt: string;
  subtotal: number;
  paymentText: string;
  orderItemList: OrderItem[];
};

const MyOrderPage = () => {
  const { items, fetchItems } = useCartStore();
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [orderList, setOrderList] = useState<Order[]>([]);
  const router = useRouter();

  let jwt = "";
  let user = "";
  let userId = "";

  try {
    if (typeof window != "undefined") {
      jwt = localStorage.getItem("jwt") || "";
      user = localStorage.getItem("user") || "";
      if (user) {
        const userObj = JSON.parse(user);
        userId = userObj.id;
      }
    }
  } catch (e) {
    console.error("Error:", e);
  }

  useEffect(() => {
    fetchItems(userId, jwt);
  }, [userId, jwt, fetchItems, fetchTrigger]);

  const getMyorder = useCallback(async () => {
    const orderList_ = await getToorder(userId, jwt);
    console.log(orderList_);
    setOrderList(orderList_);
  }, [userId, jwt]);

  useEffect(() => {
    if (!jwt) {
      router.push("/");
    }
    getMyorder();
  }, [jwt, getMyorder, router]);

  return (
    <div>
      <h2 className="p-3 bg-green-800 text-white font-bold text-4xl text-center">
        Kütüphanem
      </h2>

      <div className="py-8 mx-7">
        <h2 className="text-2xl textone font-bold">Kütüphane</h2>

        <div className="mt-10">
          {orderList.map((item, index) => (
            <Collapsible key={index}>
              <CollapsibleTrigger className="grid grid-cols-7 mt-3 items-center border borderone p-2 bgone gap-8">
                <h2>
                  <span className="font-bold mr-2">Satın Alım Tarihi :</span>{" "}
                  {moment(item.createdAt).format("DD/MMM/yyyy")}
                </h2>
                <h2>
                  <span className="font-bold mr-2">Toplam :</span>{" "}
                  {item.subtotal}{" "}
                </h2>
                <h2>
                  <span className="font-bold mr-2">Durum :</span> Alındı{" "}
                </h2>
                <h2>
                  <span className="font-bold mr-2">Ödeme :</span>{" "}
                  {item.paymentText}{" "}
                </h2>
                <h2 className="col-span-2">
                  <ArrowDownIcon className="ml-auto" />
                </h2>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {item.orderItemList.map((order: OrderItem, index_: number) => (
                  <MyorderItem key={index_} orderItem={order} />
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrderPage;
