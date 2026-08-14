/**
 * Canonical Cloudflare Turnstile server-side siteverify call
 * @param {string} token - The cf-turnstile-response token from the client request
 * @param {string} [remoteip] - Optional client IP address
 * @returns {Promise<boolean>} True if verification succeeds, false otherwise
 */
const verifyTurnstileToken = async (token, remoteip) => {
  const secret = process.env.TURNSTILE_SECRET || process.env.TURNSTILE_SECRET_KEY;
  const isDev = process.env.NODE_ENV === 'development';

  if (!secret) {
    if (isDev) {
      console.warn('[DEV] TURNSTILE_SECRET is not defined in env. Skipping bot check for dev.');
      return true; 
    }
    console.error('[PROD ERROR] TURNSTILE_SECRET is missing in production environment.');
    return false;
  }

  if (!token) {
    return false;
  }

  // Cloudflare official dummy test keys (always pass regardless of environment)
  const isDummySecret = secret === '1x0000000000000000000000000000000AA' || secret.startsWith('1x000000000');
  if (isDummySecret) {
    return true;
  }

  // Auto-verified fallback token (only allowed in local development)
  if (isDev && (token === 'auto-verified-token' || token === 'XXXX.DUMMY.TOKEN.XXXX')) {
    return true;
  }

  const bodyParams = {
    secret,
    response: token,
  };

  if (remoteip) {
    bodyParams.remoteip = remoteip;
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(bodyParams),
    });

    if (!response.ok) {
      console.error(`Turnstile siteverify HTTP error: status ${response.status}`);
      if (isDev) {
        console.warn('[DEV] Turnstile HTTP error. Bypassing bot check for dev environment.');
        return true;
      }
      return false;
    }
    
    const data = await response.json();
    if (data && data.success) {
      return true;
    }

    console.warn('[SECURITY] Turnstile siteverify failed with codes:', data ? data['error-codes'] : 'unknown error');

    // In development mode, allow localhost testing even if Turnstile returns domain/token errors
    if (isDev) {
      console.warn('[DEV] Bypassing Turnstile bot verification failure for local development environment.');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    if (isDev) {
      console.warn('[DEV] Turnstile network error. Bypassing bot check for dev environment.');
      return true;
    }
    return false;
  }
};

export { verifyTurnstileToken };
