import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { authService } from "@/services/auth";
import { SocialAuthButtons } from "./SocialAuthButtons";

interface AuthFormProps {
  onForgotPassword: () => void;
  onOTPVerification: (email: string) => void;
  onError: (error: string) => void;
  onSuccess: (message: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string;
  success: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  onForgotPassword,
  onOTPVerification,
  onError,
  onSuccess,
  isLoading,
  setIsLoading,
  error,
  success,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = (email: string) => {
    return emailRegex.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    onError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    onError("");
    onSuccess("");

    if (!validateEmail(formData.email)) {
      onError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      try {
        const loginResponse = await authService.login({
          email: formData.email,
          password: formData.password,
        });

        window.location.href = "/home";
        return;
      } catch (loginError: any) {
        if (loginError.requiresOAuth) {
          onError(
            `${loginError.message} Use the ${loginError.oauthProvider} button below to sign in.`
          );
          setIsLoading(false);
          return;
        }

        if (
          loginError.message?.includes("User not found") ||
          loginError.message?.includes("Invalid email or password") ||
          loginError.message?.includes("Invalid credentials") ||
          loginError.message?.includes("does not exist")
        ) {
          try {
            const registerResponse = await authService.register({
              email: formData.email,
              password: formData.password,
              name: formData.email.split("@")[0],
            });
          } catch (registerError: any) {
            throw registerError;
          }
        } else {
          throw loginError;
        }
      }
    } catch (err: any) {
      if (err.requiresOAuth) {
        onError(
          `${err.message} Use the ${err.oauthProvider} button below to sign in.`
        );
      } else {
        onError(err.message || "Authentication failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-center text-xl sm:text-2xl md:text-2xl lg:text-3xl font-semibold text-foreground font-host-grotesk mb-6 sm:mb-8">
        Log in or create account
      </h2>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm sm:text-base text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm sm:text-base text-green-600">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <Label
            htmlFor="email-login-02"
            className="text-sm sm:text-base font-medium text-foreground dark:text-foreground"
          >
            Email
          </Label>
          <Input
            type="email"
            id="email-login-02"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            autoComplete="email"
            placeholder="example@mail.com"
            className="mt-2 h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base placeholder:text-sm sm:placeholder:text-base"
            required
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password-login-02"
              className="text-sm sm:text-base font-medium text-foreground dark:text-foreground"
            >
              Password
            </Label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm sm:text-base text-blue-600 hover:text-blue-500 font-medium cursor-pointer"
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>
          <div className="relative mt-2">
            <Input
              type={showPassword ? "text" : "password"}
              id="password-login-02"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              autoComplete="password"
              placeholder="********"
              className="pr-10 sm:pr-12 h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base placeholder:text-sm sm:placeholder:text-base"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <IconEyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              ) : (
                <IconEye className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
        <Button
          type="submit"
          className="mt-4 w-full h-10 sm:h-12 py-2 sm:py-3 text-sm sm:text-base font-medium"
          disabled={isLoading}
        >
          {isLoading ? "Please wait..." : "Continue"}
        </Button>
      </form>

      <SocialAuthButtons isLoading={isLoading} />
    </div>
  );
};
