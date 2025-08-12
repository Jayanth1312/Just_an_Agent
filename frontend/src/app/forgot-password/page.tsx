"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Link from "next/link";
import { authService } from "@/services/auth";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }

    try {
      await authService.requestPasswordReset(email);
      setIsSuccess(true);
    } catch (error: any) {
      setError(
        error.message || "Failed to send reset email. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen relative">
        <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-4">
                Check Your Email
              </h2>

              <p className="text-muted-foreground mb-6">
                We've sent a password reset link to{" "}
                <span className="font-medium text-foreground">{email}</span>
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 text-blue-700">
                  <Mail className="w-5 h-5" />
                  <p className="text-sm font-medium">
                    Email sent successfully!
                  </p>
                </div>
                <p className="text-sm text-blue-600 mt-2">
                  The reset link will expire in 10 minutes. Don't see the email?
                  Check your spam folder.
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail("");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Try again
                </Button>
                <Link href="/">
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to auth
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen relative">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Forgot your password?
            </h2>
            <p className="text-muted-foreground">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="mt-2"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full py-2 font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send reset link"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/">
              <Button variant="ghost" className="text-sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to auth
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
