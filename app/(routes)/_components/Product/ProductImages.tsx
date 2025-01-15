import React from "react";
import Image from "next/image";

interface ProductImagesProps {
  img?: {
    data: {
      attributes: {
        url: string;
        formats?: {
          thumbnail?: {
            url: string;
          };
          small?: {
            url: string;
          };
          medium?: {
            url: string;
          };
          large?: {
            url: string;
          };
        };
      };
    };
  };
}

const ProductImages = ({ img }: ProductImagesProps) => {
  if (!img?.data?.attributes) {
    return null; // Eğer img undefined ise hiçbir şey render etme
  }

  const imageUrl = img.data.attributes.url || ""; // Orijinal URL (Varsayılan)

  return (
    <div className="flex justify-center items-center">
      {imageUrl && (
        <Image
          src={imageUrl} // Tam URL döndüğünden direkt kullanılır
          alt="Product Image"
          width={400}
          height={400}
          unoptimized={true}
          className="rounded-3xl scale-95 w-full transition-all duration-700"
        />
      )}
    </div>
  );
};

export default ProductImages;
