"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import HomeProductSkeleton from "../_components/Skeleton/HomeProductSkeleton";
import ProductItem from "../_components/Product/ProductItem";

interface Filters {
  search?: string;
  category?: string;
  page: number;
}

const PageContents = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>(searchParams.get("q") || "");
  const [category, setCategory] = useState<string>(
    searchParams.get("category") || "all"
  );
  const [categories, setCategories] = useState<any[]>([]);
  const [page, setPage] = useState<number>(
    parseInt(searchParams.get("page") || "1")
  );

  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const fetchProducts = useCallback(
    async (filters: Filters) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.search) {
          params.append("filters[name][$contains]", filters.search);
        }
        if (filters.category && filters.category !== "all") {
          params.append("filters[category][slug][$eq]", filters.category);
        }
        params.append("pagination[page]", filters.page.toString());
        params.append("pagination[pageSize]", pageSize.toString());

        const response = await axios.get(
          `${
            process.env.NEXT_PUBLIC_BACKEND_API_URL
          }/products?populate=*&${params.toString()}`
        );
        setProducts(response.data.data);
        setTotalPages(response.data.meta.pagination.pageCount);
      } catch (error) {
        console.log("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    fetchProducts({
      search: searchParams.get("q") || "",
      category: searchParams.get("category") || "all",
      page: parseInt(searchParams.get("page") || "1"),
    });
  }, [searchParams, fetchProducts]);

  const updateURL = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== "page") {
      newParams.set("page", "1");
    }
    router.push(`/search?${newParams.toString()}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const timeout = setTimeout(() => {
      updateURL("q", value);
    }, 2000);
    setDebounceTimeout(timeout);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    updateURL("category", value);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    updateURL("page", newPage.toString());
  };

  return (
    <div className="container mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bgone borderone p-2 rounded-md">
        <Input
          className="w-full"
          placeholder="Search...."
          onChange={handleSearchChange}
        />
        <Select onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.attributes.slug}>
                {category.attributes.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        {loading ? (
          <HomeProductSkeleton />
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-8 mb-8">
              {products.map((product, index) => (
                <ProductItem key={index} product={product} />
              ))}
            </div>

            <div className="flex justify-center items-center mt-8 mb-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() => handlePageChange(page - 1)}
                      aria-disabled={page === 1}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        onClick={() => handlePageChange(i + 1)}
                        className={
                          i + 1 === page ? "border border-blue-500" : ""
                        }
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() => handlePageChange(page + 1)}
                      aria-disabled={page === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageContents;
