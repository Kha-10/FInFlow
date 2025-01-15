import React from "react";
import {
  MoonIcon,
  SunIcon,
  Smartphone,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ui/theme-provider";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import axios from "@/helper/axios";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { user, dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("system");
    } else {
      setTheme("dark");
    }
  };

  const logout = async () => {
    let res = await axios.post("/api/users/logout");
    if (res.status === 200) {
      dispatch({ type: "LOGOUT" });
      localStorage.removeItem('twj')
      navigate("/login");
    }
  };

  return (
    <header className="px-8 md:fixed sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <span className="font-bold">SaYate</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="bg-card"
          >
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-10 w-10 text-white hover:text-white rounded-full bg-blue-400 hover:bg-blue-400/90"
              >
                <p>{user.username.charAt(0).toUpperCase()}</p>
                {/* <p>gg</p> */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.username}
                    {/* gg */}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                    {/* gg */}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
