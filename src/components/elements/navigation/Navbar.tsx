"use client";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FaBasketball } from "react-icons/fa6";
import { LogoutButton } from "../buttons/LogoutButton";
import { ToggleThemeMode } from "../buttons/ToggleThemeMode";

const LINK = (props: {
  href: string;
  label: React.ReactNode;
  setIsOpen: (isOpen: boolean) => void;
}) => (
  <Link
    href={props.href}
    className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl px-4 py-2 tracking-wide font-semibold border border-gray-100 dark:border-gray-700 text-sm"
    onClick={() => props.setIsOpen(false)}
  >
    {props.label}
  </Link>
);

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex justify-between items-center p-4 relative">
      <div>Logo</div>
      <div className="space-x-4">
        <ToggleThemeMode />
        <Button
          type="button"
          size="icon"
          variant={"outline"}
          className="h-12 w-12"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBasketball />
        </Button>
        {isOpen && (
          <section className="absolute top-16 right-4 max-w-[250px] bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg z-50">
            <nav className="grid gap-2">
              <LINK href="/" label="Home" setIsOpen={setIsOpen} />
              <LINK href="/" label="Basketball" setIsOpen={setIsOpen} />
              <LINK
                href="/profile"
                label={
                  <span className="flex items-center gap-2">
                    <User /> Mon Compte
                  </span>
                }
                setIsOpen={setIsOpen}
              />
              <LogoutButton onClick={() => setIsOpen(false)} />
            </nav>
          </section>
        )}
      </div>
    </div>
  );
};
