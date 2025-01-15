export type Category = {
  id: number;
  attributes: {
    name: string;
    slug: string;
    image?: {
      data?: {
        attributes: {
          url: string;
        };
      };
    };
  };
};


export type Slider = {
  id: number;
  attributes: {
    url: string; // Slider bağlantısı
    media?: {
      data?: {
        attributes: {
          url: string; // Görsel URL'si
        };
      };
    };
  };
};


export type ProductImages = {
  data?: {
    id: number;
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

export type Product = {
  id: number;
  attributes: {
    name: string;
    description: string;
    slug: string;
    mrp: number;
    sellingPrice: number;
    isTop: boolean;
    recent: boolean;
    category?: {
      data?: {
        attributes: {
          name: string;
          slug: string;
        };
      };
    };
    img?: {
      data: {
        attributes: {
          url: string;
          formats?: {
            thumbnail?: { url: string };
            small?: { url: string };
            medium?: { url: string };
            large?: { url: string };
          };
        };
      };
    };
  };
};




