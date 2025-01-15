import { Category } from "@/constans/type";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
interface MobileMenuProps {
  categories: Category[];
}

const MobileMenu = ({ categories }: MobileMenuProps) => {
  return (
    <Sheet>
      <SheetTrigger>
        <MenuIcon />
      </SheetTrigger>
      <SheetContent className="bgone">
        <div className="flex flex-col space-y-5 mt-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.attributes.slug}`}
            >
              {category.attributes.name}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
