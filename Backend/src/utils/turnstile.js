/**
 * Canonical Cloudflare Turnstile server-side siteverify call
 * @param {string} token - The cf-turnstile-response token from the client request
 * @param {string} [remoteip] - Optional client IP address
 * @returns {Promise<boolean>} True if verification succeeds, false otherwise
 */
const verifyTurnstileToken = async (token, remoteip) => {
  const secret = process.env.TURNSTILE_SECRET || process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn('TURNSTILE_SECRET is not defined in env. Skipping bot check for dev.');
    return true; 
  }

  if (!token) {
    return false;
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
      return false;
    }
    
    const data = await response.json();
    return Boolean(data && data.success);
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
};

export { verifyTurnstileToken };
