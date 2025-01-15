"use client";
import { getSliders } from "@/actions/getSliders";
import { Slider } from "@/constans/type";
import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";
import SliderSkeleton from "./Skeleton/SliderSkeleton";

const Sliders = () => {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const sliders: Slider[] = await getSliders();
        setSliders(sliders);
      } catch (error) {
        console.error("Failed to fetch sliders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || ""; // Çevresel değişken kontrolü

  return (
    <div>
      {loading ? (
        <SliderSkeleton />
      ) : (
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
        >
          <CarouselContent>
            {sliders.map((slider) => {
              // Sadece orijinal URL alınıyor
              const imageUrl =
                slider.attributes.media?.data?.attributes?.url || ""; // Orijinal URL (varsayılan)
              return (
                <CarouselItem key={slider.id}>
                  <Link href={"/"}>
                    <Image
                      alt="slider"
                      unoptimized={true}
                      src={imageUrl}
                      width={500}
                      height={300}
                      className="w-full h-[200px] md:h-[650px] object-cover mt-2"
                    />
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      )}
    </div>
  );
};

export default Sliders;
