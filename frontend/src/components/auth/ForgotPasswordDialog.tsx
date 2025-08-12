import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onEmailChange: (email: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({
  open,
  onOpenChange,
  email,
  onEmailChange,
  onSubmit,
  isLoading,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-host-grotesk">
            Reset your password
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm sm:text-base text-muted-foreground">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
          <div>
            <Label
              htmlFor="forgot-email"
              className="text-sm sm:text-base font-medium"
            >
              Email address
            </Label>
            <Input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="Enter your email"
              className="mt-2 h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base"
            />
          </div>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-10 sm:h-11 text-sm sm:text-base"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onSubmit}
              className="flex-1 h-10 sm:h-11 text-sm sm:text-base"
              disabled={isLoading || !email}
            >
              {isLoading ? "Sending..." : "Send reset link"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
