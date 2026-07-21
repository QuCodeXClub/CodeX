/**
 * CodeX Branded Email Templates
 *
 * Design system (matching the updated website/branding):
 *   - Background: #ffffff  (white)
 *   - Ink:        #1a1a1a  (dark gray/black)
 *   - Accent:     #2EC5D4  (light blue)
 *   - AccentPale: #f2f9fb
 *   - Fonts:      Helvetica Neue, Helvetica, Arial, sans-serif
 */

const BRAND = {
  bg: '#f9f9f9',
  card: '#ffffff',
  ink: '#1a1a1a',
  text: '#555555',
  accent: '#2EC5D4',
  accentPale: '#f4fafe',
  lineSoft: '#e0e0e0',
  muted: '#999999',
};

const emailLayout = ({ preheader = '', body }) => `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>CodeX</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.bg};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:${BRAND.ink};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:${BRAND.card};border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.05);overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:22px;font-weight:900;letter-spacing:0.15em;color:${BRAND.ink};">CODE<span style="color:${BRAND.accent};">X</span></span>
                  </td>
                  <td align="right" style="font-size:10px;letter-spacing:0.15em;color:${BRAND.muted};text-transform:uppercase;font-weight:600;">
                    BUILD &middot; LEARN &middot; CONNECT
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Accent Line -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:2px;background-color:${BRAND.accent};width:100%;"></div>
            </td>
          </tr>

          <!-- Body content -->
          <tr>
            <td style="padding:40px 40px;">
              ${body}
            </td>
          </tr>

          <!-- Footer Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background-color:${BRAND.lineSoft};width:100%;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:11px;color:${BRAND.muted};">
                    &copy; ${new Date().getFullYear()} CodeX Club
                  </td>
                  <td align="right" style="font-size:11px;color:${BRAND.muted};">
                    Building Developers. Building Innovation.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const ctaButton = (href, label) => `
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
  <tr>
    <td style="background-color:${BRAND.accent};border-radius:4px;">
      <a href="${href}" target="_blank" style="font-size:14px;font-weight:bold;letter-spacing:0.05em;color:#ffffff;text-decoration:none;display:inline-block;padding:14px 28px;">${label}</a>
    </td>
  </tr>
</table>
`;

const kicker = (text) =>
  `<p style="margin:0 0 8px;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.muted};font-weight:600;">${text}</p>`;

const heading = (line1, line2) =>
  `<h1 style="margin:0 0 24px;font-size:42px;font-weight:900;line-height:1.1;letter-spacing:0.02em;color:${BRAND.ink};text-transform:uppercase;">
    ${line1}<br/>
    ${line2 ? `<span style="color:${BRAND.accent};">${line2}.</span>` : ''}
  </h1>`;

const paragraph = (text) =>
  `<p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:${BRAND.text};">${text}</p>`;

const infoRow = (label, value) =>
  `<tr>
    <td style="padding:12px 0;border-bottom:1px solid ${BRAND.lineSoft};font-size:12px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.muted};width:40%;">${label}</td>
    <td style="padding:12px 0;border-bottom:1px solid ${BRAND.lineSoft};font-size:14px;color:${BRAND.ink};font-weight:bold;">${value}</td>
  </tr>`;

const infoTable = (rows) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">${rows}</table>`;

const darkBadge = (text) =>
  `<span style="display:inline-block;margin-top:16px;padding:8px 16px;background-color:${BRAND.accentPale};color:${BRAND.accent};font-size:12px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;border-radius:4px;">${text}</span>`;

const statusBox = (title, items) => `
<div style="margin:32px 0 0;padding:24px;background-color:${BRAND.accentPale};border-radius:8px;">
  <p style="margin:0 0 12px;font-size:11px;font-weight:bold;letter-spacing:0.15em;color:${BRAND.accent};text-transform:uppercase;">${title}</p>
  ${items.map(item => `<p style="margin:0 0 8px;font-size:13px;color:${BRAND.ink};">&#10003; ${item}</p>`).join('')}
</div>
`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Pre-built Email Templates
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Admin OTP Email
 */
const adminOtpEmail = (otp) => ({
  html: emailLayout({
    preheader: `Your CodeX admin login OTP is ${otp}`,
    body: `
      ${heading('VERIFY', 'EMAIL')}
      ${paragraph('Use the verification code below to continue signing in to your CodeX account.')}

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
        <tr>
          <td align="center">
            <div style="display:inline-block;padding:20px 40px;border:2px solid #b5e0ea;border-radius:8px;font-size:36px;font-weight:900;letter-spacing:0.4em;color:${BRAND.ink};text-align:center;">
              ${otp.toString().split('').join(' ')}
            </div>
          </td>
        </tr>
      </table>

      ${statusBox('Auth Status', [
      'Verification code generated successfully',
      'Valid for 10 minutes',
      'Never share this code with anyone'
    ])}
      
      <p style="margin:32px 0 0;font-size:12px;color:${BRAND.muted};line-height:1.5;text-align:center;">If you didn't request this verification, you can safely ignore this email.</p>
    `,
  }),
  text: `Your CodeX admin login OTP is ${otp}\n\nVERIFY EMAIL.\n\nUse the verification code below to continue signing in to your CodeX account.\n\n${otp}\n\nAuth Status:\n- Verification code generated successfully\n- Valid for 10 minutes\n- Never share this code with anyone\n`,
});

/**
 * Password Change OTP Email
 */
const passwordChangeOtpEmail = (otp) => ({
  html: emailLayout({
    preheader: `Your CodeX password change OTP is ${otp}`,
    body: `
      ${heading('PASSWORD', 'RESET')}
      ${paragraph('You requested to change your admin password. Use the verification code below to proceed.')}

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
        <tr>
          <td align="center">
            <div style="display:inline-block;padding:20px 40px;border:2px solid #b5e0ea;border-radius:8px;font-size:36px;font-weight:900;letter-spacing:0.4em;color:${BRAND.ink};text-align:center;">
              ${otp.toString().split('').join(' ')}
            </div>
          </td>
        </tr>
      </table>

      ${statusBox('Security Status', [
      'Password reset initiated',
      'Valid for 10 minutes',
      'If you didn\'t request this, secure your account'
    ])}
      
      <p style="margin:32px 0 0;font-size:12px;color:${BRAND.muted};line-height:1.5;text-align:center;">If you didn't request this verification, you can safely ignore this email.</p>
    `,
  }),
  text: `Your CodeX password change OTP is ${otp}\n\nPASSWORD RESET.\n\nYou requested to change your admin password. Your one-time password is:\n${otp}\n\nThis OTP is valid for 10 minutes. If you did not request to change your password, please secure your account immediately.\n`,
});

/**
 * Password Changed Success Email
 */
const passwordChangedSuccessEmail = () => ({
  html: emailLayout({
    preheader: `Your CodeX password was successfully changed`,
    body: `
      ${heading('PASSWORD', 'CHANGED')}
      ${paragraph('Your CodeX admin account password has been successfully updated.')}
      
      ${statusBox('Account Update', [
      'Password successfully updated',
      'Account secured'
    ])}
      
      <p style="margin:32px 0 0;font-size:12px;color:${BRAND.muted};line-height:1.5;text-align:center;">If you did not make this change, please contact the developer team immediately to recover your account.</p>
    `,
  }),
  text: `Your CodeX password was successfully changed\n\nPASSWORD CHANGED.\n\nYour CodeX admin account password has been successfully updated.\n\nIf you did not make this change, please contact the developer team immediately to recover your account.\n`,
});

/**
 * Registration Approved Email
 */
const registrationApprovedEmail = (studentName) => ({
  html: emailLayout({
    preheader: `Welcome to CodeX, ${studentName}! Your registration has been approved.`,
    body: `
      ${heading('WELCOME TO', 'CODEX')}
      ${paragraph(`Dear <strong>${studentName}</strong>,`)}
      ${paragraph('Your registration for CodeX has been <strong style="color:' + BRAND.accent + ';">approved</strong>. You are now officially part of the collective.')}
      ${paragraph('Keep an eye out for upcoming events, workshops, and announcements. We are excited to have you onboard.')}
      
      ${statusBox('Registration Status', [
      'Application reviewed',
      'Account approved',
      'Ready for onboarding'
    ])}
    `,
  }),
  text: `Welcome to CodeX, ${studentName}! Your registration has been approved.\n\nWELCOME TO CODEX.\n\nDear ${studentName},\n\nYour registration for CodeX has been approved. You are now officially part of the collective.\n\nKeep an eye out for upcoming events, workshops, and announcements. We are excited to have you onboard.\n`,
});

/**
 * Registration Rejected Email
 */
const registrationRejectedEmail = (studentName) => ({
  html: emailLayout({
    preheader: `CodeX registration update for ${studentName}`,
    body: `
      ${heading('REGISTRATION', 'UPDATE')}
      ${paragraph(`Dear <strong>${studentName}</strong>,`)}
      ${paragraph('We regret to inform you that your registration for CodeX could not be approved at this time.')}
      ${paragraph('If you believe this is a mistake, please contact our support team or resubmit your registration with the correct details.')}
      ${darkBadge('Status: Rejected')}
    `,
  }),
  text: `CodeX registration update for ${studentName}\n\nREGISTRATION UPDATE.\n\nDear ${studentName},\n\nWe regret to inform you that your registration for CodeX could not be approved at this time.\n\nIf you believe this is a mistake, please contact our support team or resubmit your registration with the correct details.\n`,
});

/**
 * Certificate Email
 */
const certificateEmail = ({ studentName, eventName, certificateId, verificationLink, position = 'Participant' }) => ({
  html: emailLayout({
    preheader: `Your ${position} certificate for ${eventName} is ready — Verify ID: ${certificateId}`,
    body: `
      ${heading('CERTIFICATE', 'READY')}
      ${paragraph(`Dear <strong>${studentName}</strong>,`)}
      ${paragraph(`Congratulations on your role as <strong>${position}</strong> in <strong>${eventName}</strong>. Your certificate has been generated and is ready for verification.`)}

      ${infoTable(
      infoRow('Event', eventName) +
      infoRow('Position', position) +
      infoRow('Certificate ID', certificateId)
    )}

      ${ctaButton(verificationLink, 'View Certificate')}

      ${paragraph('You can also verify your certificate directly on our website using the certificate ID above.')}
    `,
  }),
  text: `Your ${position} certificate for ${eventName} is ready — Verify ID: ${certificateId}\n\nCERTIFICATE READY.\n\nDear ${studentName},\n\nCongratulations on your role as ${position} in ${eventName}. Your certificate has been generated and is ready for verification.\n\nEvent: ${eventName}\nPosition: ${position}\nCertificate ID: ${certificateId}\n\nView Certificate at: ${verificationLink}\n\nYou can also verify your certificate directly on our website using the certificate ID above.\n`,
});

/**
 * Boarding Pass Email
 */
const boardingPassEmail = ({ studentName, eventName, eventDescription, qid, boardingPassId, citeNumber, verificationLink }) => {

  return {
    html: emailLayout({
      preheader: `Your boarding pass for ${eventName} is ready`,
      body: `
        ${heading('BOARDING PASS', 'READY')}
        ${paragraph(`Dear <strong>${studentName}</strong>,`)}
        ${paragraph(`Your boarding pass for <strong>${eventName}</strong> has been generated.`)}
        ${paragraph(`${eventDescription}`)}

        ${infoTable(
        infoRow('Event', eventName) +
        infoRow('QID', qid) +
        (citeNumber ? infoRow('Desk', citeNumber) : '') +
        infoRow('Pass ID', boardingPassId)
      )}

        ${ctaButton(verificationLink, 'View Boarding Pass')}

        ${paragraph('Please present this boarding pass or the pass ID above at the event.')}
      `,
    }),
    text: `Your boarding pass for ${eventName} is ready\n\nBOARDING PASS READY.\n\nDear ${studentName},\n\nYour boarding pass for ${eventName} has been generated.\n\n${eventDescription}\n\nEvent: ${eventName}\nQID: ${qid}\n${citeNumber ? `Desk Number: ${citeNumber}\n` : ''}Pass ID: ${boardingPassId}\n\nView Boarding Pass at: ${verificationLink}\n\nPlease present this boarding pass or the pass ID above at the event.\n`,
  };
};

/**
 * Contact Form Received Email
 */
const contactFormReceivedEmail = (userName) => ({
  html: emailLayout({
    preheader: `Thank you for contacting CodeX, ${userName}`,
    body: `
      ${heading('MESSAGE', 'RECEIVED')}
      ${paragraph(`Hi <strong>${userName}</strong>,`)}
      ${paragraph('Thank you for reaching out to us. We have successfully received your message and our team will get back to you as soon as possible.')}
      ${paragraph('In the meantime, feel free to explore our website and upcoming events.')}
      
      ${statusBox('Request Status', [
      'Message safely received',
      'Assigned to support team',
      'Awaiting review'
    ])}
    `,
  }),
  text: `Thank you for contacting CodeX, ${userName}\n\nMESSAGE RECEIVED.\n\nHi ${userName},\n\nThank you for reaching out to us. We have successfully received your message and our team will get back to you as soon as possible.\n\nIn the meantime, feel free to explore our website and upcoming events.\n`,
});

/**
 * Contact Reply Email
 */
const contactReplyEmail = (userName, originalSubject, replyMessage) => ({
  html: emailLayout({
    preheader: `Reply to your message: ${originalSubject}`,
    body: `
      ${heading('MESSAGE', 'REPLY')}
      ${paragraph(`Hi <strong>${userName}</strong>,`)}
      ${paragraph('Thank you for reaching out to us. We have reviewed your message regarding "<strong>' + originalSubject + '</strong>" and here is our reply:')}
      
      <div style="margin:24px 0;padding:24px;background-color:${BRAND.accentPale};border-radius:8px;border-left:4px solid ${BRAND.accent};color:${BRAND.ink};font-size:14px;line-height:1.6;white-space:pre-wrap;">
        ${replyMessage}
      </div>
      
      ${paragraph('If you have any further questions, feel free to reply directly to this email.')}
    `,
  }),
  text: `Reply to your message: ${originalSubject}\n\nMESSAGE REPLY.\n\nHi ${userName},\n\nThank you for reaching out to us. We have reviewed your message regarding "${originalSubject}" and here is our reply:\n\n${replyMessage}\n\nIf you have any further questions, feel free to reply directly to this email.\n`,
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
  boardingPassEmail,
  contactFormReceivedEmail,
  contactReplyEmail,
};
