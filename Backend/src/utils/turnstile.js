/**
 * Production Cloudflare Turnstile server-side verification.
 *
 * Cloudflare requires every Turnstile token to be validated server-side
 * through the Siteverify API before processing the protected request.
 *
 * @param {string} token - cf-turnstile-response token from the client
 * @param {string} [remoteip] - Optional visitor IP address
 * @param {string} expectedAction - Expected Turnstile action
 *
 * @returns {Promise<boolean>} true only when the token is fully validated
 */
const verifyTurnstileToken = async (
  token,
  remoteip,
  expectedAction
) => {
  const secret = process.env.TURNSTILE_SECRET;

  /*
   * Production must have a configured secret.
   * Never bypass Turnstile when the secret is missing.
   */
  if (!secret) {
    console.error(
      '[Turnstile] TURNSTILE_SECRET is not configured.'
    );

    return false;
  }

  /*
   * Turnstile tokens:
   * - must be strings
   * - must not be empty
   * - maximum length is 2048 characters
   */
  if (
    typeof token !== 'string' ||
    token.trim().length === 0 ||
    token.length > 2048
  ) {
    return false;
  }

  const cleanToken = token.trim();

  /*
   * Expected action is required in production.
   *
   * Example:
   *   login
   *   register
   *   contact
   *   subscribe
   */
  if (
    typeof expectedAction !== 'string' ||
    expectedAction.trim().length === 0
  ) {
    console.error(
      '[Turnstile] expectedAction is required.'
    );

    return false;
  }

  const expectedHostnames = new Set(
    (process.env.TURNSTILE_HOSTNAMES || 'qucodex.com,api.qucodex.com,localhost,127.0.0.1')
      .split(',')
      .map((hostname) => hostname.trim())
      .filter(Boolean)
  );

  /*
   * Hostname validation should be configured for production.
   *
   * Example:
   *
   * TURNSTILE_HOSTNAMES=example.com,www.example.com
   */
  if (expectedHostnames.size === 0) {
    console.error(
      '[Turnstile] TURNSTILE_HOSTNAMES is not configured.'
    );

    return false;
  }

  /*
   * Prepare Siteverify request.
   *
   * Cloudflare accepts application/x-www-form-urlencoded.
   */
  const bodyParams = {
    secret,
    response: cleanToken,
  };

  /*
   * remoteip is optional.
   *
   * Only send it when the application has a reliable client IP.
   * Do not invent or transform proxy IPs here.
   */
  if (
    typeof remoteip === 'string' &&
    remoteip.trim().length > 0
  ) {
    bodyParams.remoteip = remoteip.trim();
  }

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/x-www-form-urlencoded',
        },

        body: new URLSearchParams(bodyParams),

        /*
         * Never allow a request to hang indefinitely
         * while waiting for Cloudflare.
         */
        signal: AbortSignal.timeout(10_000),
      }
    );

    /*
     * Siteverify HTTP failure is a verification failure.
     *
     * IMPORTANT:
     * Never bypass Turnstile because Cloudflare is temporarily
     * unavailable. Production authentication/security checks
     * should fail closed.
     */
    if (!response.ok) {
      console.error(
        `[Turnstile] Siteverify returned HTTP ${response.status}.`
      );

      return false;
    }

    const result = await response.json();

    /*
     * Cloudflare must explicitly report success.
     */
    if (!result || result.success !== true) {
      const errorCodes = Array.isArray(result?.['error-codes'])
        ? result['error-codes']
        : [];

      console.warn(
        `[Turnstile] Verification failed: ${JSON.stringify(
          errorCodes
        )}`
      );

      return false;
    }

    /*
     * Validate the action returned by Cloudflare.
     *
     * This prevents a valid Turnstile token generated for one
     * protected action from being reused for another action.
     */
    if (result.action !== expectedAction) {
      console.warn(
        `[Turnstile] Action mismatch. Expected "${expectedAction}", received "${result.action}".`
      );

      return false;
    }

    /*
     * Validate the hostname returned by Cloudflare.
     *
     * This prevents tokens generated for an unexpected domain
     * from being accepted by this backend.
     */
    if (
      typeof result.hostname !== 'string' ||
      !expectedHostnames.has(result.hostname)
    ) {
      console.warn(
        `[Turnstile] Hostname mismatch. Received "${result.hostname}".`
      );

      return false;
    }

    /*
     * Everything required by the production validation flow
     * has passed.
     */
    return true;
  } catch (error) {
    /*
     * Network errors, timeout errors, JSON parsing errors, etc.
     * are all verification failures.
     *
     * Never return true here in production.
     */
    console.error(
      '[Turnstile] Siteverify request failed:',
      error
    );

    return false;
  }
};

export { verifyTurnstileToken };
