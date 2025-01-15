"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useCartStore from "@/hooks/useCartStore";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createOrder } from "@/actions/Cart/createOrder";
import { DeleteToCart } from "@/actions/Cart/deleteToCart";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name en az 2 karakter olmalıdır." }),
  phone: z.string().min(2, { message: "Phone en az 2 karakter olmalıdır." }),
  address: z
    .string()
    .min(2, { message: "Adres en az 2 karakter olmalıdır." }),
  holdername: z
    .string()
    .min(2, { message: "İsim en az 2 karakter olmalıdır." }),
  ccnumber: z
    .string()
    .regex(/^\d{16}$/, { message: "Kart numarası 16 karakter olmalıdır." }),
  month: z.preprocess(
    (val) => Number(val),
    z
      .number()
      .min(1, { message: "Ay gereklidir." })
      .max(12, { message: "Ay 1 ve 12 arasında olmalıdır" })
  ),
  year: z.preprocess(
    (val) => Number(val),
    z.number().min(new Date().getFullYear(), {
      message: "Yıl şu anki veya gelecekteki olmalıdır.",
    })
  ),
  cvc: z.string().regex(/^\d{3,4}$/, { message: "CVC 3 haneli olmalıdır." }),
});

type FormData = z.infer<typeof formSchema>;

interface CheckoutFormProps {
  subtotal: string;
  userId: string;
  jwt: string;
}

const Checkoutform = ({ subtotal, jwt, userId }: CheckoutFormProps) => {
  const { items, fetchItems } = useCartStore();
  const [response, setResponse] = useState(null);
  const { toast } = useToast();

  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Can Yavuz",
      phone: "+90 507 100 1007",
      address: "Kayseri Turkey",
      holdername: "Ramazan Serhat Uygun",
      ccnumber: "5890040000000016",
      month: 4,
      year: 2029,
      cvc: "159",
    },
  });

  const onSubmit = async (data: FormData) => {
    const paymentCard = {
      cardHolderName: data.holdername,
      cardNumber: data.ccnumber,
      expireMonth: data.month,
      expireYear: data.year,
      cvc: data.cvc,
      registerCard: "0",
    };

    const buyer = {
      id: "BY789",
      name: data.name,
      surname: "Yavuz",
      gsmNumber: data.phone,
      email: "birisi@gmail.com",
      identityNumber: "11111111111",
      lastLoginDate: "2024-10-05 12:43:35",
      registrationDate: "2023-04-21 15:12:09",
      registrationAddress: data.address,
      ip: "85.34.78.112",
      city: "Rize",
      country: "Türkiye",
      zipCode: "53000",
    };

    const shippingAddress = {
      contactName: data.name,
      city: "Rize",
      country: "Türkiye",
      address: data.address,
      zipCode: "53000",
    };

    const billingAddress = {
      contactName: data.name,
      city: "Rize",
      country: "Türkiye",
      address: data.address,
      zipCode: "53000",
    };

    const basketItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      category1: "Collectibles",
      category2: "Accessories",
      itemType: "PHYSICAL",
      price: item.amount,
    }));

    const paymentData = {
      price: subtotal,
      paidPrice: subtotal,
      currency: "TRY",
      basketId: "B67832",
      paymentCard: paymentCard,
      buyer: buyer,
      shippingAddress: shippingAddress,
      billingAddress: billingAddress,
      basketItems: basketItems,
    };

    try {
      const response = await axios.post(
        "https://webvemobilprogramlama.com/api/payment",
        paymentData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setResponse(response.data);

      if (response.data.status === "success") {
        const payload = {
          data: {
            name: data.name,
            address: data.address,
            phone: data.phone,
            userId: userId,
            subtotal: subtotal,
            paymentText: "Iyzico",
            OrderItemList: items,
          },
        };

        await createOrder(payload, jwt);

        items.forEach((item, index) => {
          DeleteToCart(item.id, jwt).then((resp) => {});
        });

        toast({
          variant: "success",
          title: "Satın Alım Başarılı",
        });

        fetchItems(userId, jwt);

        router.push("/my-order");
      } else {
        toast({
          variant: "destructive",
          title: "Satın Alım Sırasında Bir Hata Meydana Geldi",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Satın Alım Sırasında Bir Hata Meydana Geldi" + error,
      });
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="border-b borderone text-2xl">Adres</h2>
          <div className="flex flex-row gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="textone">Ad Soyad</FormLabel>
                  <FormControl>
                    <Input placeholder="Adınız Soyadınız" {...field} />
                  </FormControl>
                  <FormMessage className="validationLogin" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="textone">Telefon</FormLabel>
                  <FormControl>
                    <Input placeholder="+90 5xx xxx xxxx" {...field} />
                  </FormControl>
                  <FormMessage className="validationLogin" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="textone">Address</FormLabel>
                <FormControl>
                  <Input placeholder="Adresiniz..." {...field} />
                </FormControl>
                <FormMessage className="validationLogin" />
              </FormItem>
            )}
          />

          <div className="h-8"></div>
          <h2 className="border-b borderone text-2xl">Kart Bilgileri</h2>

          <div className="flex flex-row gap-4">
            <FormField
              control={form.control}
              name="holdername"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="textone">Kart Üzerindeki İsim</FormLabel>
                  <FormControl>
                    <Input placeholder="Ad Soyad" {...field} />
                  </FormControl>
                  <FormMessage className="validationLogin" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ccnumber"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="textone">Kart Numarası</FormLabel>
                  <FormControl>
                    <Input placeholder="xxxxxxxxxxxxxxxx" {...field} />
                  </FormControl>
                  <FormMessage className="validationLogin" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-row gap-4">
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="textone">Ay</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ay" {...field} />
                  </FormControl>
                  <FormMessage className="validationLogin" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="textone">Yıl</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Yıl" {...field} />
                  </FormControl>
                  <FormMessage className="validationLogin" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cvc"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="textone">CVC</FormLabel>
                  <FormControl>
                    <Input placeholder="CVC" {...field} />
                  </FormControl>
                  <FormMessage className="validationLogin" />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit">Ödeme Yap</Button>
        </form>
      </Form>
    </div>
  );
};

export default Checkoutform;
