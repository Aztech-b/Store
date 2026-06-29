import type { SanityImageSource } from "@sanity/image-url";

export type Variant = { _key: string; _type: string; canChangePrice: boolean; variantName: string; values: string[] };

export type ProductData = {
    name: string;
    description: string;
    category: string | "t-shirt" | "accessories" | "hats" | "sneakers";
    image: SanityImageSource;
    price: number;
    variants: {}[];
};
