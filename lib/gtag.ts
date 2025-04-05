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
    console.warn("Google Analytics gtag is not available.");
  }
};