"use client";
import { getCategories } from "@/actions/getCategories";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CategorySkeleton from "./Skeleton/CategorySkeleton";
import { Category } from "@/constans/type"; // Türü içe aktarın

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]); // Tür belirtildi
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        setCategories(categories);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || ""; // Çevresel değişken kontrolü

  return (
    <>
      {loading ? (
        <CategorySkeleton />
      ) : (
        <div className="mt-10 container">
          <h2 className="textone font-semibold text-2xl lg:text-3xl">
            Shop By Category
          </h2>
          <div
            className="grid mt-8 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6
            xl:grid-cols-7 gap-4"
          >
            {categories.map((category) => {
              // Görsel URL'sini formatlara göre seçme
              const imageUrl =
                category.attributes.image?.data?.attributes?.url ||
                ""; // Orijinal URL (Varsayılan)

              return (
                <Link
                  href={`/search?category=${category.attributes.slug}`}
                  key={category.id}
                  className="flex flex-col rounded-xl gap-2 items-center p-3 border borderone cursor-pointer"
                >
                  {imageUrl ? (
                    <Image
                      alt="Category Image"
                      unoptimized={true}
                      src={imageUrl} // Backend URL gerekmez, tam URL API'den dönüyor
                      width={500}
                      height={300}
                      className="w-16 h-16"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-full">
                      No Image
                    </div>
                  )}
                  {category.attributes.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryList;
