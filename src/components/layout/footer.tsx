/* eslint-disable @next/next/no-img-element */
import { getCollections } from "@/lib/ecommerce";
import { ShopLinks } from "./shop-links";
import { SidebarLinks } from "./sidebar/product-sidebar-links";

export async function Footer() {
  const collections = await getCollections();
  return (
    <footer className="p-sides">
      <div className="w-full md:h-[532px] p-sides md:p-11 text-background bg-foreground rounded-[12px] flex flex-col justify-between max-md:gap-8">
        <div className="flex flex-col justify-between md:flex-row p-8">
          {/* <LogoSvg className="md:basis-3/4 max-md:w-full max-w-[1200px] h-auto block" /> */}
          <img
            src="/forli-logo.png"
            alt="Logo"
            className="md:basis-1/4 max-md:w-full max-w-[1000px] h-auto block invert"
          />

          <ShopLinks
            collections={collections}
            className="max-md:hidden"
            align="right"
          />
          <span className="mt-3 italic font-semibold md:hidden">
            Unheard.Unseen.UnYou
          </span>
        </div>
        <div className="flex justify-between max-md:contents text-muted-foreground">
          <SidebarLinks
            className="max-w-[450px] w-full max-md:flex-col"
            size="base"
            invert
          />
          <p className="text-base">
            {new Date().getFullYear()}© — All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
