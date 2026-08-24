import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { Turnstile } from "@marsidev/react-turnstile";

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
    const turnstileRef = useRef(null);

    useImperativeHandle(
      ref,
      () => ({
        reset: () => turnstileRef.current?.reset(),

        remove: () => turnstileRef.current?.remove(),

        render: () => turnstileRef.current?.render(),

        getResponse: () =>
          turnstileRef.current?.getResponse() ?? null,
      }),
      []
    );

    if (!siteKey) {
      if (import.meta.env.DEV) {
        console.error(
          "[Turnstile] VITE_TURNSTILE_SITE_KEY is missing."
        );
      }

      return null;
    }

    return (
      <div
        id={id}
        className={`turnstile-wrapper ${className}`.trim()}
      >
        <Turnstile
          ref={turnstileRef}
          siteKey={siteKey}
          options={{
            action,
            theme,
            size,
            retry: "auto",
            refreshExpired: "auto",
          }}
          onSuccess={onSuccess}
          onError={onError}
          onExpire={onExpire}
        />
      </div>
    );
  }
);

TurnstileWidget.displayName = "TurnstileWidget";

export default TurnstileWidget;

export { TurnstileWidget as CloudflareTurnstile };
