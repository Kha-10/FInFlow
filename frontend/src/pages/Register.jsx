import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import welcome from "../assets/welcome.svg";
import axios from "@/helper/axios";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  let { dispatch } = useContext(AuthContext);

  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (errors) {
      Object.entries(errors).forEach(([field, error]) => {
        form.setError(field, {
          type: error.type || "manual",
          message: error.msg,
        });
      });
    }
  }, [errors, form]);

  useEffect(() => {
    // Check if the user's system prefers dark mode
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.classList.add("dark");
    }

    // Listen for changes in color scheme preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (e.matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const onSubmit = async (values) => {
    try {
      setErrors(null);
      const res = await axios.post("/api/users/register", values);
      if (res.status === 200) {
        dispatch({ type: "LOGIN", payload: res.data.user });
        navigate("/dashboard");
      }
    } catch (error) {
      setErrors(error.response.data?.errors);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-background text-foreground">
      <div className="w-full max-w-6xl bg-muted text-card-foreground rounded-lg overflow-hidden shadow-xl flex flex-col md:flex-row">
        {/* Left Section - Hidden on mobile */}
        <div className="relative bg-primary-foreground text-primary p-8 md:w-1/2 hidden md:flex flex-col">
          <div className="flex flex-col items-center justify-center flex-1 relative z-10">
            <div className="max-w-[400px] mx-auto mb-8">
              <img src={welcome} alt="welcome" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-center">
              Welcome to SaYate
            </h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="p-8 md:w-1/2">
          <div className="max-w-md mx-auto space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Hello ! Welcome.</h2>
              <p className="text-muted-foreground">
                Sign up with your registration details to stay on top of your
                purchases. We're here to make tracking easy and stress-free!
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                         className="focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                          placeholder="johnDoe123"
                          {...field}
                          {...form.register("username", {
                            required: {
                              value: true,
                              message: "username is required",
                            },
                          })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input
                        className="focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                          placeholder="Example@email.com"
                          {...field}
                          {...form.register("email", {
                            required: {
                              value: true,
                              message: "email is required",
                            },
                          })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Link
                          href="/forgot-password"
                          className="text-sm text-primary hover:underline"
                        >
                          Forgot Password
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            autoComplete="off"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            {...field}
                            {...form.register("password", {
                              required: {
                                value: true,
                                message: "password is required",
                              },
                            })}
                            className="pr-10 focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? (
                              <EyeOffIcon size={20} />
                            ) : (
                              <EyeIcon size={20} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-btn hover:bg-btn/90 text-white"
                >
                  Start now !
                </Button>
              </form>
            </Form>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-btn hover:underline">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
