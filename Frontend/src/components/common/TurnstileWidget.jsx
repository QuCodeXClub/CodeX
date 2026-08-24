import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

/**
 * Production-ready Cloudflare Turnstile Component.
 * Powered by @marsidev/react-turnstile for React 19 / StrictMode / SPA lifecycle safety.
 *
 * - Zero custom postMessage or manual iframe manipulation.
 * - Handles script loading, execution, and cleanup automatically.
 * - Forwards reset(), remove(), and getResponse() methods via ref.
 * - Safe against duplicate rendering and StrictMode remounts.
 */
const TurnstileWidget = forwardRef(
  (
    {
      siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY,
      action = "default",
      theme = "auto",
      size = "invisible",
      onSuccess,
      onError,
      onExpire,
      className = "",
      id,
    },
    ref
  ) => {
    const innerRef = useRef(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        try {
          innerRef.current?.reset();
        } catch (err) {
          console.warn("[Turnstile] Reset failed:", err);
        }
      },
      remove: () => {
        try {
          innerRef.current?.remove();
        } catch (err) {
          console.warn("[Turnstile] Remove failed:", err);
        }
      },
      render: () => {
        try {
          innerRef.current?.render();
        } catch (err) {
          console.warn("[Turnstile] Render failed:", err);
        }
      },
      getResponse: () => {
        return innerRef.current?.getResponse();
      },
    }));

    if (!siteKey) {
      if (import.meta.env.DEV) {
        console.warn("[Turnstile] VITE_TURNSTILE_SITE_KEY is not configured.");
      }
      return null;
    }

    return (
      <div id={id} className={`turnstile-wrapper ${className}`.trim()}>
        <Turnstile
          ref={innerRef}
          siteKey={siteKey}
          options={{
            action,
            theme,
            size,
            retry: "auto",
            refreshExpired: "auto",
          }}
          onSuccess={(token) => {
            onSuccess?.(token);
          }}
          onError={(err) => {
            onError?.(err);
          }}
          onExpire={() => {
            onExpire?.();
          }}
        />
      </div>
    );
  }
);

TurnstileWidget.displayName = "TurnstileWidget";

export default TurnstileWidget;
export { TurnstileWidget as CloudflareTurnstile };
