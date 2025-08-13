"use client";

import React from "react";
import {
  AuthLayout,
  AuthForm,
  ForgotPasswordDialog,
  OTPVerificationDialog,
} from "./auth/index";
import { useAuthState } from "./auth/useAuthState";

export default function Login02() {
  const {
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
    handleOTPVerraction,
    handleResendOTP,
    handleForgotPassword,
    handleOTPVerification,
    updateFormEmail,
  } = useAuthState();

  return (
    <AuthLayout>
      <AuthForm
        onForgotPassword={() => setShowForgotPassword(true)}
        onOTPVerification={handleOTPVerification}
        onError={setError}
        onSuccess={setSuccess}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        error={error}
        success={success}
      />

      <ForgotPasswordDialog
        open={showForgotPassword}
        onOpenChange={setShowForgotPassword}
        email={formData.email}
        onEmailChange={updateFormEmail}
        onSubmit={handleForgotPassword}
        isLoading={isLoading}
      />

      <OTPVerificationDialog
        open={showOTPVerification}
        onOpenChange={setShowOTPVerification}
        email={registrationEmail}
        otp={otp}
        onOtpChange={setOtp}
        onVerify={handleOTPVerraction}
        onResend={handleResendOTP}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
}
