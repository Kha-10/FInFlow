import React from "react";
import { MoonIcon, SunIcon, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ui/theme-provider";
import { Link } from "react-router-dom";

const Header = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("system");
    } else {
      setTheme("dark");
    }
  };

  return (
    <header className="px-8 md:fixed sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold">Purchase Tracker</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          <SunIcon
            className={`h-[1.2rem] w-[1.2rem] transition-all ${
              theme === "light" ? "rotate-0 scale-100" : "rotate-90 scale-0"
            }`}
          />
          <MoonIcon
            className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
              theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
            }`}
          />
          <Smartphone
            className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
              theme === "system" ? "rotate-0 scale-100" : "rotate-90 scale-0"
            }`}
          />

          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;