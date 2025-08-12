import { useState } from "react";
import { authService } from "@/services/auth";

export const useAuthState = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otp, setOtp] = useState("");
  const [registrationEmail, setRegistrationEmail] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = (email: string) => {
    return emailRegex.test(email);
  };

  const handleOTPVerraction = async () => {
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    console.log(
      `Attempting OTP verification - Email: ${registrationEmail}, OTP: ${otp}`
    );

    setIsLoading(true);
    setError("");

    try {
      const response = await authService.verifyOTP({
        email: registrationEmail,
        otp: otp,
      });
      console.log("OTP verification successful:", response);
      setShowOTPVerification(false);
      window.location.href = "/welcome";
    } catch (err: any) {
      console.error("OTP verification failed:", err);
      setError(err.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError("");

    try {
      await authService.resendOTP(registrationEmail);
      setSuccess("New verification code sent to your email!");
    } catch (err: any) {
      setError(err.message || "Failed to resend verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("Please enter your email address first");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await authService.requestPasswordReset(formData.email);
      setSuccess("Password reset email sent! Check your inbox.");
      setShowForgotPassword(false);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = (email: string) => {
    console.log("🔐 OTP verification triggered for:", email);
    setRegistrationEmail(email);
    setShowOTPVerification(true);
    console.log("📱 OTP modal should now be visible");
  };

  const updateFormEmail = (email: string) => {
    setFormData((prev) => ({ ...prev, email }));
  };

  return {
    // State
    isLoading,
    setIsLoading,
    error,
    setError,
    success,
    setSuccess,
    showForgotPassword,
    setShowForgotPassword,
    showOTPVerification,
    setShowOTPVerification,
    otp,
    setOtp,
    registrationEmail,
    formData,
    setFormData,

    // Functions
    validateEmail,
    handleOTPVerraction,
    handleResendOTP,
    handleForgotPassword,
    handleOTPVerification,
    updateFormEmail,
  };
};
