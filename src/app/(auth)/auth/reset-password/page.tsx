"use client";

import { useAuth } from "@/components/auth/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ResetPasswordForm() {
  const { user, resetPasswordUpdate } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  // Local validation helper
  function validatePassword(password: string) {
    // Example: at least 8 characters, 1 number, 1 letter
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { password, confirmPassword } = formData;
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      if (!validatePassword(password)) {
        throw new Error(
          "Password must be at least 8 characters and contain a number and a letter"
        );
      }
      const { error } = await resetPasswordUpdate(password);
      if (error) {
        throw error;
      }
      toast.success("Password updated", {
        description: "Your password has been updated successfully.",
      });
      router.push("/account");
    } catch (error: unknown) {
      // Avoid leaking password details to user here
      toast.error("Error", {
        description:
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message: string }).message
            : "Failed to update password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white text-black p-6" aria-label="Reset password form">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Reset Password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-6">
            <div>
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                aria-required="true"
                aria-describedby="password-help"
                autoComplete="new-password"
                minLength={8}
              />
              <span
                id="password-help"
                className="text-xs text-muted-foreground"
              >
                At least 8 characters, 1 letter & 1 number
              </span>
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                aria-required="true"
                autoComplete="new-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
        <div className="text-center text-sm mt-4">
          <Link
            href="/account"
            className="underline underline-offset-4 hover:text-primary"
          >
            Back to Account
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
