"use client";

import { useConvexAuth } from "convex/react";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SearchInput } from "./search-input";

export default function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter(); 
  return (
    <nav className="w-full py-5 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/">
          <h1 className="text-3xl font-bold">
            Script<span className="text-primary">r</span>
          </h1>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className={buttonVariants({ variant: "ghost" })}>
            Home
          </Link>
          <Link
            href="/blog"
            className={buttonVariants({ variant: "ghost" })}>
            Blog
          </Link>
          <Link
            href="/create"
            className={buttonVariants({ variant: "ghost" })}>
            Create
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:block mr-2">
          <SearchInput />
        </div>
        {isLoading ? null : isAuthenticated ? (
          <Button onClick={() => authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                toast.success("Logged out successfully");
                router.push("/");
              },
              onError: (error) => {
                toast.error(error.error.message);
              }
            }
          })}>Logout</Button>
        ) : (
          <>
            <Link
              href="/auth/sign-up"
              className={buttonVariants()}>
              Sign up
            </Link>
            <Link
              href="/auth/login"
              className={buttonVariants({ variant: "outline" })}>
              Login
            </Link>
          </>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
}
