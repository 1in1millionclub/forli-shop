"use client";

import {
  useProductImages,
  useSelectedVariant,
} from "@/components/products/variant-selector";
import { FormattedProduct } from "@/lib/ecommerce/types-sample";
import Image from "next/image";

export const DesktopGallery = ({ product }: { product: FormattedProduct }) => {
  const selectedVariant = useSelectedVariant(product);
  const images = useProductImages(product, selectedVariant?.selectedOptions);

  return images.map((image, idx) => (
    <Image
      style={{
        aspectRatio: `${image.width} / ${image.height}`,
      }}
      // key={`${image.url}-${image.selectedOptions?.map(o => `${o.name},${o.value}`).join('-')}`}
      key={`${image.url}-${idx}`}
      src={image.url}
      alt={"Product image"}
      width={image.width}
      height={image.height}
      className="w-full object-cover"
      quality={100}
    />
  ));
};
