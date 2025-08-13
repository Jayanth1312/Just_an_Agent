import React from "react";
import { Button } from "@/components/ui/button";

export const BottomGrid: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0">
      {/* Footer Section */}
      <div className="bg-background py-1 px-4 md:px-8">
        <div className="flex items-center justify-center max-w-7xl mx-auto">
          <span className="text-sm font-pecita text-foreground">
            Built by&nbsp;
            <span className="text-blue-600 font-semibold">Jayanth</span>
          </span>
          <div className="w-1 h-1 bg-muted-foreground rounded-full mx-3"></div>
          <Button
            variant="link"
            size="sm"
            className="text-sm h-auto p-0 font-pecita"
            onClick={() =>
              window.open(
                "https://github.com/Jayanth1312/Just_an_Agent",
                "_blank"
              )
            }
          >
            Github
          </Button>
        </div>
      </div>
    </div>
  );
};
