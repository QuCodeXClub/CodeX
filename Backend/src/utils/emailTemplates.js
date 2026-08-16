/**
 * CodeX Branded Email Templates
 *
 * Design system (matching the updated website/branding):
 *   - Background: #f9f9f9
 *   - Card:       #ffffff
 *   - Ink:        #1a1a1a  (dark gray/black)
 *   - Text:       #4a4a4a  (readable body text)
 *   - Accent:     #2EC5D4  (light blue)
 *   - AccentPale: #f4fafe
 *   - LineSoft:   #e5e7eb
 *   - Muted:      #888888
 *   - Fonts:      Helvetica Neue, Helvetica, Arial, sans-serif
 */

const BRAND = {
  bg: '#f9f9f9',
  card: '#ffffff',
  ink: '#1a1a1a',
  text: '#4a4a4a',
  accent: '#2EC5D4',
  accentPale: '#f4fafe',
  lineSoft: '#e5e7eb',
  muted: '#888888',
};

const emailLayout = ({ preheader = '', body }) => `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no" />
  <title>CodeX</title>
  <style>
    /* Reset & Base styles */
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      height: 100% !important;
      width: 100% !important;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      -webkit-font-smoothing: antialiased;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
      max-width: 100% !important;
    }
    table {
      border-collapse: collapse !important;
    }
    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }

    /* Gmail App & Web Responsive Overrides */
    u + .body .outer-td {
      padding: 16px 10px !important;
    }
    u + .body .email-card {
      width: 100% !important;
      max-width: 100% !important;
    }
    u + .body .header-td {
      padding: 20px 20px 14px 20px !important;
    }
    u + .body .accent-td {
      padding: 0 20px !important;
    }
    u + .body .body-td {
      padding: 24px 20px !important;
    }
    u + .body .footer-divider-td {
      padding: 0 20px !important;
    }
    u + .body .footer-td {
      padding: 18px 20px !important;
    }

    /* Mobile Responsive Styles (<= 600px) */
    @media screen and (max-width: 600px) {
      .outer-td {
        padding: 16px 10px !important;
      }
      .email-card {
        width: 100% !important;
        max-width: 100% !important;
        border-radius: 8px !important;
      }
      .header-td {
        padding: 20px 20px 14px 20px !important;
      }
      .header-col-left {
        font-size: 22px !important;
      }
      .header-col-left a {
        font-size: 22px !important;
      }
      .header-col-right {
        font-size: 9.5px !important;
        letter-spacing: 0.12em !important;
      }
      .accent-td {
        padding: 0 20px !important;
      }
      .body-td {
        padding: 24px 20px !important;
      }
      .body-td p, .email-paragraph {
        font-size: 14px !important;
        line-height: 1.55 !important;
        margin-bottom: 14px !important;
      }
      .email-kicker {
        font-size: 11px !important;
        margin-bottom: 6px !important;
      }
      .footer-divider-td {
        padding: 0 20px !important;
      }
      .footer-td {
        padding: 18px 20px !important;
      }
      .footer-col-left {
        display: block !important;
        width: 100% !important;
        text-align: center !important;
        margin-bottom: 6px !important;
        font-size: 11px !important;
      }
      .footer-col-right {
        display: block !important;
        width: 100% !important;
        text-align: center !important;
        font-size: 11px !important;
      }
      .email-heading {
        font-size: 18px !important;
        line-height: 1.3 !important;
        letter-spacing: -0.01em !important;
        margin-bottom: 12px !important;
        word-break: break-word !important;
      }
      .otp-td {
        padding: 0 !important;
      }
      .otp-box {
        font-size: 22px !important;
        letter-spacing: 0.18em !important;
        padding: 12px 20px !important;
        white-space: nowrap !important;
        word-break: normal !important;
        display: inline-block !important;
        width: auto !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
      }
      .info-table {
        margin: 16px 0 !important;
      }
      .info-row {
        display: block !important;
        width: 100% !important;
        margin-bottom: 8px !important;
      }
      .info-label {
        display: block !important;
        width: 100% !important;
        padding: 0 0 2px 0 !important;
        border-bottom: none !important;
        font-size: 11px !important;
        box-sizing: border-box !important;
      }
      .info-value {
        display: block !important;
        width: 100% !important;
        padding: 0 0 8px 0 !important;
        font-size: 14px !important;
        border-bottom: 1px solid ${BRAND.lineSoft} !important;
        word-break: break-word !important;
        overflow-wrap: break-word !important;
        box-sizing: border-box !important;
      }
      .info-row:last-child .info-value {
        border-bottom: none !important;
        padding-bottom: 0 !important;
      }
      .cta-table {
        width: 100% !important;
        margin: 18px 0 !important;
      }
      .cta-cell {
        width: 100% !important;
        text-align: center !important;
      }
      .cta-btn {
        display: block !important;
        width: 100% !important;
        padding: 13px 16px !important;
        font-size: 14px !important;
        box-sizing: border-box !important;
        text-align: center !important;
      }
      .status-box {
        padding: 14px 16px !important;
        margin-top: 18px !important;
      }
      .status-title {
        font-size: 11px !important;
        margin-bottom: 6px !important;
      }
      .status-item {
        font-size: 12.5px !important;
        margin-bottom: 4px !important;
      }
      .status-item:last-child {
        margin-bottom: 0 !important;
      }
      .reply-box {
        padding: 16px 18px !important;
        margin: 16px 0 !important;
        font-size: 13.5px !important;
        word-break: break-word !important;
      }
      .dark-badge {
        font-size: 11px !important;
        padding: 6px 12px !important;
        margin-top: 12px !important;
      }
    }
  </style>
</head>
<body class="body" style="margin:0;padding:0;background-color:${BRAND.bg};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:${BRAND.ink};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};width:100%;margin:0;padding:0;table-layout:fixed;">
    <tr>
      <td align="center" class="outer-td" style="padding:32px 20px;">
        <!--[if mso]>
        <table role="presentation" align="center" width="600" style="width:600px;">
        <tr>
        <td>
        <![endif]-->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="email-card" style="max-width:600px;width:100%;background-color:${BRAND.card};border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,0.06);overflow:hidden;margin:0 auto;">
          
          <!-- Header (Brand Banner) -->
          <tr>
            <td class="header-td" style="padding:28px 32px 20px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;margin:0;padding:0;border-collapse:collapse;border-spacing:0;">
                <tr>
                  <td class="header-col-left" valign="middle" style="padding:0;margin:0;">
                    <a href="${process.env.FRONTEND_URL || 'https://qucodex.club'}" target="_blank" style="font-size:24px;font-weight:900;color:${BRAND.ink};text-decoration:none;letter-spacing:-0.5px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;display:inline-block;margin:0;padding:0;line-height:1;">Code<span style="color:${BRAND.accent};">X</span></a>
                  </td>
                  <td class="header-col-right" align="right" valign="middle" style="padding:0;margin:0;font-size:11px;letter-spacing:0.14em;color:${BRAND.muted};text-transform:uppercase;font-weight:700;line-height:1;">BUILD &middot; LEARN &middot; CONNECT</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Accent Line -->
          <tr>
            <td class="accent-td" style="padding:0 32px;">
              <div style="height:2px;background-color:${BRAND.accent};width:100%;"></div>
            </td>
          </tr>

          <!-- Body content -->
          <tr>
            <td class="body-td" style="padding:28px 32px;">
              ${body}
            </td>
          </tr>

          <!-- Footer Divider -->
          <tr>
            <td class="footer-divider-td" style="padding:0 32px;">
              <div style="height:1px;background-color:${BRAND.lineSoft};width:100%;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer-td" style="padding:20px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;margin:0;padding:0;border-collapse:collapse;border-spacing:0;">
                <tr>
                  <td class="footer-col-left" style="padding:0;margin:0;font-size:11.5px;color:${BRAND.muted};">
                    &copy; ${new Date().getFullYear()} CodeX Club
                  </td>
                  <td class="footer-col-right" align="right" style="padding:0;margin:0;font-size:11.5px;color:${BRAND.muted};">
                    Building Developers. Building Innovation.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!--[if mso]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>
`;

const ctaButton = (href, label) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0;width:100%;max-width:100%;border-collapse:collapse;border-spacing:0;" class="cta-table">
  <tr>
    <td align="center" style="background-color:${BRAND.accent};border-radius:6px;padding:0;" class="cta-cell">
      <a href="${href}" target="_blank" style="font-size:14px;font-weight:700;letter-spacing:0.04em;color:#ffffff;text-decoration:none;display:inline-block;padding:13px 28px;max-width:100%;box-sizing:border-box;word-break:break-word;line-height:1.2;" class="cta-btn">${label}</a>
    </td>
  </tr>
</table>
`;

const kicker = (text) =>
  `<p class="email-kicker" style="margin:0 0 6px;padding:0;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.accent};font-weight:700;word-break:break-word;overflow-wrap:break-word;line-height:1.3;">${text}</p>`;

const heading = (line1, line2) =>
  `<h1 class="email-heading" style="margin:0 0 12px;padding:0;font-size:19px;font-weight:800;line-height:1.3;letter-spacing:-0.01em;color:${BRAND.ink};text-transform:uppercase;word-break:break-word;overflow-wrap:break-word;">${line1}${line2 ? ` <span style="color:${BRAND.accent};">${line2}.</span>` : ''}</h1>`;

const paragraph = (text) =>
  `<p class="email-paragraph" style="margin:0 0 16px;padding:0;font-size:14px;line-height:1.6;color:${BRAND.text};word-break:break-word;overflow-wrap:break-word;">${text}</p>`;

const infoRow = (label, value, isLast = false) =>
  `<tr class="info-row">
    <td style="padding:10px 0;${isLast ? '' : `border-bottom:1px solid ${BRAND.lineSoft};`}font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND.muted};width:36%;vertical-align:top;" class="info-label">${label}</td>
    <td style="padding:10px 0;${isLast ? '' : `border-bottom:1px solid ${BRAND.lineSoft};`}font-size:14px;color:${BRAND.ink};font-weight:600;width:64%;vertical-align:top;word-break:break-word;overflow-wrap:break-word;" class="info-value">${value}</td>
  </tr>`;

const infoTable = (rows) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;width:100%;max-width:100%;border-collapse:collapse;border-spacing:0;" class="info-table">${rows}</table>`;

const darkBadge = (text) =>
  `<span class="dark-badge" style="display:inline-block;margin-top:14px;padding:6px 14px;background-color:${BRAND.accentPale};color:${BRAND.accent};font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;border-radius:4px;max-width:100%;box-sizing:border-box;word-break:break-word;">${text}</span>`;

const statusBox = (title, items) => `
<div class="status-box" style="margin:20px 0 0;padding:16px 20px;background-color:${BRAND.accentPale};border-radius:8px;box-sizing:border-box;">
  <p class="status-title" style="margin:0 0 8px;font-size:12px;font-weight:800;letter-spacing:0.1em;color:${BRAND.accent};text-transform:uppercase;word-break:break-word;line-height:1.2;">${title}</p>
  ${items.map((item, idx) => `<p class="status-item" style="margin:0 0 ${idx === items.length - 1 ? '0' : '6px'};font-size:13.5px;color:${BRAND.ink};font-weight:500;word-break:break-word;line-height:1.4;">&#10003; ${item}</p>`).join('')}
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

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
        <tr>
          <td align="center" class="otp-td">
            <div class="otp-box" style="display:inline-block;padding:14px 28px;background-color:${BRAND.accentPale};border:2px solid ${BRAND.accent};border-radius:8px;font-size:26px;font-weight:900;letter-spacing:0.2em;color:${BRAND.ink};text-align:center;white-space:nowrap;max-width:100%;box-sizing:border-box;">${otp}</div>
          </td>
        </tr>
      </table>

      ${statusBox('Auth Status', [
      'Verification code generated successfully',
      'Valid for 10 minutes',
      'Never share this code with anyone'
    ])}
      
      <p style="margin:16px 0 0;font-size:12.5px;color:${BRAND.muted};line-height:1.5;text-align:left;word-break:break-word;">If you didn't request this verification, you can safely ignore this email.</p>
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

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
        <tr>
          <td align="center" class="otp-td">
            <div class="otp-box" style="display:inline-block;padding:14px 28px;background-color:${BRAND.accentPale};border:2px solid ${BRAND.accent};border-radius:8px;font-size:26px;font-weight:900;letter-spacing:0.2em;color:${BRAND.ink};text-align:center;white-space:nowrap;max-width:100%;box-sizing:border-box;">${otp}</div>
          </td>
        </tr>
      </table>

      ${statusBox('Security Status', [
      'Password reset initiated',
      'Valid for 10 minutes',
      'If you didn\'t request this, secure your account'
    ])}
      
      <p style="margin:16px 0 0;font-size:12.5px;color:${BRAND.muted};line-height:1.5;text-align:left;word-break:break-word;">If you didn't request this verification, you can safely ignore this email.</p>
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
      
      <p style="margin:16px 0 0;font-size:12.5px;color:${BRAND.muted};line-height:1.5;text-align:left;word-break:break-word;">If you did not make this change, please contact the developer team immediately to recover your account.</p>
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
      infoRow('Certificate ID', certificateId, true)
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
  const rows = [
    infoRow('Event', eventName),
    infoRow('QID', qid),
    ...(citeNumber ? [infoRow('Desk', citeNumber)] : []),
    infoRow('Pass ID', boardingPassId, true)
  ].join('');

  return {
    html: emailLayout({
      preheader: `Your boarding pass for ${eventName} is ready`,
      body: `
        ${heading('BOARDING PASS', 'READY')}
        ${paragraph(`Dear <strong>${studentName}</strong>,`)}
        ${paragraph(`Your boarding pass for <strong>${eventName}</strong> has been generated.`)}
        ${paragraph(`${eventDescription}`)}

        ${infoTable(rows)}

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
      
      <div class="reply-box" style="margin:20px 0;padding:20px;background-color:${BRAND.accentPale};border-radius:8px;border-left:4px solid ${BRAND.accent};color:${BRAND.ink};font-size:14px;line-height:1.6;white-space:pre-wrap;word-break:break-word;overflow-wrap:break-word;">
        ${replyMessage}
      </div>
      
      ${paragraph('If you have any further questions, feel free to reply directly to this email.')}
    `,
  }),
  text: `Reply to your message: ${originalSubject}\n\nMESSAGE REPLY.\n\nHi ${userName},\n\nThank you for reaching out to us. We have reviewed your message regarding "${originalSubject}" and here is our reply:\n\n${replyMessage}\n\nIf you have any further questions, feel free to reply directly to this email.\n`,
});

const stripHtmlTags = (html) => {
  if (!html) return '';
  let text = html;
  let prev;
  do {
    prev = text;
    text = text.replace(/<[^>]*>?/gm, '');
  } while (text !== prev);
  return text;
};

/**
 * Bulk Announcement Email
 */
const announcementEmail = (subject, messageHtml) => ({
  html: emailLayout({
    preheader: subject,
    body: `
      ${heading('CLUB', 'ANNOUNCEMENT')}
      <div style="font-size:14.5px;line-height:1.65;color:${BRAND.ink};margin-top:20px;word-break:break-word;overflow-wrap:break-word;">
        ${messageHtml}
      </div>
    `,
  }),
  text: `${subject}\n\nCLUB ANNOUNCEMENT.\n\n${stripHtmlTags(messageHtml)}\n`,
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
  announcementEmail,
};
