import axios from "axios";
import { useEffect, useState } from "react";
import { PriceBreakdown, PriceOrderRequest, priceOrder } from "./api";

// Wait this long after the last change before asking for prices, so that
// quickly changing quantities sends one request rather than many.
const DEBOUNCE_MS = 150;

// usePriceBreakdown keeps a price breakdown from the backend up to date with
// the request. While a new breakdown loads, the previous one is still returned.
export const usePriceBreakdown = (request: PriceOrderRequest) => {
  const [breakdown, setBreakdown] = useState<PriceBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // compare by value: callers build a new request object on every render
  const requestKey = JSON.stringify(request);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const result = await priceOrder(JSON.parse(requestKey), controller.signal);
        setBreakdown(result);
        setHasError(false);
      } catch (err) {
        if (axios.isCancel(err)) {
          return;
        }
        console.error(err);
        setHasError(true);
      }
      setIsLoading(false);
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [requestKey]);

  return { breakdown, isLoading, hasError };
};
