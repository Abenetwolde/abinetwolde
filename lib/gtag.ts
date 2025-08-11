'use client';

import { useState, useEffect } from "react";

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "G-ECDEKL29XG";

interface EventParams {
  action: string;
  category: string;
  label: string;
  value?: number;
}

export const event = ({ action, category, label, value }: EventParams) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } else {
    console.warn("Google Analytics gtag is not available. Event not sent:", { action, category, label, value });
  }
};

// Custom hook to check gtag availability
export const useGtag = () => {
  const [isGtagReady, setIsGtagReady] = useState(false);

  useEffect(() => {
    const checkGtag = () => {
      if (typeof window !== "undefined" && window.gtag) {
        setIsGtagReady(true);
      }
    };
    checkGtag(); // Initial check
    const interval = setInterval(checkGtag, 500); // Poll every 500ms
    return () => clearInterval(interval);
  }, []);

  return isGtagReady;
};