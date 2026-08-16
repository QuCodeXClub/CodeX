/**
 * Canonical Cloudflare Turnstile server-side siteverify call
 * @param {string} token - The cf-turnstile-response token from the client request
 * @param {string} [remoteip] - Optional client IP address
 * @returns {Promise<boolean>} True if verification succeeds, false otherwise
 */
const verifyTurnstileToken = async (token, remoteip) => {
  let secret = process.env.TURNSTILE_SECRET || process.env.TURNSTILE_SECRET_KEY;
  if (secret) {
    // Strip quotes or trailing spaces if pasted with quotes into .env
    secret = secret.replace(/^["']|["']$/g, '').trim();
  }
  const isDev = process.env.NODE_ENV !== 'production';

  if (!secret) {
    if (isDev) {
      console.warn('[DEV] TURNSTILE_SECRET is not defined in env. Skipping bot check for dev.');
      return true;
    }
    console.error('[PROD ERROR] TURNSTILE_SECRET is missing in environment variables.');
    return false;
  }

  if (!token || typeof token !== 'string' || !token.trim()) {
    return false;
  }

  const cleanToken = token.trim();

  // Cloudflare official dummy test keys (always pass regardless of environment)
  const isDummySecret = secret === '1x0000000000000000000000000000000AA' || secret.startsWith('1x000000000');
  if (isDummySecret) {
    return true;
  }

  // Auto-verified fallback token (only allowed in local/non-production environments)
  if (isDev && (cleanToken === 'auto-verified-token' || cleanToken.startsWith('auto-verified') || cleanToken === 'XXXX.DUMMY.TOKEN.XXXX')) {
    return true;
  }

  const bodyParams = {
    secret: secret.trim(),
    response: cleanToken,
  };

  // Only pass remoteip if it is a valid public IP (prevents 'invalid-remoteip' failures behind Docker/Nginx/AWS proxies)
  const isPublicIp = (ip) => {
    if (!ip || typeof ip !== 'string') return false;
    const cleanIp = ip.trim();
    if (
      cleanIp === 'localhost' ||
      cleanIp === '::1' ||
      cleanIp.startsWith('127.') ||
      cleanIp.startsWith('10.') ||
      cleanIp.startsWith('192.168.') ||
      cleanIp.startsWith('::ffff:127.')
    ) {
      return false;
    }
    // Check 172.16.0.0 - 172.31.255.255 private Docker ranges
    if (cleanIp.startsWith('172.')) {
      const parts = cleanIp.split('.');
      const secondOctet = parseInt(parts[1], 10);
      if (secondOctet >= 16 && secondOctet <= 31) return false;
    }
    return true;
  };

  if (remoteip && isPublicIp(remoteip)) {
    bodyParams.remoteip = remoteip.trim();
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

    const errorCodes = (data && data['error-codes']) || [];
    console.warn(`[SECURITY] Turnstile verification failed. Error codes: ${JSON.stringify(errorCodes)}`);

    // Allow local/non-production testing fallback if siteverify fails due to localhost domain mismatch
    if (isDev) {
      console.warn('[DEV] Bypassing Turnstile verification failure for non-production environment.');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Turnstile verification network error:', error);
    if (isDev) {
      console.warn('[DEV] Turnstile network error. Bypassing bot check for dev environment.');
      return true;
    }
    return false;
  }
};

export { verifyTurnstileToken };
