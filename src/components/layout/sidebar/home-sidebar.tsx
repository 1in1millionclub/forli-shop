import { Collection } from "@/lib/ecommerce/types-sample";
import { ShopLinks } from "../shop-links";

interface HomeSidebarProps {
  collections: Collection[];
}

export function HomeSidebar({ collections }: HomeSidebarProps) {
  return (
    <aside className="max-md:hidden col-span-4 h-screen sticky top-0 p-sides pt-top-spacing flex flex-col justify-between">
      <div>
        <p className="italic tracking-tighter text-base">
          Unheard.Unseen.UnYou
        </p>
        <div className="mt-5 text-base leading-tight">
          <p>Islamic Clothing</p>
        </div>
      </div>
      <ShopLinks collections={collections} />
    </aside>
  );
}
