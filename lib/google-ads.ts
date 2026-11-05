const ENQUIRY_CONVERSION = 'AW-18251440604/aXkNCPWo5rIdENzD-_5D';

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, parameters: { send_to: string }) => void;
    dataLayer?: IArguments[];
  }
}

export function trackEnquiryConversion() {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  const gtag = window.gtag || function () { window.dataLayer!.push(arguments); };
  gtag('event', 'conversion', { send_to: ENQUIRY_CONVERSION });
}
