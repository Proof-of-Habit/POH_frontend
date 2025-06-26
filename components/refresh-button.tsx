"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

interface RefreshButtonProps {
  onRefresh: () => void;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
  className?: string;
  showText?: boolean;
}

export function RefreshButton({
  onRefresh,
  size = "sm",
  variant = "outline",
  className = "",
  showText = false,
}: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      onRefresh();
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button
      onClick={handleRefresh}
      disabled={isRefreshing}
      size={size}
      variant={variant}
      className={`${className} ${isRefreshing ? "animate-spin" : ""}`}
    >
      <RefreshCw
        className={`w-4 h-4 ${showText ? "mr-2" : ""} ${
          isRefreshing ? "animate-spin" : ""
        }`}
      />
      {showText && (isRefreshing ? "Refreshing..." : "Refresh")}
    </Button>
  );
}
