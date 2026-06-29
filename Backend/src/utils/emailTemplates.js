/**
 * CodeX Branded Email Templates
 *
 * Design system (matching the website):
 *   - Background: #f5f0e8  (warm off-white)
 *   - Ink:        #0d0d0d  (near-black)
 *   - Accent:     #2ec5d4  (cyan)
 *   - Panel:      #111111  (dark)
 *   - Fonts:      Monospace fallback (email-safe), Oswald for headings via Google Fonts
 *
 * All templates use table-based layout for maximum email client compatibility.
 */

const BRAND = {
  bg: '#f5f0e8',
  ink: '#0d0d0d',
  accent: '#2ec5d4',
  panel: '#111111',
  muted: '#7a7a7a',
  lineSoft: '#d5d0c8',
  white: '#f4efe6',
};

/**
 * Wraps email body content in the branded CodeX layout shell.
 * @param {Object} options
 * @param {string} options.preheader - Hidden preheader text for inbox preview
 * @param {string} options.body - The inner HTML content
 * @returns {string} Full HTML email string
 */
const emailLayout = ({ preheader = '', body }) => `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>CodeX</title>
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap" rel="stylesheet" />
  <!--[if mso]>
  <style>* { font-family: Arial, sans-serif !important; }</style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${BRAND.bg};font-family:'Courier New',Courier,monospace;color:${BRAND.ink};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <!-- Preheader (hidden preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <!-- Email container -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border:1px solid ${BRAND.lineSoft};background-color:#faf6ef;">

          <!-- Header -->
          <tr>
            <td style="padding:24px 32px;border-bottom:1px solid ${BRAND.lineSoft};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${BRAND.accent};margin-right:10px;vertical-align:middle;"></span>
                    <span style="font-family:'Oswald',Arial,sans-serif;font-size:22px;letter-spacing:0.24em;color:${BRAND.ink};vertical-align:middle;font-weight:700;">CODEX</span>
                  </td>
                  <td align="right" style="font-size:11px;letter-spacing:0.2em;color:${BRAND.muted};text-transform:uppercase;">
                    EST. 2018
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Accent bar -->
          <tr>
            <td style="height:3px;background-color:${BRAND.accent};font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Body content -->
          <tr>
            <td style="padding:40px 32px;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:${BRAND.panel};padding:28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:11px;letter-spacing:0.2em;color:${BRAND.white}55;text-transform:uppercase;">
                    &copy; ${new Date().getFullYear()} CodeX Collective
                  </td>
                  <td align="right" style="font-size:11px;letter-spacing:0.15em;color:${BRAND.accent};">
                    // all_systems_nominal
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- /Email container -->

      </td>
    </tr>
  </table>
</body>
</html>
`;

/**
 * Styled CTA button (table-based for email compatibility)
 */
const ctaButton = (href, label) => `
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 8px;">
  <tr>
    <td style="background-color:${BRAND.ink};padding:14px 28px;">
      <a href="${href}" target="_blank" style="font-family:'Oswald',Arial,sans-serif;font-size:14px;letter-spacing:0.18em;color:#ffffff;text-decoration:none;text-transform:uppercase;display:inline-block;">${label}</a>
    </td>
  </tr>
</table>
`;

/**
 * Kicker / eyebrow text
 */
const kicker = (text) =>
  `<p style="margin:0 0 6px;font-size:11px;letter-spacing:0.34em;text-transform:uppercase;color:${BRAND.accent};">${text}</p>`;

/**
 * Section title (big heading)
 */
const heading = (text) =>
  `<h1 style="margin:0 0 20px;font-family:'Oswald',Arial,sans-serif;font-size:36px;line-height:0.95;letter-spacing:0.02em;color:${BRAND.ink};text-transform:uppercase;">${text}</h1>`;

/**
 * Body paragraph
 */
const paragraph = (text) =>
  `<p style="margin:0 0 16px;font-size:14px;line-height:1.75;color:${BRAND.ink}cc;">${text}</p>`;

/**
 * Key-value info row (monospace terminal style)
 */
const infoRow = (label, value) =>
  `<tr>
    <td style="padding:8px 0;border-bottom:1px solid ${BRAND.lineSoft};font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:${BRAND.muted};width:40%;">${label}</td>
    <td style="padding:8px 0;border-bottom:1px solid ${BRAND.lineSoft};font-size:14px;color:${BRAND.ink};font-weight:700;">${value}</td>
  </tr>`;

/**
 * Wraps info rows in a table
 */
const infoTable = (rows) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">${rows}</table>`;

/**
 * Dark panel block (for status badges, highlights)
 */
const darkBadge = (text) =>
  `<span style="display:inline-block;margin-top:12px;padding:8px 16px;background-color:${BRAND.panel};color:${BRAND.accent};font-size:11px;letter-spacing:0.3em;text-transform:uppercase;border:1px solid ${BRAND.accent}44;">${text}</span>`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Pre-built Email Templates
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Admin OTP Email
 */
const adminOtpEmail = (otp) =>
  emailLayout({
    preheader: `Your CodeX admin login OTP is ${otp}`,
    body: `
      ${kicker('// auth_verification')}
      ${heading('Login OTP')}
      ${paragraph('Your one-time password for admin access is:')}

      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0 28px;">
        <tr>
          <td style="padding:16px 32px;background-color:${BRAND.panel};font-family:'Oswald',Arial,sans-serif;font-size:36px;letter-spacing:0.3em;color:${BRAND.accent};text-align:center;">
            ${otp}
          </td>
        </tr>
      </table>

      ${paragraph('This OTP is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email.')}
      ${darkBadge('expires: 10 min')}
    `,
  });

/**
 * Password Change OTP Email
 */
const passwordChangeOtpEmail = (otp) =>
  emailLayout({
    preheader: `Your CodeX password change OTP is ${otp}`,
    body: `
      ${kicker('// security_verification')}
      ${heading('Password Change OTP')}
      ${paragraph('You requested to change your admin password. Your one-time password is:')}

      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0 28px;">
        <tr>
          <td style="padding:16px 32px;background-color:${BRAND.panel};font-family:'Oswald',Arial,sans-serif;font-size:36px;letter-spacing:0.3em;color:${BRAND.accent};text-align:center;">
            ${otp}
          </td>
        </tr>
      </table>

      ${paragraph('This OTP is valid for <strong>10 minutes</strong>. If you did not request to change your password, please secure your account immediately.')}
      ${darkBadge('expires: 10 min')}
    `,
  });

/**
 * Password Changed Success Email
 */
const passwordChangedSuccessEmail = () =>
  emailLayout({
    preheader: `Your CodeX password was successfully changed`,
    body: `
      ${kicker('// security_update')}
      ${heading('Password Changed')}
      ${paragraph('Your CodeX admin account password has been successfully updated.')}
      ${paragraph('If you did not make this change, please contact another administrator or the support team immediately to recover your account.')}
      ${darkBadge('status: updated')}
    `,
  });

/**
 * Registration Approved Email
 */
const registrationApprovedEmail = (studentName) =>
  emailLayout({
    preheader: `Welcome to CodeX, ${studentName}! Your registration has been approved.`,
    body: `
      ${kicker('// access_granted')}
      ${heading('Welcome to CodeX.')}
      ${paragraph(`Dear <strong>${studentName}</strong>,`)}
      ${paragraph('Your registration for CodeX has been <strong style="color:' + BRAND.accent + ';">approved</strong>. You are now officially part of the collective.')}
      ${paragraph('Keep an eye out for upcoming events, workshops, and announcements. We are excited to have you onboard.')}
      ${darkBadge('status: approved')}
    `,
  });

/**
 * Registration Rejected Email
 */
const registrationRejectedEmail = (studentName) =>
  emailLayout({
    preheader: `CodeX registration update for ${studentName}`,
    body: `
      ${kicker('// registration_update')}
      ${heading('Registration Update.')}
      ${paragraph(`Dear <strong>${studentName}</strong>,`)}
      ${paragraph('We regret to inform you that your registration for CodeX could not be approved at this time.')}
      ${paragraph('If you believe this is a mistake, please contact our support team or resubmit your registration with the correct details.')}
      ${darkBadge('status: rejected')}
    `,
  });

/**
 * Certificate Email
 */
const certificateEmail = ({ studentName, eventName, certificateId, verificationLink, position = 'Participant' }) =>
  emailLayout({
    preheader: `Your ${position} certificate for ${eventName} is ready — Verify ID: ${certificateId}`,
    body: `
      ${kicker('// certificate_issued')}
      ${heading('Certificate Ready.')}
      ${paragraph(`Dear <strong>${studentName}</strong>,`)}
      ${paragraph(`Congratulations on your role as <strong>${position}</strong> in <strong>${eventName}</strong>. Your certificate has been generated and is ready for verification.`)}

      ${infoTable(
        infoRow('event', eventName) +
        infoRow('position', position) +
        infoRow('certificate_id', certificateId)
      )}

      ${ctaButton(verificationLink, 'View Certificate')}

      ${paragraph('You can also verify your certificate directly on our website using the certificate ID above.')}
    `,
  });

/**
 * Contact Form Received Email
 */
const contactFormReceivedEmail = (userName) =>
  emailLayout({
    preheader: `Thank you for contacting CodeX, ${userName}`,
    body: `
      ${kicker('// message_received')}
      ${heading('We got your message.')}
      ${paragraph(`Hi <strong>${userName}</strong>,`)}
      ${paragraph('Thank you for reaching out to us. We have successfully received your message and our team will get back to you as soon as possible.')}
      ${paragraph('In the meantime, feel free to explore our website and upcoming events.')}
      ${darkBadge('status: received')}
    `,
  });

export {
  emailLayout,
  ctaButton,
  kicker,
  heading,
  paragraph,
  infoRow,
  infoTable,
  darkBadge,
  adminOtpEmail,
  passwordChangeOtpEmail,
  passwordChangedSuccessEmail,
  registrationApprovedEmail,
  registrationRejectedEmail,
  certificateEmail,
  contactFormReceivedEmail,
};
