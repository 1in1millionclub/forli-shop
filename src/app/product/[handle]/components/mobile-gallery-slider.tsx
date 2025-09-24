"use client";

import {
  useProductImages,
  useSelectedVariant,
} from "@/components/products/variant-selector";
import { Badge } from "@/components/ui/badge";
import { FormattedProduct } from "@/lib/ecommerce/types-sample";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface MobileGallerySliderProps {
  product: FormattedProduct;
}

export function MobileGallerySlider({ product }: MobileGallerySliderProps) {
  const selectedVariant = useSelectedVariant(product);
  const images = useProductImages(product, selectedVariant?.selectedOptions);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: false,
    loop: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onInit = useCallback(() => {
    // Initialize carousel
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit();
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  const totalImages = images.length;

  if (totalImages === 0) return null;

  return (
    <div className="relative w-full h-full">
      {/* Embla Carousel */}
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {images.map((image, index) => (
            <div key={index} className="flex-shrink-0 w-full h-full relative">
              <Image
                style={{
                  aspectRatio: `${image.width} / ${image.height}`,
                }}
                src={image.url}
                alt={"Product image"}
                width={image.width}
                height={image.height}
                className="w-full h-full object-cover"
                quality={100}
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Counter Badge - styled like Latest drop badge */}
      {totalImages > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <Badge variant="outline-secondary">
            {selectedIndex + 1}/{totalImages}
          </Badge>
        </div>
      )}
    </div>
  );
}
