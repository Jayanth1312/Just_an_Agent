import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OTPVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  otp: string;
  onOtpChange: (otp: string) => void;
  onVerify: () => void;
  onResend: () => void;
  isLoading: boolean;
}

export const OTPVerificationDialog: React.FC<OTPVerificationDialogProps> = ({
  open,
  onOpenChange,
  email,
  otp,
  onOtpChange,
  onVerify,
  onResend,
  isLoading,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-host-grotesk">
            Verify your email
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm sm:text-base text-muted-foreground">
            We've sent a 6-digit verification code to{" "}
            <span className="font-medium">{email}</span>
          </p>
          <div>
            <Label
              htmlFor="otp-input"
              className="text-sm sm:text-base font-medium"
            >
              Verification code
            </Label>
            <div className="mt-2 flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={onOtpChange}
                disabled={isLoading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onResend}
              className="flex-1 h-10 sm:h-11 text-sm sm:text-base"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Resend code"}
            </Button>
            <Button
              type="button"
              onClick={onVerify}
              className="flex-1 h-10 sm:h-11 text-sm sm:text-base"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
