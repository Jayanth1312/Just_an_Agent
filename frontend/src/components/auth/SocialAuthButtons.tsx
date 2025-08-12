import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon, GitHubIcon } from "./AuthIcons";
import { authService } from "@/services/auth";

interface SocialAuthButtonsProps {
  isLoading: boolean;
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  isLoading,
}) => {
  const handleGoogleAuth = () => {
    window.location.href = authService.getGoogleAuthUrl();
  };

  const handleGitHubAuth = () => {
    window.location.href = authService.getGitHubAuthUrl();
  };

  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-sm sm:text-base uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            or with
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="flex w-full items-center justify-center space-x-2 h-10 sm:h-12 py-2 sm:py-3"
          onClick={handleGoogleAuth}
          disabled={isLoading}
        >
          <GoogleIcon className="size-5 sm:size-6" aria-hidden={true} />
          <span className="text-sm sm:text-base font-medium">
            Sign in with Google
          </span>
        </Button>

        <Button
          type="button"
          variant="outline"
          className="flex w-full items-center justify-center space-x-2 h-10 sm:h-12 py-2 sm:py-3"
          onClick={handleGitHubAuth}
          disabled={isLoading}
        >
          <GitHubIcon className="size-5 sm:size-6" aria-hidden={true} />
          <span className="text-sm sm:text-base font-medium">
            Sign in with GitHub
          </span>
        </Button>
      </div>
    </>
  );
};
