"use client";
import { useToast } from "@/hooks/use-toast";
import Slider from "../_components/Slider";
import CategoryList from "../_components/CategoryList";
import ProductList from "../_components/Product/ProductList";

export default function Home() {
  const { toast } = useToast();
  return (
    <>
      <Slider />
      <CategoryList />
      <ProductList />
    </>
  );
}
