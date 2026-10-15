/**
 * Helper to retrieve Super Admin credentials directly from existing environment variables:
 * ADMIN_EMAIL (or ADMIN_USERNAME) and ADMIN_PASSWORD.
 */
export const getSuperAdminCredentials = () => {
  const email = (
    process.env.ADMIN_EMAIL ||
    process.env.ADMIN_USERNAME ||
    'admin@codex.com'
  )
    .toString()
    .toLowerCase()
    .trim();

  const password = (process.env.ADMIN_PASSWORD || 'admin123').toString();
  const name = 'Super Admin';

  return { email, password, name };
};
