import React, { memo } from "react";
import { BOARDING_PASS_FONTS_CSS } from "./boardingPassFonts";
import { BP1_IMAGE_12_BASE64 } from "./boardingPassAssets";
import { ASSETS } from "../../config/assets";
import instagramQrCode from "../../assets/instagram-qr.svg";
import linkedinQrCode from "../../assets/linkedin-qr.svg";
import githubQrCode from "../../assets/github-qr.svg";

const CodexBoardingPassFrontSVG = memo(({
  boardingPass = {},
  id = "codex-boarding-pass-front-svg",
  className = "",
  style = {},
  ...props
}) => {
  const studentName = (boardingPass?.studentName || "").trim().toUpperCase();
  const teamName = (boardingPass?.teamName || "").trim().toUpperCase();
  const eventName = (boardingPass?.eventName || "").trim().toUpperCase();
  const tagLine = (boardingPass?.tagline || boardingPass?.eventTagline || "").trim().toUpperCase();
  const venue = (boardingPass?.venue || boardingPass?.eventVenue || boardingPass?.event?.venue || boardingPass?.eventId?.venue || "").trim().toUpperCase();
  const seat = (boardingPass?.deskNumber || "").trim().toUpperCase();
  const time = (boardingPass?.time || "").trim().toUpperCase();
  const userId = (boardingPass?.loginUser || "").trim().toUpperCase();
  const userPassword = (boardingPass?.loginPass || "").trim().toUpperCase();
  const boardingPassId = (boardingPass?.boardingPassId || "").trim();
  const qid = (boardingPass?.qid || "").trim().toUpperCase();

  const ensureSecureUrl = (url) => {
    if (!url || typeof url !== "string") return null;
    return url.replace(/^http:\/\//i, "https://");
  };

  const qrCodeImage = ensureSecureUrl(boardingPass?.qrCodeImage);

  // Format date
  const eventDate = boardingPass?.eventDate || boardingPass?.issuedAt || boardingPass?.date || "";
  const formattedDate = (() => {
    if (!eventDate) return "";
    try {
      const d = new Date(eventDate);
      if (isNaN(d.getTime())) return String(eventDate).toUpperCase();
      const day = String(d.getDate()).padStart(2, "0");
      const month = d.toLocaleDateString("en-US", { month: "long" }).toUpperCase();
      return `${day} ${month}`;
    } catch {
      return String(eventDate).toUpperCase();
    }
  })();

  // Dynamic backend Event Description lines (auto-wrapped)
  const descLines = (() => {
    const rawDesc = (boardingPass?.eventDescription || boardingPass?.description || "").trim().toUpperCase();
    if (!rawDesc) return [];
    const words = rawDesc.split(/\s+/);
    const lines = [];
    let currentLine = "";
    for (const word of words) {
      if ((currentLine + " " + word).trim().length <= 46) {
        currentLine = (currentLine + " " + word).trim();
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines.slice(0, 5);
  })();

  // Responsive font scaling for studentName and teamName for perfect centering
  const studentFontSize = (() => {
    const len = studentName.length;
    if (len > 26) return 7.2;
    if (len > 20) return 8.6;
    if (len > 14) return 10.0;
    return 11.51;
  })();

  const teamFontSize = (() => {
    const len = teamName.length;
    if (len > 20) return 7.8;
    if (len > 13) return 9.5;
    return 11.51;
  })();

  // Responsive font scaling for eventName (wide header area)
  const eventNameFontSize = (() => {
    const len = eventName.length;
    if (len > 35) return 10.0;
    if (len > 28) return 12.0;
    if (len > 22) return 14.0;
    if (len > 16) return 16.5;
    return 21.33;
  })();
  const eventNameScale = eventNameFontSize / 21.33;
  const eventNameTransformScale = 0.6635216 * (eventNameFontSize / 21.33);

  // Responsive font scaling for venue (medium width area ~100px)
  const venueFontSize = (() => {
    const len = venue.length;
    if (len > 20) return 9.0;
    if (len > 15) return 10.5;
    if (len > 10) return 12.5;
    return 14.66;
  })();

  // Responsive font scaling for time value
  const timeFontSize = (() => {
    const len = time.length;
    if (len > 14) return 9.5;
    if (len > 10) return 11.0;
    if (len > 7) return 12.5;
    return 14.66;
  })();

  // Responsive font scaling for seat/desk value
  const seatFontSize = (() => {
    const len = seat.length;
    if (len > 12) return 9.5;
    if (len > 8) return 11.0;
    if (len > 5) return 12.5;
    return 14.66;
  })();

  // Responsive font scaling for user id
  const userIdFontSize = (() => {
    const len = userId.length;
    if (len > 18) return 9.0;
    if (len > 14) return 10.5;
    if (len > 10) return 12.0;
    return 14.66;
  })();

  // Responsive font scaling for user password
  const userPasswordFontSize = (() => {
    const len = userPassword.length;
    if (len > 18) return 9.0;
    if (len > 14) return 10.5;
    if (len > 10) return 12.0;
    return 14.66;
  })();

  // Responsive font scaling for boardingPassId (small stub area)
  const boardingPassIdFontSize = (() => {
    const len = boardingPassId.length;
    if (len > 20) return 5.0;
    if (len > 14) return 6.0;
    if (len > 10) return 7.0;
    return 8.0;
  })();

  // Responsive font scaling for QID
  const qidFontSize = (() => {
    const len = qid.length;
    if (len > 18) return 5.0;
    if (len > 12) return 5.8;
    if (len > 8) return 6.5;
    return 7.5;
  })();

  // Dynamic Y positions: NAME label sits at fixed y=26, student name below it,
  // TEAM label starts after student name + small gap, team name below that.
  const nameLabelY = 31.5;
  const nameTextY = nameLabelY + studentFontSize; // label height ~7.5 + font size
  const teamLabelY = nameTextY + 15;                   // gap of 5.5 after student name
  const teamTextY = teamLabelY  + teamFontSize;    // label height ~7.5 + font size

  return (
    <svg
      id={id}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      viewBox="0 0 612 198"
      className={className}
      style={style}
      {...props}
    >
      <defs>
        <style>{`
          ${BOARDING_PASS_FONTS_CSS}
          .bp-mono { font-family: 'Space Mono', monospace, ui-monospace; }
        `}</style>
        <clipPath id="bpf_clip_1">
          <path transform="matrix(.24,0,0,.24,0,0)" d="M0 0H2550V825H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_2">
          <path transform="matrix(.24,0,0,.24,0,0)" d="M0 0H2550V825H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_3">
          <path transform="matrix(.24,0,0,.24,0,0)" d="M0 0H2550V825H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_4">
          <path transform="matrix(.24,0,0,.24,186.48,0)" d="M0 0H1699V825H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_5">
          <path transform="matrix(.24,0,0,.24,186.48,0)" d="M849.52737-1H1699.5274V826H849.52737Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_6">
          <path transform="matrix(.24,0,0,.24,186.48,0)" d="M.13543701-1H850.13546V826H.13543701Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_7">
          <path transform="matrix(.24,0,0,.24,0,0)" d="M2431.142 0H2550V825H2431.142Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_8">
          <path transform="matrix(.24,0,0,.24,0,0)" d="M0 0H834.375V825H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_9">
          <path transform="matrix(.24,0,0,.24,0,0)" d="M1851.6223 662.0532H2354.7474V730.8032H1851.6223Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_10">
          <path transform="matrix(.24,0,0,.24,0,0)" d="M1881.8615 158.08402H2359.9864V636.209H1881.8615Z" clipRule="evenodd" />
        </clipPath>
        <mask id="bpf_mask_11">
          <g transform="matrix(.2295,0,0,.2295,451.64674,37.940164)">
            <image id="bpf_image_12" width="500" height="500" href={BP1_IMAGE_12_BASE64} />
          </g>
        </mask>
        <clipPath id="bpf_clip_14">
          <path transform="matrix(.24,0,0,.24,0,0)" d="M0 0H2550V825H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_15">
          <path transform="matrix(.24,0,0,.24,6,0)" d="M0 0H771V825H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_16">
          <path transform="matrix(.24,0,0,.24,6,0)" d="M50.751527 35.65827H716.63699V802.9872H50.751527Z" />
        </clipPath>
        <clipPath id="bpf_clip_17">
          <path transform="matrix(.24,0,0,.24,6,0)" d="M85.126529 35.65827H682.26199C701.24679 35.65827 716.63699 51.048486 716.63699 70.03327V768.03C716.63699 787.0148 701.24679 802.405 682.26199 802.405H85.126529C66.14174 802.405 50.751527 787.0148 50.751527 768.03V70.03327C50.751527 51.048486 66.14174 35.65827 85.126529 35.65827Z" />
        </clipPath>
        <clipPath id="bpf_clip_18">
          <path transform="matrix(.24,0,0,.24,18,8.4)" d="M0 0H667V768H0Z" />
        </clipPath>
        <clipPath id="bpf_clip_19">
          <path transform="matrix(.24,0,0,.24,6,0)" d="M50.751527 35.65827H716.3765V801.28329H50.751527Z" />
        </clipPath>
        <clipPath id="bpf_clip_20">
          <path transform="matrix(.24,0,0,.24,6,0)" d="M50.764024 35.65827H719.74606V805.1809H50.764024Z" />
        </clipPath>
        <clipPath id="bpf_clip_21">
          <path transform="matrix(.24,0,0,.24,6,0)" d="M85.136898 35.65827H682.23538C701.21896 35.65827 716.6082 51.04753 716.6082 70.03114V767.9847C716.6082 786.96829 701.21896 802.3575 682.23538 802.3575H85.136898C66.15328 802.3575 50.764024 786.96829 50.764024 767.9847V70.03114C50.764024 51.04753 66.15328 35.65827 85.136898 35.65827Z" />
        </clipPath>
        <clipPath id="bpf_clip_22">
          <path transform="matrix(.24,0,0,.24,0,0)" d="M75.751529 322.64234H741.63699V716.5365H75.751529Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_23">
          <path transform="matrix(.24,0,0,.24,18,77.28)" d="M0 0H667V395H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_24">
          <path transform="matrix(.24,0,0,.24,0,0)" d="M75.78272 322.64234H741.3765V716.39236H75.78272Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_25">
          <path transform="matrix(.24,0,0,.24,0,0)" d="M288.47355 412.78138H529.0985V653.4064H288.47355Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_26">
          <path transform="matrix(.24,0,0,.24,0,0)" d="M245.00165 350.83418H573.12667V688.33419H245.00165Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_27">
          <path transform="matrix(.24,0,0,.24,0,0)" d="M0 0H2550V825H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_28">
          <path transform="matrix(.24,0,0,.24,226.08,45.12)" d="M0 0H863V212H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_29">
          <path transform="matrix(.24,0,0,.24,375.12,116.159999)" d="M0 0H137V45H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_30">
          <path transform="matrix(.24,0,0,.24,375.12,148.08)" d="M0 0H176V46H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_31">
          <path transform="matrix(.24,0,0,.24,226.08,22.08)" d="M0 0H543V90H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_32">
          <path transform="matrix(.24,0,0,.24,298.8,113.759998)" d="M0 0H79V45H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_33">
          <path transform="matrix(.24,0,0,.24,226.08,111.6)" d="M0 0H97V45H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_34">
          <path transform="matrix(.24,0,0,.24,298.8,148.08)" d="M0 0H251V46H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_35">
          <path transform="matrix(.24,0,0,.24,226.08,145.92)" d="M0 0H79V46H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_36">
          <path transform="matrix(.24,0,0,.24,86.88,24.24)" d="M0 0H77V44H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_37">
          <path transform="matrix(.24,0,0,.24,52.8,30)" d="M0 0H355V72H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_38">
          <path transform="matrix(.24,0,0,.24,69.119998,56.879999)" d="M0 0H238V72H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_39">
          <path transform="matrix(.24,0,0,.24,86.88,49.2)" d="M0 0H77V43H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_40">
          <path transform="matrix(.24,0,0,.24,54.96,174)" d="M0 0H368V69H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpf_clip_41">
          <path transform="matrix(.24,0,0,.24,455.52,19.199999)" d="M0 0H422V45H0Z" clipRule="evenodd" />
        </clipPath>
      </defs>
      <g>
        <g clipPath="url(#bpf_clip_1)">
          <path transform="matrix(.75,0,0,.75,0,0)" d="M0 0H816V264H0Z" fill="#ffffff" />
        </g>
        <g clipPath="url(#bpf_clip_2)">
          <path transform="matrix(.75,0,0,.75,0,0)" d="M0 0H816V264H0Z" fill="#ffffff" />
        </g>
        <g clipPath="url(#bpf_clip_3)">
          <g opacity=".15">
            <g clipPath="url(#bpf_clip_4)">
              <g clipPath="url(#bpf_clip_5)">
                <path transform="matrix(.406071,0,0,.406071,390.36656,-2.0730658)" d="M502 502H0V0H502V502ZM2 500H500V2H2V500ZM501 458.33H1V460.33H501V458.33ZM501 416.67H1V418.67H501V416.67ZM501 375H1V377H501V375ZM501 333.33H1V335.33H501V333.33ZM501 291.67H1V293.67H501V291.67ZM501 250H1V252H501V250ZM501 208.33H1V210.33H501V208.33ZM501 166.67H1V168.67H501V166.67ZM501 125H1V127H501V125ZM501 83.33H1V85.33H501V83.33ZM501 41.67H1V43.67H501V41.67ZM460.33 1H458.33V501H460.33V1ZM418.67 1H416.67V501H418.67V1ZM377 1H375V501H377V1ZM335.33 1H333.33V501H335.33V1ZM293.67 1H291.67V501H293.67V1ZM252 1H250V501H252V1ZM210.33 1H208.33V501H210.33V1ZM168.67 1H166.67V501H168.67V1ZM127 1H125V501H127V1ZM85.33 1H83.33V501H85.33V1ZM43.67 1H41.67V501H43.67V1Z" fill="#2fb7c4" />
              </g>
              <g clipPath="url(#bpf_clip_6)">
                <path transform="matrix(.406071,0,0,.406071,186.5125,-2.4794627)" d="M502 502H0V0H502V502ZM2 500H500V2H2V500ZM501 458.33H1V460.33H501V458.33ZM501 416.67H1V418.67H501V416.67ZM501 375H1V377H501V375ZM501 333.33H1V335.33H501V333.33ZM501 291.67H1V293.67H501V291.67ZM501 250H1V252H501V250ZM501 208.33H1V210.33H501V208.33ZM501 166.67H1V168.67H501V166.67ZM501 125H1V127H501V125ZM501 83.33H1V85.33H501V83.33ZM501 41.67H1V43.67H501V41.67ZM460.33 1H458.33V501H460.33V1ZM418.67 1H416.67V501H418.67V1ZM377 1H375V501H377V1ZM335.33 1H333.33V501H335.33V1ZM293.67 1H291.67V501H293.67V1ZM252 1H250V501H252V1ZM210.33 1H208.33V501H210.33V1ZM168.67 1H166.67V501H168.67V1ZM127 1H125V501H127V1ZM85.33 1H83.33V501H85.33V1ZM43.67 1H41.67V501H43.67V1Z" fill="#2fb7c4" />
              </g>
            </g>
          </g>
        </g>
        <g clipPath="url(#bpf_clip_7)">
          <path transform="matrix(.7805052,0,0,.7805052,488.25245,-82.37261)" d="M368.98439 122.02344C368.98439 127.55469 373.46095 132.03125 378.9922 132.03125V144.14063C373.46095 144.14063 368.98439 148.61719 368.98439 154.14844 368.98439 159.66407 373.46095 164.15235 378.9922 164.15235V176.2539C373.46095 176.2539 368.98439 180.74219 368.98439 186.25782 368.98439 191.78907 373.46095 196.26563 378.9922 196.26563V208.3789C373.46095 208.3789 368.98439 212.85157 368.98439 218.38282 368.98439 223.90235 373.46095 228.38672 378.9922 228.38672V240.48828C373.46095 240.48828 368.98439 244.97657 368.98439 250.4961 368.98439 256.02345 373.46095 260.5 378.9922 260.5V272.61329C373.46095 272.61329 368.98439 277.08985 368.98439 282.6172 368.98439 288.14845 373.46095 292.6211 378.9922 292.6211V304.72657C373.46095 304.72657 368.98439 309.21095 368.98439 314.73048 368.98439 320.2578 373.46095 324.73439 378.9922 324.73439V336.84767C373.46095 336.84767 368.98439 341.32423 368.98439 346.85157 368.98439 352.3828 373.46095 356.85939 378.9922 356.85939V368.96095C373.46095 368.96095 368.98439 373.4453 368.98439 378.96485 368.98439 384.4961 373.46095 388.97267 378.9922 388.97267V401.08204C373.46095 401.08204 368.98439 405.5586 368.98439 411.08985H356.875C356.875 405.5586 352.39845 401.08204 346.8672 401.08204 341.33985 401.08204 336.86329 405.5586 336.86329 411.08985H324.75C324.75 405.5586 320.27345 401.08204 314.7461 401.08204 309.21485 401.08204 304.73829 405.5586 304.73829 411.08985H292.6289C292.6289 405.5586 288.15235 401.08204 282.6211 401.08204 277.09376 401.08204 272.6172 405.5586 272.6172 411.08985H260.5039C260.5039 405.5586 256.02735 401.08204 250.5 401.08204 244.97266 401.08204 240.4961 405.5586 240.4961 411.08985H228.38282C228.38282 405.5586 223.90625 401.08204 218.3789 401.08204 212.84766 401.08204 208.3711 405.5586 208.3711 411.08985H196.26172C196.26172 405.5586 191.78516 401.08204 186.2539 401.08204 180.72657 401.08204 176.25 405.5586 176.25 411.08985H164.13672C164.13672 405.5586 159.66016 401.08204 154.13282 401.08204 148.60157 401.08204 144.125 405.5586 144.125 411.08985H132.01563C132.01563 405.5586 127.53906 401.08204 122.00781 401.08204V388.97267C127.53906 388.97267 132.01563 384.4961 132.01563 378.96485 132.01563 373.4453 127.53906 368.96095 122.00781 368.96095V356.85939C127.53906 356.85939 132.01563 352.3828 132.01563 346.85157 132.01563 341.32423 127.53906 336.84767 122.00781 336.84767V324.73439C127.53906 324.73439 132.01563 320.2578 132.01563 314.73048 132.01563 309.21095 127.53906 304.72657 122.00781 304.72657V292.6211C127.53906 292.6211 132.01563 288.14845 132.01563 282.6172 132.01563 277.08985 127.53906 272.61329 122.00781 272.61329V260.5C127.53906 260.5 132.01563 256.02345 132.01563 250.4961 132.01563 244.97657 127.53906 240.48828 122.00781 240.48828V228.38672C127.53906 228.38672 132.01563 223.90235 132.01563 218.38282 132.01563 212.85157 127.53906 208.3789 122.00781 208.3789V196.26563C127.53906 196.26563 132.01563 191.78907 132.01563 186.25782 132.01563 180.74219 127.53906 176.2539 122.00781 176.2539V164.15235C127.53906 164.15235 132.01563 159.66407 132.01563 154.14844 132.01563 148.61719 127.53906 144.14063 122.00781 144.14063V132.03125C127.53906 132.03125 132.01563 127.55469 132.01563 122.02344 132.01563 116.50391 127.53906 112.01953 122.00781 112.01953V99.91797C127.53906 99.91797 132.01563 95.42969 132.01563 89.91016H144.125C144.125 95.42969 148.60157 99.91797 154.13282 99.91797 159.66016 99.91797 164.13672 95.42969 164.13672 89.91016H176.25C176.25 95.42969 180.72657 99.91797 186.2539 99.91797 191.78516 99.91797 196.26172 95.42969 196.26172 89.91016H208.3711C208.3711 95.42969 212.84766 99.91797 218.3789 99.91797 223.90625 99.91797 228.38282 95.42969 228.38282 89.91016H240.4961C240.4961 95.42969 244.97266 99.91797 250.5 99.91797 256.02735 99.91797 260.5039 95.42969 260.5039 89.91016H272.6172C272.6172 95.42969 277.09376 99.91797 282.6211 99.91797 288.15235 99.91797 292.6289 95.42969 292.6289 89.91016H304.73829C304.73829 95.42969 309.21485 99.91797 314.7461 99.91797 320.27345 99.91797 324.75 95.42969 324.75 89.91016H336.86329C336.86329 95.42969 341.33985 99.91797 346.8672 99.91797 352.39845 99.91797 356.875 95.42969 356.875 89.91016H368.98439C368.98439 95.42969 373.46095 99.91797 378.9922 99.91797V112.01953C373.46095 112.01953 368.98439 116.50391 368.98439 122.02344" fill="#252422" />
          <path transform="matrix(.7805052,0,0,.7805052,488.25245,-82.37261)" d="M357.92579 390.02345H143.07422V110.97266H357.92579V390.02345" fill="#252422" />
        </g>
        <g clipPath="url(#bpf_clip_8)">
          <path transform="matrix(.7805052,0,0,.7805052,-95.221637,-82.37261)" d="M368.98439 122.02344C368.98439 127.55469 373.46095 132.03125 378.9922 132.03125V144.14063C373.46095 144.14063 368.98439 148.61719 368.98439 154.14844 368.98439 159.66407 373.46095 164.15235 378.9922 164.15235V176.2539C373.46095 176.2539 368.98439 180.74219 368.98439 186.25782 368.98439 191.78907 373.46095 196.26563 378.9922 196.26563V208.3789C373.46095 208.3789 368.98439 212.85157 368.98439 218.38282 368.98439 223.90235 373.46095 228.38672 378.9922 228.38672V240.48828C373.46095 240.48828 368.98439 244.97657 368.98439 250.4961 368.98439 256.02345 373.46095 260.5 378.9922 260.5V272.61329C373.46095 272.61329 368.98439 277.08985 368.98439 282.6172 368.98439 288.14845 373.46095 292.6211 378.9922 292.6211V304.72657C373.46095 304.72657 368.98439 309.21095 368.98439 314.73048 368.98439 320.2578 373.46095 324.73439 378.9922 324.73439V336.84767C373.46095 336.84767 368.98439 341.32423 368.98439 346.85157 368.98439 352.3828 373.46095 356.85939 378.9922 356.85939V368.96095C373.46095 368.96095 368.98439 373.4453 368.98439 378.96485 368.98439 384.4961 373.46095 388.97267 378.9922 388.97267V401.08204C373.46095 401.08204 368.98439 405.5586 368.98439 411.08985H356.875C356.875 405.5586 352.39845 401.08204 346.8672 401.08204 341.33985 401.08204 336.86329 405.5586 336.86329 411.08985H324.75C324.75 405.5586 320.27345 401.08204 314.7461 401.08204 309.21485 401.08204 304.73829 405.5586 304.73829 411.08985H292.6289C292.6289 405.5586 288.15235 401.08204 282.6211 401.08204 277.09376 401.08204 272.6172 405.5586 272.6172 411.08985H260.5039C260.5039 405.5586 256.02735 401.08204 250.5 401.08204 244.97266 401.08204 240.4961 405.5586 240.4961 411.08985H228.38282C228.38282 405.5586 223.90625 401.08204 218.3789 401.08204 212.84766 401.08204 208.3711 405.5586 208.3711 411.08985H196.26172C196.26172 405.5586 191.78516 401.08204 186.2539 401.08204 180.72657 401.08204 176.25 405.5586 176.25 411.08985H164.13672C164.13672 405.5586 159.66016 401.08204 154.13282 401.08204 148.60157 401.08204 144.125 405.5586 144.125 411.08985H132.01563C132.01563 405.5586 127.53906 401.08204 122.00781 401.08204V388.97267C127.53906 388.97267 132.01563 384.4961 132.01563 378.96485 132.01563 373.4453 127.53906 368.96095 122.00781 368.96095V356.85939C127.53906 356.85939 132.01563 352.3828 132.01563 346.85157 132.01563 341.32423 127.53906 336.84767 122.00781 336.84767V324.73439C127.53906 324.73439 132.01563 320.2578 132.01563 314.73048 132.01563 309.21095 127.53906 304.72657 122.00781 304.72657V292.6211C127.53906 292.6211 132.01563 288.14845 132.01563 282.6172 132.01563 277.08985 127.53906 272.61329 122.00781 272.61329V260.5C127.53906 260.5 132.01563 256.02345 132.01563 250.4961 132.01563 244.97657 127.53906 240.48828 122.00781 240.48828V228.38672C127.53906 228.38672 132.01563 223.90235 132.01563 218.38282 132.01563 212.85157 127.53906 208.3789 122.00781 208.3789V196.26563C127.53906 196.26563 132.01563 191.78907 132.01563 186.25782 132.01563 180.74219 127.53906 176.2539 122.00781 176.2539V164.15235C127.53906 164.15235 132.01563 159.66407 132.01563 154.14844 132.01563 148.61719 127.53906 144.14063 122.00781 144.14063V132.03125C127.53906 132.03125 132.01563 127.55469 132.01563 122.02344 132.01563 116.50391 127.53906 112.01953 122.00781 112.01953V99.91797C127.53906 99.91797 132.01563 95.42969 132.01563 89.91016H144.125C144.125 95.42969 148.60157 99.91797 154.13282 99.91797 159.66016 99.91797 164.13672 95.42969 164.13672 89.91016H176.25C176.25 95.42969 180.72657 99.91797 186.2539 99.91797 191.78516 99.91797 196.26172 95.42969 196.26172 89.91016H208.3711C208.3711 95.42969 212.84766 99.91797 218.3789 99.91797 223.90625 99.91797 228.38282 95.42969 228.38282 89.91016H240.4961C240.4961 95.42969 244.97266 99.91797 250.5 99.91797 256.02735 99.91797 260.5039 95.42969 260.5039 89.91016H272.6172C272.6172 95.42969 277.09376 99.91797 282.6211 99.91797 288.15235 99.91797 292.6289 95.42969 292.6289 89.91016H304.73829C304.73829 95.42969 309.21485 99.91797 314.7461 99.91797 320.27345 99.91797 324.75 95.42969 324.75 89.91016H336.86329C336.86329 95.42969 341.33985 99.91797 346.8672 99.91797 352.39845 99.91797 356.875 95.42969 356.875 89.91016H368.98439C368.98439 95.42969 373.46095 99.91797 378.9922 99.91797V112.01953C373.46095 112.01953 368.98439 116.50391 368.98439 122.02344" fill="#252422" />
          <path transform="matrix(.7805052,0,0,.7805052,-95.221637,-82.37261)" d="M357.92579 390.02345H143.07422V110.97266H357.92579V390.02345" fill="#252422" />
        </g>
        {/* Large CodeX Hexagon Icon Centered in Right Stub (Horizontally Centered & Bigger) */}
        <image
          href={ASSETS?.IMAGES?.CODEX_LOGO_ICON || "/codex-logo-icon.svg"}
          x={466}
          y={50}
          width={108}
          height={108}
          preserveAspectRatio="xMidYMid meet"
        />

        <g clipPath="url(#bpf_clip_14)">
          <g opacity=".63">
            <g clipPath="url(#bpf_clip_15)">
              <g clipPath="url(#bpf_clip_16)">
                <g clipPath="url(#bpf_clip_17)">
                  <g>
                    <g clipPath="url(#bpf_clip_18)">
                      <path transform="matrix(.6242676,0,0,.6242676,18.180367,8.557985)" d="M0 0H256V295H0Z" fill="#373531" />
                    </g>
                  </g>
                </g>
              </g>
              <g clipPath="url(#bpf_clip_19)">
                <g clipPath="url(#bpf_clip_20)">
                  <g clipPath="url(#bpf_clip_21)">
                    <path transform="matrix(.75000008,0,0,.75000008,18.180367,8.557985)" strokeWidth="8" strokeLinecap="butt" stroke-miterlimit="4" strokeLinejoin="miter" fill="none" stroke="#02bed3" d="M11.003319 0H202.07482C208.14957 0 213.07413 4.9245626 213.07413 10.999319V234.34444C213.07413 240.41919 208.14957 245.34375 202.07482 245.34375H11.003319C4.9285628 245.34375 .0040001727 240.41919 .0040001727 234.34444V10.999319C.0040001727 4.9245626 4.9285628 0 11.003319 0Z" />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
        <g clipPath="url(#bpf_clip_22)">
          <g>
            <g clipPath="url(#bpf_clip_23)">
              <path transform="matrix(.36927579,0,0,.36927579,18.180367,77.43416)" d="M0 0H433V256H0Z" fill="#ffffff" />
            </g>
          </g>
        </g>
        <g clipPath="url(#bpf_clip_24)">
          <path transform="matrix(.75,0,0,.75,18.180367,77.43416)" strokeWidth="4" strokeLinecap="butt" stroke-miterlimit="4" strokeLinejoin="miter" fill="none" stroke="#02bed3" d="M.00998351 0H213.06815V126.03125H.00998351Z" />
        </g>
        <g clipPath="url(#bpf_clip_25)">
          {qrCodeImage ? (
            <image
              href={qrCodeImage}
              x={63}
              y={94}
              width={68}
              height={68}
              preserveAspectRatio="xMidYMid meet"
            />
          ) : (
            <path transform="matrix(.068,0,0,.068,64.5,94)" d="M407.1428 45.238134V90.4762H361.90473V45.238134H407.1428ZM542.85708 45.238134H497.619V90.4762H542.85708V45.238134ZM452.38093 90.4762H407.1428V135.71433H452.38093V90.4762ZM723.80947 90.4762V226.19046H859.5237V90.4762H723.80947ZM407.1428 135.71433H361.90473V180.9524H407.1428V135.71433ZM180.95233 226.19046H226.19046V90.4762H90.476139V226.19046H180.95233ZM407.1428 226.19046V271.4286H452.38093V226.19046H407.1428ZM0 316.66667V0H316.6666V316.66667H0ZM45.238069 271.4286H271.42854V45.238134H45.238069V271.4286ZM361.90473 316.66667H407.1428V271.4286H361.90473V316.66667ZM588.0952 271.4286V180.9524H542.85708V135.71433H497.619V180.9524H452.38093V226.19046H542.85708V316.66667H497.619V271.4286H452.38093V361.9048H588.0952V271.4286ZM90.476139 407.14286H180.95233V361.9048H0V407.14286H90.476139ZM633.33328 361.9048H588.0952V407.14286H633.33328V361.9048ZM723.80947 361.9048H678.5714V407.14286H723.80947V361.9048ZM859.5237 361.9048V407.14286H904.7617V361.9048H859.5237ZM588.09518 407.14286H542.857V452.38093H588.09518V407.14286ZM904.7617 452.38093H949.99966V407.14286H904.7617V452.38093ZM542.857 497.61906V452.38093H497.61894V497.61906H542.857ZM588.09518 452.38093V497.61906H678.57138V407.14286H633.3332V452.38093H588.0951 588.09518ZM859.5237 497.61906H814.28567V361.9048H769.0475V407.14286H723.80947V452.38093H769.0475V497.61906H723.80947V542.8571H859.5237V588.0952H904.7617V542.8572H949.99966V497.6191H904.7617V452.38099H859.5237V497.6191 497.61906ZM90.476139 588.0952V542.8572H45.238069V497.6191H0V588.0952H90.476139ZM678.5714 542.8572H723.80947V588.0952H814.28567V678.5714H859.5237V723.8096H769.0475V633.3334H678.57138V723.8096H588.09518V769.0476H542.857V723.8096H497.61894V678.5714H542.857V633.3334H497.61894V588.0952H407.14274V497.61909H90.476139V452.38096H226.19046V407.14289H271.42854V452.38096H316.6666V407.14289H271.42854V361.90483H407.1428V407.14289H361.90473V452.38096H407.1428V407.14289H497.619V452.38096H452.38093V497.61909H497.619V542.8572H542.85708V588.0952H678.5714V542.8572ZM633.33328 633.3334H588.0952V678.5714H633.33328V633.3334ZM271.42854 588.0952H316.6666V542.8572H271.42854V588.0952ZM361.90473 588.0952V633.3334H407.1428V588.0952H361.90473ZM316.6666 633.3334V950H0V633.3334H316.6666ZM271.42854 678.5714H45.238069V904.76187H271.42854V678.5714ZM904.7618 633.3334H859.5237V678.5714H904.7617V633.3334H904.7618ZM452.38093 678.5714V633.3334H407.1428V723.8096H361.90473V950H452.38093V904.76187H407.1428V814.28567H452.38093V769.0476H497.619V723.8096H452.38093V678.5714ZM90.476139 723.8096V859.5238H226.19046V723.8096H90.476139ZM904.7618 769.0476H949.9997V723.8096H904.7618V769.0476ZM769.0475 769.0476H723.80947V814.28567H814.28567V859.5238H769.0475V904.76187H859.5237V769.0476H769.0475ZM497.61897 859.5238H542.85708V814.28567H452.38093V859.5238H497.619 497.61897ZM588.09518 859.5238H633.33328V814.28567H588.0952V859.5238H588.09518ZM678.57138 859.5238V904.76187H723.80947V859.5238H678.5714 678.57138ZM497.61897 950H542.85708V904.76187H497.619V950H497.61897ZM588.09518 950H633.33328V904.76187H588.0952V950H588.09518ZM723.80947 950H769.0475V904.76187H723.80947V950ZM452.38093 0H407.1428V45.238134H452.38093V0ZM588.0952 0H542.85708V45.238134H588.0952V0ZM949.99978 0V316.66667H633.33328V0H949.99978ZM904.76187 45.238134H678.5714V271.4286H904.76187V45.238134Z" fill="#323232" />
          )}
        </g>
        <g clipPath="url(#bpf_clip_26)">
          <path transform="matrix(.067285459,0,0,.067285459,46.8034,73.68099)" d="M1268.97 192.14H1221.13V222.14H1268.97C1294.85 222.14 1315.9099 243.2 1315.9099 269.08V1282.8099C1315.9099 1308.69 1294.8499 1329.7499 1268.97 1329.7499H255.24C229.36 1329.7499 208.3 1308.6898 208.3 1282.8099V269.07C208.3 243.19 229.36 222.13 255.24 222.13H303.08003V192.13H255.24002C212.82003 192.13 178.30002 226.64 178.30002 269.07V1282.8C178.30002 1325.2201 212.81002 1359.74 255.24002 1359.74H1268.97C1311.39 1359.74 1345.9099 1325.23 1345.9099 1282.8V269.07C1345.9099 226.65001 1311.3999 192.13 1268.97 192.13V192.14Z" fill="#323232" />
          <path transform="matrix(.067285459,0,0,.067285459,46.8034,73.68099)" d="M453.4 248.21C442.00999 248.21 434.94999 243.58 432.19999 234.33L399.46998 240.22C406.02998 263.55 423.30998 275.22 451.28999 275.22 466.59999 275.22 478.96998 271.61003 488.38999 264.4 497.81 257.19 502.52 247.76999 502.52 236.15 502.52 228.79999 500.59 222.40999 496.72 217 492.85 211.58 488.03 207.76 482.25 205.52 476.47 203.29001 466.71 200.71 452.97 197.81 447.98 196.75 444.61003 195.63 442.87 194.45 441.13 193.27 440.26 191.62 440.26 189.48999 440.26 184.71999 444.1 182.34 451.79 182.34 461.04 182.34 467.19 186.18 470.21003 193.87L499.40003 185.04C491.88005 166.25 476.43003 156.85999 453.05003 156.85999 437.63 156.85999 425.80003 160.44998 417.59004 167.62999 409.37004 174.80998 405.26005 183.81999 405.26005 194.63999 405.26005 203.05998 408.12004 210.37999 413.84004 216.59998 419.56004 222.82997 432.49003 227.86998 452.63005 231.72998 457.90003 232.78998 461.56004 234.00998 463.61006 235.38999 465.66004 236.75998 466.68006 238.68999 466.68006 241.14998 466.68006 245.85999 462.25007 248.21999 453.39006 248.21999L453.4 248.21Z" fill="#323232" />
          <path transform="matrix(.067285459,0,0,.067285459,46.8034,73.68099)" d="M563.02 275.21C575.98007 275.21 586.9 271.44999 595.79006 263.94 604.68008 256.42 609.88009 245.63 611.4 231.55L579.18008 229.61C578.06008 242.29001 572.84 248.62 563.53 248.62 558.31008 248.62 554.26 246.37999 551.37008 241.89 548.48007 237.4 547.04006 228.91 547.04006 216.4 547.04006 194.07999 552.59 182.92 563.7 182.92 567.68 182.92 571.15 184.63 574.09 188.05 577.04006 191.47 578.51 197.02 578.51 204.71L611.4 202.94C610.33 189.03 605.72006 177.87 597.56 169.46 589.4 161.05 577.72 156.84001 562.52 156.84001 546.25 156.84001 533.58 162.36002 524.49 173.41 515.41 184.46 510.86 198.99 510.86 216.99 510.86 234.99 515.64999 249.41 525.25 259.73 534.84 270.05003 547.43 275.21003 563.02 275.21003V275.21Z" fill="#323232" />
          <path transform="matrix(.067285459,0,0,.067285459,46.8034,73.68099)" d="M648.39 250.81H679.15L685.64 273.44H721.61L685.58999 158.6H648.31997L612.86996 273.44H641.4899L648.37997 250.81H648.39ZM663.68 192.43 672.97 225.73999H654.38998L663.67996 192.43H663.68Z" fill="#323232" />
          <path transform="matrix(.067285459,0,0,.067285459,46.8034,73.68099)" d="M760.8 217.84C760.8 212.68 759.87 206.4 758.01998 199 762.11996 208.3 766.18997 216.20999 770.23 222.70999L801.68 273.44999H830.37V158.60999H801.68V192.59999C801.68 202.85999 802.58 212.9 804.37 222.71999 801.62 216.37999 797.58999 209.02999 792.26 200.68L765.5 158.62H732.19V273.46H760.79V217.84999L760.8 217.84Z" fill="#323232" />
          <path transform="matrix(.067285459,0,0,.067285459,46.8034,73.68099)" d="M919.89 191.34 941.97 273.45H964.35L985.59 191.34V273.45H1018.32V158.61H972.09L956.19 219.6 939.53 158.61H893.47V273.45H919.89V191.34Z" fill="#323232" />
          <path transform="matrix(.067285459,0,0,.067285459,46.8034,73.68099)" d="M1124.74 246.02H1072.92V227.26H1114.81V201.77H1072.92V185.11H1124.74V158.61H1038.34V273.45H1124.74V246.02Z" fill="#323232" />
        </g>
        <g clipPath="url(#bpf_clip_27)">
          {descLines.length > 0 && (
            <g>
              <text
                xmlSpace="preserve"
                transform="matrix(.62500259 0 0 .62500259 226.1125 45.956926)"
                fontSize="12"
                fontFamily="Space Mono"
                className="bp-mono"
              >
                {descLines.map((line, idx) => (
                  <tspan key={idx} x="0" y={11 + idx * 16}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          )}
          {userId && (
            <>
              <g>
                <text xmlSpace="preserve" transform="matrix(.62500259 0 0 .62500259 375.3127 116.82273)" fontSize="12" fontFamily="Space Mono" className="bp-mono"><tspan y="11">USER ID</tspan></text>
              </g>
              <text xmlSpace="preserve" transform="matrix(.75 0 0 .75 375.3127 129.16539)" fontSize={userIdFontSize} fontFamily="Space Mono" fontWeight="bold" className="bp-mono"><tspan y="14">{userId}</tspan></text>
            </>
          )}
          {userPassword && (
            <>
              <g>
                <text xmlSpace="preserve" transform="matrix(.62500259 0 0 .62500259 375.3127 148.89475)" fontSize="12" fontFamily="Space Mono" className="bp-mono"><tspan y="11">USER PASSWORD</tspan></text>
              </g>
              <text xmlSpace="preserve" transform="matrix(.75 0 0 .75 375.3127 161.2374)" fontSize={userPasswordFontSize} fontFamily="Space Mono" fontWeight="bold" className="bp-mono"><tspan y="14">{userPassword}</tspan></text>
            </>
          )}
        </g>
        {eventName && (
          <g>
            <text xmlSpace="preserve" transform={`matrix(${eventNameTransformScale} 0 0 ${eventNameTransformScale} 226.1125 23.641488)`} fontSize="21.33" fontFamily="Space Mono" fontWeight="bold" className="bp-mono"><tspan y="22">{eventName}</tspan></text>
          </g>
        )}
        {time && (
          <>
            <g>
              <text fill="#0e0202" xmlSpace="preserve" transform="matrix(.62500259 0 0 .62500259 226.1125 112.3958)" fontSize="12" fontFamily="Space Mono" className="bp-mono"><tspan y="11">SLOT TIME</tspan></text>
            </g>
            <text fill="#0e0202" xmlSpace="preserve" transform="matrix(.75 0 0 .75 226.1125 124.73846)" fontSize={timeFontSize} fontFamily="Space Mono" fontWeight="bold" className="bp-mono"><tspan y="14">{time}</tspan></text>
          </>
        )}
        {venue && (
          <>
            <g>
              <text fill="#0e0202" xmlSpace="preserve" transform="matrix(.62500259 0 0 .62500259 226.1125 146.74819)" fontSize="12" fontFamily="Space Mono" className="bp-mono"><tspan y="11">VENUE</tspan></text>
            </g>
            <text fill="#0e0202" xmlSpace="preserve" transform="matrix(.75 0 0 .75 226.1125 159.09085)" fontSize={venueFontSize} fontFamily="Space Mono" fontWeight="bold" className="bp-mono"><tspan y="14">{venue}</tspan></text>
          </>
        )}
        {seat && (
          <>
            <g>
              <text fill="#0e0202" xmlSpace="preserve" transform="matrix(.62500259 0 0 .62500259 330 148.9006)" fontSize="12" fontFamily="Space Mono" className="bp-mono"><tspan y="11">DESK</tspan></text>
            </g>
            <text fill="#0e0202" xmlSpace="preserve" transform="matrix(.75 0 0 .75 330 161.24326)" fontSize={seatFontSize} fontFamily="Space Mono" fontWeight="bold" className="bp-mono"><tspan y="14">{seat}</tspan></text>
          </>
        )}
        {studentName && (
          <>
            <g>
              <text fill="#ffffff" x="97" y={nameLabelY} textAnchor="middle" fontSize={7.25} fontFamily="Space Mono" className="bp-mono">NAME</text>
            </g>
            <g>
              <text fill="#02bed3" x="97" y={nameTextY} textAnchor="middle" fontSize={studentFontSize} fontFamily="Space Mono" fontWeight="bold" className="bp-mono">{studentName}</text>
            </g>
          </>
        )}
        {teamName && (
          <>
            <g>
              <text fill="#ffffff" x="97" y={teamLabelY} textAnchor="middle" fontSize={7.25} fontFamily="Space Mono" className="bp-mono">TEAM</text>
            </g>
            <g>
              <text fill="#02bed3" x="97" y={teamTextY} textAnchor="middle" fontSize={teamFontSize} fontFamily="Space Mono" fontWeight="bold" className="bp-mono">{teamName}</text>
            </g>
          </>
        )}
        <g>
          <text fill="#eef7e7" x="97" y="186.2" textAnchor="middle" fontSize={11.0} fontFamily="Space Mono" fontWeight="bold" className="bp-mono">BOARDING PASS</text>
        </g>
        {boardingPassId && (
          <g>
            <text fill="#0e0202" x="520" y={qid ? 17 : 20} textAnchor="middle" fontSize={boardingPassIdFontSize} fontFamily="Space Mono" fontWeight="bold" className="bp-mono">ID: {boardingPassId}</text>
          </g>
        )}
        {qid && (
          <g>
            <text fill="#0e0202" x="520" y={boardingPassId ? 28 : 20} textAnchor="middle" fontSize={qidFontSize} fontFamily="Space Mono" fontWeight="bold" className="bp-mono">QID: {qid}</text>
          </g>
        )}
      </g>
      <path transform="matrix(1,0,0,-1,0,205.92)" d="M0-32.594839H200.59047V218.14325H0Z" fillOpacity="0" />
      <path transform="matrix(1,0,0,-1,0,205.92)" d="M18.180367 13.342795H177.99286V197.36202H18.180367Z" fillOpacity="0" />
      <path transform="matrix(1,0,0,-1,0,205.92)" d="M18.180367 33.95124H177.99286V128.48584H18.180367Z" fillOpacity="0" />
      <path transform="matrix(1,0,0,-1,0,205.92)" d="M58.800397 40.717287H137.37284V121.7198H58.800397Z" fillOpacity="0" />
      <path transform="matrix(1,0,0,-1,0,205.92)" d="M69.23364 49.146535H126.93958V106.85248H69.23364Z" fillOpacity="0" />
      <path transform="matrix(1,0,0,-1,0,205.92)" d="M186.5125 4.545387H390.36659V208.39946H186.5125Z" fillOpacity="0" />
      <path transform="matrix(1,0,0,-1,0,205.92)" d="M390.36659 4.13899H594.22067V207.99308H390.36659Z" fillOpacity="0" />
      <path transform="matrix(1,0,0,-1,0,205.92)" d="M444.3912 30.782599H565.14187V47.029047H444.3912Z" fillOpacity="0" />
      <path transform="matrix(1,0,0,-1,0,205.92)" d="M583.4741-32.594839H784.0646V218.14325H583.4741Z" fillOpacity="0" />
    </svg>
  );
});

CodexBoardingPassFrontSVG.displayName = "CodexBoardingPassFrontSVG";



const CodexBoardingPassBackSVG = memo(({
  boardingPass = {},
  id = "codex-boarding-pass-back-svg",
  className = "",
  style = {},
  ...props
}) => {
  // Extract backend fields for the right stub
  const boardingPassId = (boardingPass?.boardingPassId || "").trim();
  const eventName = (boardingPass?.eventName || "").trim().toUpperCase();
  const tagLine = "Coding the Future, Today.".toUpperCase();
  const userId = (boardingPass?.loginUser || "").trim();
  const userPassword = (boardingPass?.loginPass || "").trim();

  // Format issue date
  const issueDateRaw = boardingPass?.issuedAt || boardingPass?.dateOfIssue || boardingPass?.eventDate || boardingPass?.date || "";
  const formattedIssueDate = (() => {
    if (!issueDateRaw) return "";
    try {
      const d = new Date(issueDateRaw);
      if (isNaN(d.getTime())) return String(issueDateRaw).toUpperCase();
      const day = String(d.getDate()).padStart(2, "0");
      const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
      const year = d.getFullYear();
      return `${day} ${month} ${year}`;
    } catch {
      return String(issueDateRaw).toUpperCase();
    }
  })();

  // Match the back-side stub text sizing to the front-side boarding-pass styling
  const getBackTextFontSize = (value, maxFontSize, minFontSize, targetLength) => {
    if (!value) return maxFontSize;
    return Math.max(
      minFontSize,
      Math.min(maxFontSize, (maxFontSize * targetLength) / Math.max(value.length, targetLength)),
    );
  };

  const backEventFontSize = (() => {
    return getBackTextFontSize(eventName, 14, 8, 26);
  })();
  const backTagLineFontSize = (() => {
    return getBackTextFontSize(tagLine, 9, 6, 24);
  })();
  const backDateValueFontSize = getBackTextFontSize(formattedIssueDate, 9.5, 7.2, 14);
  const backLoginFontSize = getBackTextFontSize(userId, 9.5, 7.2, 14);
  const backPasswordFontSize = getBackTextFontSize(userPassword, 9.5, 7.2, 14);
  return (
    <svg
      id={id}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      viewBox="0 0 612 198"
      className={className}
      style={style}
      {...props}
    >
      <defs>
        <style>{`
          ${BOARDING_PASS_FONTS_CSS}
          .bp-mono { font-family: 'Space Mono', monospace, ui-monospace; }
        `}</style>
        <clipPath id="bpb_clip_1">
          <path transform="matrix(.24,0,0,.24,0,0)" d="M0 0H2550V825H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpb_clip_2">
          <path transform="matrix(.24,0,0,.24,0,0)" d="M0 0H2550V825H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpb_clip_3">
          <path transform="matrix(.24,0,0,.24,0,0)" d="M1762.5516 0H2550V825H1762.5516Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpb_clip_4">
          <path transform="matrix(.24,0,0,.24,0,0)" d="M0 0H106.37832V825H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpb_clip_5">
          <path transform="matrix(.24,0,0,.24,0,0)" d="M0 0H2550V825H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpb_clip_6">
          <path transform="matrix(.24,0,0,.24,431.03999,0)" d="M0 0H754V825H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpb_clip_7">
          <path transform="matrix(.24,0,0,.24,431.03999,0)" d="M.92663577-1H755V826H.92663577Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpb_clip_8">
          <path transform="matrix(.24,0,0,.24,0,0)" d="M1936.398 674.8141H2439.523V743.5641H1936.398Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpb_clip_13">
          <path transform="matrix(.24,0,0,.24,0,0)" d="M0 0H2550V825H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpb_clip_14">
          <path transform="matrix(.24,0,0,.24,35.76,46.559999)" d="M0 0H438V458H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpb_clip_15">
          <path transform="matrix(.24,0,0,.24,35.76,46.559999)" d="M133.82892 151.83707H327.82856V345.83674H133.82892Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpb_clip_16">
          <path transform="matrix(.24,0,0,.24,35.76,46.559999)" d="M98.78049 101.89325H363.32548V373.99665H98.78049Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpb_clip_17">
          <path transform="matrix(.24,0,0,.24,35.76,46.559999)" d="M0 0H438V72H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpb_clip_18">
          <path transform="matrix(.24,0,0,.24,289.91999,46.559999)" d="M0 0H519V450H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpb_clip_19">
          <path transform="matrix(.24,0,0,.24,289.91999,46.559999)" d="M0 0H519V72H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpb_clip_20">
          <path transform="matrix(.24,0,0,.24,289.91999,46.559999)" d="M172.13819 144.13642H364.13435V336.13258H172.13819Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpb_clip_21">
          <path transform="matrix(.24,0,0,.24,289.91999,46.559999)" d="M137.45166 94.708377H399.26463V364.0017H137.45166Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpb_clip_22">
          <path transform="matrix(.24,0,0,.24,160.56,49.68)" d="M0 0H446V445H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpb_clip_23">
          <path transform="matrix(.24,0,0,.24,160.56,49.68)" d="M0 0H446V69H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpb_clip_24">
          <path transform="matrix(.24,0,0,.24,160.56,49.68)" d="M138.4137 148.56836H323.92396V334.0786H138.4137Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpb_clip_25">
          <path transform="matrix(.24,0,0,.24,160.56,49.68)" d="M104.89899 100.81006H357.8675V361.00627H104.89899Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpb_clip_26">
          <path transform="matrix(.24,0,0,.24,473.52,18.24)" d="M0 0H79V46H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpb_clip_27">
          <path transform="matrix(.24,0,0,.24,542.16,18.24)" d="M0 0H98V46H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpb_clip_28">
          <path transform="matrix(.24,0,0,.24,455.75999,50.64)" d="M0 0H251V45H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpb_clip_29">
          <path transform="matrix(.24,0,0,.24,546.95999,50.64)" d="M0 0H79V45H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpb_clip_30">
          <path transform="matrix(.24,0,0,.24,471.59999,181.2)" d="M0 0H423V45H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpb_clip_31">
          <path transform="matrix(.24,0,0,.24,0,0)" d="M0 0H72V825H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="bpb_clip_32">
          <path transform="matrix(.24,0,0,.24,0,0)" d="M-1-1H71.789249V825.60806H-1Z" clipRule="evenodd" />
        </clipPath>
      </defs>
      <g>
        <g clipPath="url(#bpb_clip_1)">
          <path transform="matrix(.75,0,0,.75,0,0)" d="M0 0H816V264H0Z" fill="#ffffff" />
        </g>
        <g clipPath="url(#bpb_clip_2)">
          <path transform="matrix(.75,0,0,.75,0,0)" d="M0 0H816V264H0Z" fill="#ffffff" />
        </g>
        <g clipPath="url(#bpb_clip_3)">
          <path transform="matrix(.7805052,0,0,.7805052,327.79075,-83.74106)" d="M368.98439 122.02344C368.98439 127.55469 373.46095 132.03125 378.9922 132.03125V144.14063C373.46095 144.14063 368.98439 148.61719 368.98439 154.14844 368.98439 159.66407 373.46095 164.15235 378.9922 164.15235V176.2539C373.46095 176.2539 368.98439 180.74219 368.98439 186.25782 368.98439 191.78907 373.46095 196.26563 378.9922 196.26563V208.3789C373.46095 208.3789 368.98439 212.85157 368.98439 218.38282 368.98439 223.90235 373.46095 228.38672 378.9922 228.38672V240.48828C373.46095 240.48828 368.98439 244.97657 368.98439 250.4961 368.98439 256.02345 373.46095 260.5 378.9922 260.5V272.61329C373.46095 272.61329 368.98439 277.08985 368.98439 282.6172 368.98439 288.14845 373.46095 292.6211 378.9922 292.6211V304.72657C373.46095 304.72657 368.98439 309.21095 368.98439 314.73048 368.98439 320.2578 373.46095 324.73439 378.9922 324.73439V336.84767C373.46095 336.84767 368.98439 341.32423 368.98439 346.85157 368.98439 352.3828 373.46095 356.85939 378.9922 356.85939V368.96095C373.46095 368.96095 368.98439 373.4453 368.98439 378.96485 368.98439 384.4961 373.46095 388.97267 378.9922 388.97267V401.08204C373.46095 401.08204 368.98439 405.5586 368.98439 411.08985H356.875C356.875 405.5586 352.39845 401.08204 346.8672 401.08204 341.33985 401.08204 336.86329 405.5586 336.86329 411.08985H324.75C324.75 405.5586 320.27345 401.08204 314.7461 401.08204 309.21485 401.08204 304.73829 405.5586 304.73829 411.08985H292.6289C292.6289 405.5586 288.15235 401.08204 282.6211 401.08204 277.09376 401.08204 272.6172 405.5586 272.6172 411.08985H260.5039C260.5039 405.5586 256.02735 401.08204 250.5 401.08204 244.97266 401.08204 240.4961 405.5586 240.4961 411.08985H228.38282C228.38282 405.5586 223.90625 401.08204 218.3789 401.08204 212.84766 401.08204 208.3711 405.5586 208.3711 411.08985H196.26172C196.26172 405.5586 191.78516 401.08204 186.2539 401.08204 180.72657 401.08204 176.25 405.5586 176.25 411.08985H164.13672C164.13672 405.5586 159.66016 401.08204 154.13282 401.08204 148.60157 401.08204 144.125 405.5586 144.125 411.08985H132.01563C132.01563 405.5586 127.53906 401.08204 122.00781 401.08204V388.97267C127.53906 388.97267 132.01563 384.4961 132.01563 378.96485 132.01563 373.4453 127.53906 368.96095 122.00781 368.96095V356.85939C127.53906 356.85939 132.01563 352.3828 132.01563 346.85157 132.01563 341.32423 127.53906 336.84767 122.00781 336.84767V324.73439C127.53906 324.73439 132.01563 320.2578 132.01563 314.73048 132.01563 309.21095 127.53906 304.72657 122.00781 304.72657V292.6211C127.53906 292.6211 132.01563 288.14845 132.01563 282.6172 132.01563 277.08985 127.53906 272.61329 122.00781 272.61329V260.5C127.53906 260.5 132.01563 256.02345 132.01563 250.4961 132.01563 244.97657 127.53906 240.48828 122.00781 240.48828V228.38672C127.53906 228.38672 132.01563 223.90235 132.01563 218.38282 132.01563 212.85157 127.53906 208.3789 122.00781 208.3789V196.26563C127.53906 196.26563 132.01563 191.78907 132.01563 186.25782 132.01563 180.74219 127.53906 176.2539 122.00781 176.2539V164.15235C127.53906 164.15235 132.01563 159.66407 132.01563 154.14844 132.01563 148.61719 127.53906 144.14063 122.00781 144.14063V132.03125C127.53906 132.03125 132.01563 127.55469 132.01563 122.02344 132.01563 116.50391 127.53906 112.01953 122.00781 112.01953V99.91797C127.53906 99.91797 132.01563 95.42969 132.01563 89.91016H144.125C144.125 95.42969 148.60157 99.91797 154.13282 99.91797 159.66016 99.91797 164.13672 95.42969 164.13672 89.91016H176.25C176.25 95.42969 180.72657 99.91797 186.2539 99.91797 191.78516 99.91797 196.26172 95.42969 196.26172 89.91016H208.3711C208.3711 95.42969 212.84766 99.91797 218.3789 99.91797 223.90625 99.91797 228.38282 95.42969 228.38282 89.91016H240.4961C240.4961 95.42969 244.97266 99.91797 250.5 99.91797 256.02735 99.91797 260.5039 95.42969 260.5039 89.91016H272.6172C272.6172 95.42969 277.09376 99.91797 282.6211 99.91797 288.15235 99.91797 292.6289 95.42969 292.6289 89.91016H304.73829C304.73829 95.42969 309.21485 99.91797 314.7461 99.91797 320.27345 99.91797 324.75 95.42969 324.75 89.91016H336.86329C336.86329 95.42969 341.33985 99.91797 346.8672 99.91797 352.39845 99.91797 356.875 95.42969 356.875 89.91016H368.98439C368.98439 95.42969 373.46095 99.91797 378.9922 99.91797V112.01953C373.46095 112.01953 368.98439 116.50391 368.98439 122.02344" fill="#252422" />
          <path transform="matrix(.7805052,0,0,.7805052,327.79075,-83.74106)" d="M357.92579 390.02345H143.07422V110.97266H357.92579V390.02345" fill="#252422" />
        </g>
        <g clipPath="url(#bpb_clip_4)">
          <path transform="matrix(-.7805052,0,0,-.7805052,120.752429,286.00947)" d="M368.98439 122.02344C368.98439 127.55469 373.46095 132.03125 378.9922 132.03125V144.14063C373.46095 144.14063 368.98439 148.61719 368.98439 154.14844 368.98439 159.66407 373.46095 164.15235 378.9922 164.15235V176.2539C373.46095 176.2539 368.98439 180.74219 368.98439 186.25782 368.98439 191.78907 373.46095 196.26563 378.9922 196.26563V208.3789C373.46095 208.3789 368.98439 212.85157 368.98439 218.38282 368.98439 223.90235 373.46095 228.38672 378.9922 228.38672V240.48828C373.46095 240.48828 368.98439 244.97657 368.98439 250.4961 368.98439 256.02345 373.46095 260.5 378.9922 260.5V272.61329C373.46095 272.61329 368.98439 277.08985 368.98439 282.6172 368.98439 288.14845 373.46095 292.6211 378.9922 292.6211V304.72657C373.46095 304.72657 368.98439 309.21095 368.98439 314.73048 368.98439 320.2578 373.46095 324.73439 378.9922 324.73439V336.84767C373.46095 336.84767 368.98439 341.32423 368.98439 346.85157 368.98439 352.3828 373.46095 356.85939 378.9922 356.85939V368.96095C373.46095 368.96095 368.98439 373.4453 368.98439 378.96485 368.98439 384.4961 373.46095 388.97267 378.9922 388.97267V401.08204C373.46095 401.08204 368.98439 405.5586 368.98439 411.08985H356.875C356.875 405.5586 352.39845 401.08204 346.8672 401.08204 341.33985 401.08204 336.86329 405.5586 336.86329 411.08985H324.75C324.75 405.5586 320.27345 401.08204 314.7461 401.08204 309.21485 401.08204 304.73829 405.5586 304.73829 411.08985H292.6289C292.6289 405.5586 288.15235 401.08204 282.6211 401.08204 277.09376 401.08204 272.6172 405.5586 272.6172 411.08985H260.5039C260.5039 405.5586 256.02735 401.08204 250.5 401.08204 244.97266 401.08204 240.4961 405.5586 240.4961 411.08985H228.38282C228.38282 405.5586 223.90625 401.08204 218.3789 401.08204 212.84766 401.08204 208.3711 405.5586 208.3711 411.08985H196.26172C196.26172 405.5586 191.78516 401.08204 186.2539 401.08204 180.72657 401.08204 176.25 405.5586 176.25 411.08985H164.13672C164.13672 405.5586 159.66016 401.08204 154.13282 401.08204 148.60157 401.08204 144.125 405.5586 144.125 411.08985H132.01563C132.01563 405.5586 127.53906 401.08204 122.00781 401.08204V388.97267C127.53906 388.97267 132.01563 384.4961 132.01563 378.96485 132.01563 373.4453 127.53906 368.96095 122.00781 368.96095V356.85939C127.53906 356.85939 132.01563 352.3828 132.01563 346.85157 132.01563 341.32423 127.53906 336.84767 122.00781 336.84767V324.73439C127.53906 324.73439 132.01563 320.2578 132.01563 314.73048 132.01563 309.21095 127.53906 304.72657 122.00781 304.72657V292.6211C127.53906 292.6211 132.01563 288.14845 132.01563 282.6172 132.01563 277.08985 127.53906 272.61329 122.00781 272.61329V260.5C127.53906 260.5 132.01563 256.02345 132.01563 250.4961 132.01563 244.97657 127.53906 240.48828 122.00781 240.48828V228.38672C127.53906 228.38672 132.01563 223.90235 132.01563 218.38282 132.01563 212.85157 127.53906 208.3789 122.00781 208.3789V196.26563C127.53906 196.26563 132.01563 191.78907 132.01563 186.25782 132.01563 180.74219 127.53906 176.2539 122.00781 176.2539V164.15235C127.53906 164.15235 132.01563 159.66407 132.01563 154.14844 132.01563 148.61719 127.53906 144.14063 122.00781 144.14063V132.03125C127.53906 132.03125 132.01563 127.55469 132.01563 122.02344 132.01563 116.50391 127.53906 112.01953 122.00781 112.01953V99.91797C127.53906 99.91797 132.01563 95.42969 132.01563 89.91016H144.125C144.125 95.42969 148.60157 99.91797 154.13282 99.91797 159.66016 99.91797 164.13672 95.42969 164.13672 89.91016H176.25C176.25 95.42969 180.72657 99.91797 186.2539 99.91797 191.78516 99.91797 196.26172 95.42969 196.26172 89.91016H208.3711C208.3711 95.42969 212.84766 99.91797 218.3789 99.91797 223.90625 99.91797 228.38282 95.42969 228.38282 89.91016H240.4961C240.4961 95.42969 244.97266 99.91797 250.5 99.91797 256.02735 99.91797 260.5039 95.42969 260.5039 89.91016H272.6172C272.6172 95.42969 277.09376 99.91797 282.6211 99.91797 288.15235 99.91797 292.6289 95.42969 292.6289 89.91016H304.73829C304.73829 95.42969 309.21485 99.91797 314.7461 99.91797 320.27345 99.91797 324.75 95.42969 324.75 89.91016H336.86329C336.86329 95.42969 341.33985 99.91797 346.8672 99.91797 352.39845 99.91797 356.875 95.42969 356.875 89.91016H368.98439C368.98439 95.42969 373.46095 99.91797 378.9922 99.91797V112.01953C373.46095 112.01953 368.98439 116.50391 368.98439 122.02344" fill="#252422" />
          <path transform="matrix(-.7805052,0,0,-.7805052,120.752429,286.00947)" d="M357.92579 390.02345H143.07422V110.97266H357.92579V390.02345" fill="#252422" />
        </g>
        <g clipPath="url(#bpb_clip_5)">
          <g opacity=".14">
            <g clipPath="url(#bpb_clip_6)">
              <g clipPath="url(#bpb_clip_7)">
                <path transform="matrix(.406071,0,0,.406071,431.26237,-3.1302384)" d="M502 502H0V0H502V502ZM2 500H500V2H2V500ZM501 458.33H1V460.33H501V458.33ZM501 416.67H1V418.67H501V416.67ZM501 375H1V377H501V375ZM501 333.33H1V335.33H501V333.33ZM501 291.67H1V293.67H501V291.67ZM501 250H1V252H501V250ZM501 208.33H1V210.33H501V208.33ZM501 166.67H1V168.67H501V166.67ZM501 125H1V127H501V125ZM501 83.33H1V85.33H501V83.33ZM501 41.67H1V43.67H501V41.67ZM460.33 1H458.33V501H460.33V1ZM418.67 1H416.67V501H418.67V1ZM377 1H375V501H377V1ZM335.33 1H333.33V501H335.33V1ZM293.67 1H291.67V501H293.67V1ZM252 1H250V501H252V1ZM210.33 1H208.33V501H210.33V1ZM168.67 1H166.67V501H168.67V1ZM127 1H125V501H127V1ZM85.33 1H83.33V501H85.33V1ZM43.67 1H41.67V501H43.67V1Z" fill="#2fb7c4" />
              </g>
            </g>
          </g>
        </g>
        <g clipPath="url(#bpb_clip_8)">
          <path transform="matrix(0,.2415,-.2415,0,585.4855,162.0466)" d="M0 296.68019C22.128968 296.68019 44.288488 296.68019 66.47977 296.68019V312.71693C44.288248 312.71693 22.128968 312.71693 0 312.71693V296.68019ZM0 120.27574C22.128968 120.27574 44.288248 120.27574 66.47977 120.27574V104.23895C44.288248 104.23895 22.128968 104.23895 0 104.23895V120.27574ZM0 92.21139C22.128727 92.21139 44.288248 92.21139 66.47977 92.21139V76.17466C44.288248 76.17466 22.128968 76.17466 0 76.17466V92.21139ZM0 196.45041C22.130412 196.45041 44.290174 196.45041 66.47977 196.45041V184.42278C44.290174 184.42278 22.13041 184.42278 0 184.42278V196.45041ZM0 40.091917C22.130412 40.091917 44.290174 40.091917 66.47977 40.091917V28.064352C44.290174 28.064352 22.130654 28.064352 0 28.064352V40.091917ZM0 461.057C22.12993 461.057 44.289693 461.057 66.47977 461.057V449.02946C44.289693 449.02946 22.129929 449.02946 0 449.02946V461.057ZM0 72.165439C22.130412 72.165439 44.290174 72.165439 66.47977 72.165439V60.13787C44.290414 60.13787 22.130654 60.13787 0 60.13787V72.165439ZM0 152.34926C22.10106 152.34926 44.252405 152.34926 66.47977 152.34926V144.33087C44.28055 144.33087 22.114533 144.33087 0 144.33087V152.34926ZM0 20.045958C22.115256 20.045958 44.281515 20.045958 66.47977 20.045958V12.027562C44.281515 12.027562 22.115258 12.027562 0 12.027562V20.045958ZM0 477.0938C22.115256 477.0938 44.281515 477.0938 66.47977 477.0938V469.0754C44.281515 469.0754 22.115258 469.0754 0 469.0754V477.0938ZM0 248.56987C22.10106 248.56987 44.252405 248.56987 66.47977 248.56987V240.55149C44.28055 240.55149 22.114533 240.55149 0 240.55149V248.56987ZM0 416.95594C22.114775 416.95594 44.28079 416.95594 66.47977 416.95594V408.93754C44.28103 408.93754 22.115014 408.93754 0 408.93754V416.95594ZM0 212.48714C22.115256 212.48714 44.281515 212.48714 66.47977 212.48714V204.46874C44.281515 204.46874 22.115258 204.46874 0 204.46874V212.48714ZM0 380.87318C22.101542 380.87318 44.252645 380.87318 66.47977 380.87318V372.8548C44.28055 372.8548 22.114533 372.8548 0 372.8548V380.87318ZM0 356.81806C22.101542 356.81806 44.252645 356.81806 66.47977 356.81806V348.79966C44.280069 348.79966 22.114052 348.79966 0 348.79966V356.81806ZM0 500H66.47977V497.13975C44.33949 497.13975 22.169384 497.13975 0 497.13975V500ZM0 489.12138C22.168904 489.12138 44.338289 489.12138 66.47977 489.12138V485.11213C44.33949 485.11213 22.169625 485.11213 0 485.11213V489.12138ZM0 445.02024C22.168904 445.02024 44.338289 445.02024 66.47977 445.02024V441.01106C44.33925 441.01106 22.169384 441.01106 0 441.01106V445.02024ZM0 424.97428C22.168904 424.97428 44.338289 424.97428 66.47977 424.97428V420.9651C44.33949 420.9651 22.169384 420.9651 0 420.9651V424.97428ZM0 400.91914C22.168904 400.91914 44.338289 400.91914 66.47977 400.91914V396.90998C44.33949 396.90998 22.169625 396.90998 0 396.90998V400.91914ZM0 388.89158C22.169144 388.89158 44.338529 388.89158 66.47977 388.89158V384.88236C44.33973 384.88236 22.169625 384.88236 0 384.88236V388.89158ZM0 332.76289C22.169144 332.76289 44.338529 332.76289 66.47977 332.76289V328.7537C44.33973 328.7537 22.169625 328.7537 0 328.7537V332.76289ZM0 324.74449C22.168904 324.74449 44.338289 324.74449 66.47977 324.74449V320.73533C44.33949 320.73533 22.169625 320.73533 0 320.73533V324.74449ZM0 292.67097C22.168904 292.67097 44.338289 292.67097 66.47977 292.67097V288.6618C44.33949 288.6618 22.169625 288.6618 0 288.6618V292.67097ZM0 280.6434C22.168904 280.6434 44.338289 280.6434 66.47977 280.6434V276.63423C44.33949 276.63423 22.169625 276.63423 0 276.63423V280.6434ZM0 265.0967V268.61585C22.168904 268.61585 44.338289 268.61585 66.47977 268.61585V264.6066C44.33949 264.6066 22.169625 264.6066 0 264.6066V265.0967ZM0 256.58827C22.168904 256.58827 44.338289 256.58827 66.47977 256.58827V252.57904C44.33949 252.57904 22.169384 252.57904 0 252.57904V256.58827ZM0 224.5147C22.168904 224.5147 44.338289 224.5147 66.47977 224.5147V220.50553C44.33949 220.50553 22.169384 220.50553 0 220.50553V224.5147ZM0 176.7804V180.4136C22.168904 180.4136 44.338289 180.4136 66.47977 180.4136V176.40445C44.33949 176.40445 22.169384 176.40445 0 176.40445V176.7804ZM0 160.36766C22.168904 160.36766 44.338289 160.36766 66.47977 160.36766V156.35849C44.33949 156.35849 22.169625 156.35849 0 156.35849V160.36766ZM0 136.31253C22.169384 136.31253 44.33901 136.31253 66.47977 136.31253V132.3033C44.33997 132.3033 22.169865 132.3033 0 132.3033V136.31253ZM0 100.22978C22.169144 100.22978 44.338529 100.22978 66.47977 100.22978V96.22062C44.33997 96.22062 22.169865 96.22062 0 96.22062V100.22978ZM0 56.128705C22.168904 56.128705 44.338048 56.128705 66.47977 56.128705V52.119478C44.33925 52.119478 22.169384 52.119478 0 52.119478V56.128705ZM0 48.11031C22.169384 48.11031 44.338769 48.11031 66.47977 48.11031V44.10108C44.34021 44.10108 22.169865 44.10108 0 44.10108V48.11031ZM0 0V4.009167C22.168904 4.009167 44.338289 4.009167 66.47977 4.009167V0H0Z" fill="#ffffff" />
        </g>
        {eventName && (
          <g>
            <text fill="#0e0202" x="220" y="30" textAnchor="middle" fontSize={backEventFontSize} fontFamily="Space Mono" fontWeight="bold" className="bp-mono">{eventName}</text>
            {tagLine && (
              <text fill="#1f1f1f" x="220" y="180" textAnchor="middle" fontSize={backTagLineFontSize} fontFamily="Space Mono" fontWeight="bold" className="bp-mono" opacity="0.8">{tagLine}</text>
            )}
          </g>
        )}
        {/* Issue Date, User ID & Pass — above the CodeX logo in right stub */}
        {formattedIssueDate && (
          <g>
            <text fill="#ffffff" x="520" y={18} textAnchor="middle" fontSize={7.25} fontFamily="Space Mono" className="bp-mono" opacity="0.7">DATE OF ISSUE</text>
            <text fill="#02bed3" x="520" y={31} textAnchor="middle" fontSize={backDateValueFontSize} fontFamily="Space Mono" fontWeight="bold" className="bp-mono">{formattedIssueDate}</text>
          </g>
        )}
        {(userId || userPassword) && (
          <g>
            {userId && (
              <g>
                <text fill="#ffffff" x={userPassword ? 488 : 520} y={44} textAnchor="middle" fontSize={7.25} fontFamily="Space Mono" className="bp-mono" opacity="0.7">LOGIN ID</text>
                <text fill="#02bed3" x={userPassword ? 488 : 520} y={57} textAnchor="middle" fontSize={backLoginFontSize} fontFamily="Space Mono" fontWeight="bold" className="bp-mono">{userId}</text>
              </g>
            )}
            {userPassword && (
              <g>
                <text fill="#ffffff" x={userId ? 553 : 520} y={44} textAnchor="middle" fontSize={7.25} fontFamily="Space Mono" className="bp-mono" opacity="0.7">PASSWORD</text>
                <text fill="#02bed3" x={userId ? 553 : 520} y={57} textAnchor="middle" fontSize={backPasswordFontSize} fontFamily="Space Mono" fontWeight="bold" className="bp-mono">{userPassword}</text>
              </g>
            )}
          </g>
        )}
        {/* Large CodeX Hexagon Icon Centered in Right Stub on Back Side */}
        <image
          href={ASSETS?.IMAGES?.CODEX_LOGO_ICON || "/codex-logo-icon.svg"}
          x={478}
          y={62}
          width={85}
          height={85}
          preserveAspectRatio="xMidYMid meet"
        />
        <g clipPath="url(#bpb_clip_13)">
          <g>
            <g clipPath="url(#bpb_clip_14)">
              <g clipPath="url(#bpb_clip_15)">
                <path transform="matrix(.048970656,0,0,.048970656,67.87894,83.00089)" d="M407.1428 45.238134V90.4762H361.90473V45.238134H407.1428ZM542.85708 45.238134H497.619V90.4762H542.85708V45.238134ZM452.38093 90.4762H407.1428V135.71433H452.38093V90.4762ZM723.80947 90.4762V226.19046H859.5237V90.4762H723.80947ZM407.1428 135.71433H361.90473V180.9524H407.1428V135.71433ZM180.95233 226.19046H226.19046V90.4762H90.476139V226.19046H180.95233ZM407.1428 226.19046V271.4286H452.38093V226.19046H407.1428ZM0 316.66667V0H316.6666V316.66667H0ZM45.238069 271.4286H271.42854V45.238134H45.238069V271.4286ZM361.90473 316.66667H407.1428V271.4286H361.90473V316.66667ZM588.0952 271.4286V180.9524H542.85708V135.71433H497.619V180.9524H452.38093V226.19046H542.85708V316.66667H497.619V271.4286H452.38093V361.9048H588.0952V271.4286ZM90.476139 407.14286H180.95233V361.9048H0V407.14286H90.476139ZM633.33328 361.9048H588.0952V407.14286H633.33328V361.9048ZM723.80947 361.9048H678.5714V407.14286H723.80947V361.9048ZM859.5237 361.9048V407.14286H904.7617V361.9048H859.5237ZM588.09518 407.14286H542.857V452.38093H588.09518V407.14286ZM904.7617 452.38093H949.99966V407.14286H904.7617V452.38093ZM542.857 497.61906V452.38093H497.61894V497.61906H542.857ZM588.09518 452.38093V497.61906H678.57138V407.14286H633.3332V452.38093H588.0951 588.09518ZM859.5237 497.61906H814.28567V361.9048H769.0475V407.14286H723.80947V452.38093H769.0475V497.61906H723.80947V542.8571H859.5237V588.0952H904.7617V542.8572H949.99966V497.6191H904.7617V452.38099H859.5237V497.6191 497.61906ZM90.476139 588.0952V542.8572H45.238069V497.6191H0V588.0952H90.476139ZM678.5714 542.8572H723.80947V588.0952H814.28567V678.5714H859.5237V723.8096H769.0475V633.3334H678.57138V723.8096H588.09518V769.0476H542.857V723.8096H497.61894V678.5714H542.857V633.3334H497.61894V588.0952H407.14274V497.61909H90.476139V452.38096H226.19046V407.14289H271.42854V452.38096H316.6666V407.14289H271.42854V361.90483H407.1428V407.14289H361.90473V452.38096H407.1428V407.14289H497.619V452.38096H452.38093V497.61909H497.619V542.8572H542.85708V588.0952H678.5714V542.8572ZM633.33328 633.3334H588.0952V678.5714H633.33328V633.3334ZM271.42854 588.0952H316.6666V542.8572H271.42854V588.0952ZM361.90473 588.0952V633.3334H407.1428V588.0952H361.90473ZM316.6666 633.3334V950H0V633.3334H316.6666ZM271.42854 678.5714H45.238069V904.76187H271.42854V678.5714ZM904.7618 633.3334H859.5237V678.5714H904.7617V633.3334H904.7618ZM452.38093 678.5714V633.3334H407.1428V723.8096H361.90473V950H452.38093V904.76187H407.1428V814.28567H452.38093V769.0476H497.619V723.8096H452.38093V678.5714ZM90.476139 723.8096V859.5238H226.19046V723.8096H90.476139ZM904.7618 769.0476H949.9997V723.8096H904.7618V769.0476ZM769.0475 769.0476H723.80947V814.28567H814.28567V859.5238H769.0475V904.76187H859.5237V769.0476H769.0475ZM497.61897 859.5238H542.85708V814.28567H452.38093V859.5238H497.619 497.61897ZM588.09518 859.5238H633.33328V814.28567H588.0952V859.5238H588.09518ZM678.57138 859.5238V904.76187H723.80947V859.5238H678.5714 678.57138ZM497.61897 950H542.85708V904.76187H497.619V950H497.61897ZM588.09518 950H633.33328V904.76187H588.0952V950H588.09518ZM723.80947 950H769.0475V904.76187H723.80947V950ZM452.38093 0H407.1428V45.238134H452.38093V0ZM588.0952 0H542.85708V45.238134H588.0952V0ZM949.99978 0V316.66667H633.33328V0H949.99978ZM904.76187 45.238134H678.5714V271.4286H904.76187V45.238134Z" fill="#323232" />
              </g>
              <g clipPath="url(#bpb_clip_16)">
                <path transform="matrix(.054247708,0,0,.054247708,49.79495,62.53346)" d="M1268.97 192.14H1221.13V222.14H1268.97C1294.85 222.14 1315.9099 243.2 1315.9099 269.08V1282.8099C1315.9099 1308.69 1294.8499 1329.7499 1268.97 1329.7499H255.24C229.36 1329.7499 208.3 1308.6898 208.3 1282.8099V269.07C208.3 243.19 229.36 222.13 255.24 222.13H303.08003V192.13H255.24002C212.82003 192.13 178.30002 226.64 178.30002 269.07V1282.8C178.30002 1325.2201 212.81002 1359.74 255.24002 1359.74H1268.97C1311.39 1359.74 1345.9099 1325.23 1345.9099 1282.8V269.07C1345.9099 226.65001 1311.3999 192.13 1268.97 192.13V192.14Z" fill="#323232" />
                <path transform="matrix(.054247708,0,0,.054247708,49.79495,62.53346)" d="M453.4 248.21C442.00999 248.21 434.94999 243.58 432.19999 234.33L399.46998 240.22C406.02998 263.55 423.30998 275.22 451.28999 275.22 466.59999 275.22 478.96998 271.61003 488.38999 264.4 497.81 257.19 502.52 247.76999 502.52 236.15 502.52 228.79999 500.59 222.40999 496.72 217 492.85 211.58 488.03 207.76 482.25 205.52 476.47 203.29001 466.71 200.71 452.97 197.81 447.98 196.75 444.61003 195.63 442.87 194.45 441.13 193.27 440.26 191.62 440.26 189.48999 440.26 184.71999 444.1 182.34 451.79 182.34 461.04 182.34 467.19 186.18 470.21003 193.87L499.40003 185.04C491.88005 166.25 476.43003 156.85999 453.05003 156.85999 437.63 156.85999 425.80003 160.44998 417.59004 167.62999 409.37004 174.80998 405.26005 183.81999 405.26005 194.63999 405.26005 203.05998 408.12004 210.37999 413.84004 216.59998 419.56004 222.82997 432.49003 227.86998 452.63005 231.72998 457.90003 232.78998 461.56004 234.00998 463.61006 235.38999 465.66004 236.75998 466.68006 238.68999 466.68006 241.14998 466.68006 245.85999 462.25007 248.21999 453.39006 248.21999L453.4 248.21Z" fill="#323232" />
                <path transform="matrix(.054247708,0,0,.054247708,49.79495,62.53346)" d="M563.02 275.21C575.98007 275.21 586.9 271.44999 595.79006 263.94 604.68008 256.42 609.88009 245.63 611.4 231.55L579.18008 229.61C578.06008 242.29001 572.84 248.62 563.53 248.62 558.31008 248.62 554.26 246.37999 551.37008 241.89 548.48007 237.4 547.04006 228.91 547.04006 216.4 547.04006 194.07999 552.59 182.92 563.7 182.92 567.68 182.92 571.15 184.63 574.09 188.05 577.04006 191.47 578.51 197.02 578.51 204.71L611.4 202.94C610.33 189.03 605.72006 177.87 597.56 169.46 589.4 161.05 577.72 156.84001 562.52 156.84001 546.25 156.84001 533.58 162.36002 524.49 173.41 515.41 184.46 510.86 198.99 510.86 216.99 510.86 234.99 515.64999 249.41 525.25 259.73 534.84 270.05003 547.43 275.21003 563.02 275.21003V275.21Z" fill="#323232" />
                <path transform="matrix(.054247708,0,0,.054247708,49.79495,62.53346)" d="M648.39 250.81H679.15L685.64 273.44H721.61L685.58999 158.6H648.31997L612.86996 273.44H641.4899L648.37997 250.81H648.39ZM663.68 192.43 672.97 225.73999H654.38998L663.67996 192.43H663.68Z" fill="#323232" />
                <path transform="matrix(.054247708,0,0,.054247708,49.79495,62.53346)" d="M760.8 217.84C760.8 212.68 759.87 206.4 758.01998 199 762.11996 208.3 766.18997 216.20999 770.23 222.70999L801.68 273.44999H830.37V158.60999H801.68V192.59999C801.68 202.85999 802.58 212.9 804.37 222.71999 801.62 216.37999 797.58999 209.02999 792.26 200.68L765.5 158.62H732.19V273.46H760.79V217.84999L760.8 217.84Z" fill="#323232" />
                <path transform="matrix(.054247708,0,0,.054247708,49.79495,62.53346)" d="M919.89 191.34 941.97 273.45H964.35L985.59 191.34V273.45H1018.32V158.61H972.09L956.19 219.6 939.53 158.61H893.47V273.45H919.89V191.34Z" fill="#323232" />
                <path transform="matrix(.054247708,0,0,.054247708,49.79495,62.53346)" d="M1124.74 246.02H1072.92V227.26H1114.81V201.77H1072.92V185.11H1124.74V158.61H1038.34V273.45H1124.74V246.02Z" fill="#323232" />
              </g>
              <g>
                <g clipPath="url(#bpb_clip_17)">
                  <text xmlSpace="preserve" transform="matrix(.5349525 0 0 .5349525 35.83351 47.72368)" fontSize="21.33" fontFamily="Space Mono" fontWeight="bold"><tspan y="22" x="0 13.052872 26.105744 39.158617 52.211488 65.26436 78.31723 91.3701 104.42297 117.475849 130.52872 143.58159 156.63446 169.68733 182.7402">CONNECT WITH US</tspan></text>
                </g>
              </g>
              <image
                href={instagramQrCode}
                x="63.6"
                y="77.75"
                width="55"
                height="55"
                preserveAspectRatio="xMidYMid meet"
              />
              <text fill="#0e0202" xmlSpace="preserve" transform="matrix(.6046742 0 0 .6046742 65.27543 144.19951)" fontSize="14.66" fontFamily="Space Mono" fontWeight="bold"><tspan y="14" x="0 8.969666 17.939332 26.908997 35.878664 44.848329 53.817995 62.78766 71.757328">INSTAGRAM</tspan></text>
            </g>
          </g>
          <g>
            <g clipPath="url(#bpb_clip_18)">
              <g>
                <g clipPath="url(#bpb_clip_19)">
                  <text xmlSpace="preserve" transform="matrix(.52942797 0 0 .52942797 305 47.735464)" fontSize="21.33" fontFamily="Space Mono" fontWeight="bold"><tspan y="22" x="0 13.052872 26.105744 39.158617 52.211488 65.26436 78.31723 91.3701 104.42297 117.475849 130.52872 143.58159 156.63446 169.68733 182.7402 195.79308 208.84595 221.89882">CODEING WITH US</tspan></text>
                </g>
              </g>
              <g clipPath="url(#bpb_clip_20)">
                <path transform="matrix(.048464929,0,0,.048464929,331.23316,81.152729)" d="M407.1428 45.238134V90.4762H361.90473V45.238134H407.1428ZM542.85708 45.238134H497.619V90.4762H542.85708V45.238134ZM452.38093 90.4762H407.1428V135.71433H452.38093V90.4762ZM723.80947 90.4762V226.19046H859.5237V90.4762H723.80947ZM407.1428 135.71433H361.90473V180.9524H407.1428V135.71433ZM180.95233 226.19046H226.19046V90.4762H90.476139V226.19046H180.95233ZM407.1428 226.19046V271.4286H452.38093V226.19046H407.1428ZM0 316.66667V0H316.6666V316.66667H0ZM45.238069 271.4286H271.42854V45.238134H45.238069V271.4286ZM361.90473 316.66667H407.1428V271.4286H361.90473V316.66667ZM588.0952 271.4286V180.9524H542.85708V135.71433H497.619V180.9524H452.38093V226.19046H542.85708V316.66667H497.619V271.4286H452.38093V361.9048H588.0952V271.4286ZM90.476139 407.14286H180.95233V361.9048H0V407.14286H90.476139ZM633.33328 361.9048H588.0952V407.14286H633.33328V361.9048ZM723.80947 361.9048H678.5714V407.14286H723.80947V361.9048ZM859.5237 361.9048V407.14286H904.7617V361.9048H859.5237ZM588.09518 407.14286H542.857V452.38093H588.09518V407.14286ZM904.7617 452.38093H949.99966V407.14286H904.7617V452.38093ZM542.857 497.61906V452.38093H497.61894V497.61906H542.857ZM588.09518 452.38093V497.61906H678.57138V407.14286H633.3332V452.38093H588.0951 588.09518ZM859.5237 497.61906H814.28567V361.9048H769.0475V407.14286H723.80947V452.38093H769.0475V497.61906H723.80947V542.8571H859.5237V588.0952H904.7617V542.8572H949.99966V497.6191H904.7617V452.38099H859.5237V497.6191 497.61906ZM90.476139 588.0952V542.8572H45.238069V497.6191H0V588.0952H90.476139ZM678.5714 542.8572H723.80947V588.0952H814.28567V678.5714H859.5237V723.8096H769.0475V633.3334H678.57138V723.8096H588.09518V769.0476H542.857V723.8096H497.61894V678.5714H542.857V633.3334H497.61894V588.0952H407.14274V497.61909H90.476139V452.38096H226.19046V407.14289H271.42854V452.38096H316.6666V407.14289H271.42854V361.90483H407.1428V407.14289H361.90473V452.38096H407.1428V407.14289H497.619V452.38096H452.38093V497.61909H497.619V542.8572H542.85708V588.0952H678.5714V542.8572ZM633.33328 633.3334H588.0952V678.5714H633.33328V633.3334ZM271.42854 588.0952H316.6666V542.8572H271.42854V588.0952ZM361.90473 588.0952V633.3334H407.1428V588.0952H361.90473ZM316.6666 633.3334V950H0V633.3334H316.6666ZM271.42854 678.5714H45.238069V904.76187H271.42854V678.5714ZM904.7618 633.3334H859.5237V678.5714H904.7617V633.3334H904.7618ZM452.38093 678.5714V633.3334H407.1428V723.8096H361.90473V950H452.38093V904.76187H407.1428V814.28567H452.38093V769.0476H497.619V723.8096H452.38093V678.5714ZM90.476139 723.8096V859.5238H226.19046V723.8096H90.476139ZM904.7618 769.0476H949.9997V723.8096H904.7618V769.0476ZM769.0475 769.0476H723.80947V814.28567H814.28567V859.5238H769.0475V904.76187H859.5237V769.0476H769.0475ZM497.61897 859.5238H542.85708V814.28567H452.38093V859.5238H497.619 497.61897ZM588.09518 859.5238H633.33328V814.28567H588.0952V859.5238H588.09518ZM678.57138 859.5238V904.76187H723.80947V859.5238H678.5714 678.57138ZM497.61897 950H542.85708V904.76187H497.619V950H497.61897ZM588.09518 950H633.33328V904.76187H588.0952V950H588.09518ZM723.80947 950H769.0475V904.76187H723.80947V950ZM452.38093 0H407.1428V45.238134H452.38093V0ZM588.0952 0H542.85708V45.238134H588.0952V0ZM949.99978 0V316.66667H633.33328V0H949.99978ZM904.76187 45.238134H678.5714V271.4286H904.76187V45.238134Z" fill="#323232" />
              </g>
              <g clipPath="url(#bpb_clip_21)">
                <path transform="matrix(.05368748,0,0,.05368748,313.33589,60.896669)" d="M1268.97 192.14H1221.13V222.14H1268.97C1294.85 222.14 1315.9099 243.2 1315.9099 269.08V1282.8099C1315.9099 1308.69 1294.8499 1329.7499 1268.97 1329.7499H255.24C229.36 1329.7499 208.3 1308.6898 208.3 1282.8099V269.07C208.3 243.19 229.36 222.13 255.24 222.13H303.08003V192.13H255.24002C212.82003 192.13 178.30002 226.64 178.30002 269.07V1282.8C178.30002 1325.2201 212.81002 1359.74 255.24002 1359.74H1268.97C1311.39 1359.74 1345.9099 1325.23 1345.9099 1282.8V269.07C1345.9099 226.65001 1311.3999 192.13 1268.97 192.13V192.14Z" fill="#323232" />
                <path transform="matrix(.05368748,0,0,.05368748,313.33589,60.896669)" d="M453.4 248.21C442.00999 248.21 434.94999 243.58 432.19999 234.33L399.46998 240.22C406.02998 263.55 423.30998 275.22 451.28999 275.22 466.59999 275.22 478.96998 271.61003 488.38999 264.4 497.81 257.19 502.52 247.76999 502.52 236.15 502.52 228.79999 500.59 222.40999 496.72 217 492.85 211.58 488.03 207.76 482.25 205.52 476.47 203.29001 466.71 200.71 452.97 197.81 447.98 196.75 444.61003 195.63 442.87 194.45 441.13 193.27 440.26 191.62 440.26 189.48999 440.26 184.71999 444.1 182.34 451.79 182.34 461.04 182.34 467.19 186.18 470.21003 193.87L499.40003 185.04C491.88005 166.25 476.43003 156.85999 453.05003 156.85999 437.63 156.85999 425.80003 160.44998 417.59004 167.62999 409.37004 174.80998 405.26005 183.81999 405.26005 194.63999 405.26005 203.05998 408.12004 210.37999 413.84004 216.59998 419.56004 222.82997 432.49003 227.86998 452.63005 231.72998 457.90003 232.78998 461.56004 234.00998 463.61006 235.38999 465.66004 236.75998 466.68006 238.68999 466.68006 241.14998 466.68006 245.85999 462.25007 248.21999 453.39006 248.21999L453.4 248.21Z" fill="#323232" />
                <path transform="matrix(.05368748,0,0,.05368748,313.33589,60.896669)" d="M563.02 275.21C575.98007 275.21 586.9 271.44999 595.79006 263.94 604.68008 256.42 609.88009 245.63 611.4 231.55L579.18008 229.61C578.06008 242.29001 572.84 248.62 563.53 248.62 558.31008 248.62 554.26 246.37999 551.37008 241.89 548.48007 237.4 547.04006 228.91 547.04006 216.4 547.04006 194.07999 552.59 182.92 563.7 182.92 567.68 182.92 571.15 184.63 574.09 188.05 577.04006 191.47 578.51 197.02 578.51 204.71L611.4 202.94C610.33 189.03 605.72006 177.87 597.56 169.46 589.4 161.05 577.72 156.84001 562.52 156.84001 546.25 156.84001 533.58 162.36002 524.49 173.41 515.41 184.46 510.86 198.99 510.86 216.99 510.86 234.99 515.64999 249.41 525.25 259.73 534.84 270.05003 547.43 275.21003 563.02 275.21003V275.21Z" fill="#323232" />
                <path transform="matrix(.05368748,0,0,.05368748,313.33589,60.896669)" d="M648.39 250.81H679.15L685.64 273.44H721.61L685.58999 158.6H648.31997L612.86996 273.44H641.4899L648.37997 250.81H648.39ZM663.68 192.43 672.97 225.73999H654.38998L663.67996 192.43H663.68Z" fill="#323232" />
                <path transform="matrix(.05368748,0,0,.05368748,313.33589,60.896669)" d="M760.8 217.84C760.8 212.68 759.87 206.4 758.01998 199 762.11996 208.3 766.18997 216.20999 770.23 222.70999L801.68 273.44999H830.37V158.60999H801.68V192.59999C801.68 202.85999 802.58 212.9 804.37 222.71999 801.62 216.37999 797.58999 209.02999 792.26 200.68L765.5 158.62H732.19V273.46H760.79V217.84999L760.8 217.84Z" fill="#323232" />
                <path transform="matrix(.05368748,0,0,.05368748,313.33589,60.896669)" d="M919.89 191.34 941.97 273.45H964.35L985.59 191.34V273.45H1018.32V158.61H972.09L956.19 219.6 939.53 158.61H893.47V273.45H919.89V191.34Z" fill="#323232" />
                <path transform="matrix(.05368748,0,0,.05368748,313.33589,60.896669)" d="M1124.74 246.02H1072.92V227.26H1114.81V201.77H1072.92V185.11H1124.74V158.61H1038.34V273.45H1124.74V246.02Z" fill="#323232" />
              </g>
              <image
                href={githubQrCode}
                x="326.73"
                y="76.65"
                width="55"
                height="55"
                preserveAspectRatio="xMidYMid meet"
              />
              <text fill="#0e0202" xmlSpace="preserve" transform="matrix(.5984296 0 0 .5984296 334.83348 142.58139)" fontSize="16" fontFamily="Space Mono" fontWeight="bold"><tspan y="15" x="0 8.969666 17.939332 26.908997 35.878664 44.848329 53.817995">GITHUB</tspan></text>
            </g>
          </g>
          <path transform="matrix(.0000000013089968,.75,-.75,.0000000013089968,147.94573,48.86794)" d="M0 0H2V2H0M4 0H6V2H4M8 0H10V2H8M12 0H14V2H12M16 0H18V2H16M20 0H22V2H20M24 0H26V2H24M28 0H30V2H28M32 0H34V2H32M36 0H38V2H36M40 0H42V2H40M44 0H46V2H44M48 0H50V2H48M52 0H54V2H52M56 0H58V2H56M60 0H62V2H60M64 0H66V2H64M68 0H70V2H68M72 0H74V2H72M76 0H78V2H76M80 0H82V2H80M84 0H86V2H84M88 0H90V2H88M92 0H94V2H92M96 0H98V2H96M100 0H102V2H100M104 0H106V2H104M108 0H110V2H108M112 0H114V2H112M116 0H118V2H116M120 0H122V2H120M124 0H126V2H124M128 0H130V2H128M132 0H134V2H132M136 0H138V2H136M140 0H142V2H140" fill="#3f4f61" />
          <path transform="matrix(0,.75,-.75,0,285.59529,43.998575)" d="M.00000000000002842171 0H2V2H.00000000000002842171M4 0H6V2H4M8 0H10V2H8M12 0H14V2H12M16 0H18V2H16M20 0H22V2H20M24 0H26V2H24M28 0H30V2H28M32 0H34V2H32M36 0H38V2H36M40 0H42V2H40M44 0H46V2H44M48 0H50V2H48M52 0H54V2H52M56 0H58V2H56M60 0H62V2H60M64 0H66V2H64M68 0H70V2H68M72 0H74V2H72M76 0H78V2H76M80 0H82V2H80M84 0H86V2H84M88 0H90V2H88M92 0H94V2H92M96 0H98V2H96M100 0H102V2H100M104 0H106V2H104M108 0H110V2H108M112 0H114V2H112M116 0H118V2H116M120 0H122V2H120M124 0H126V2H124M128 0H130V2H128M132 0H134V2H132M136 0H138V2H136M140 0H142V2H140" fill="#3f4f61" />
          <g>
            <g clipPath="url(#bpb_clip_22)">
              <g>
                <g clipPath="url(#bpb_clip_23)">
                  <text xmlSpace="preserve" transform="matrix(.5115431 0 0 .5115431 160.5866 50.883085)" fontSize="21.33" fontFamily="Space Mono" fontWeight="bold"><tspan y="22" x="0"> </tspan></text>
                  <text xmlSpace="preserve" transform="matrix(.5115431 0 0 .5115431 160.5866 50.883085)" fontSize="22.33" fontFamily="Space Mono" fontWeight="bold"><tspan y="17" x="13.0625 26.115372 39.168245 52.221117 65.27399 78.32686 91.37973 104.4326 117.48547 130.53835 143.59122 156.64409 169.69696 182.74983 195.8027"> SHARE JOURNEY</tspan></text>
                </g>
              </g>
              <g clipPath="url(#bpb_clip_24)">
                <path transform="matrix(.046827709,0,0,.046827709,193.77928,85.33641)" d="M407.1428 45.238134V90.4762H361.90473V45.238134H407.1428ZM542.85708 45.238134H497.619V90.4762H542.85708V45.238134ZM452.38093 90.4762H407.1428V135.71433H452.38093V90.4762ZM723.80947 90.4762V226.19046H859.5237V90.4762H723.80947ZM407.1428 135.71433H361.90473V180.9524H407.1428V135.71433ZM180.95233 226.19046H226.19046V90.4762H90.476139V226.19046H180.95233ZM407.1428 226.19046V271.4286H452.38093V226.19046H407.1428ZM0 316.66667V0H316.6666V316.66667H0ZM45.238069 271.4286H271.42854V45.238134H45.238069V271.4286ZM361.90473 316.66667H407.1428V271.4286H361.90473V316.66667ZM588.0952 271.4286V180.9524H542.85708V135.71433H497.619V180.9524H452.38093V226.19046H542.85708V316.66667H497.619V271.4286H452.38093V361.9048H588.0952V271.4286ZM90.476139 407.14286H180.95233V361.9048H0V407.14286H90.476139ZM633.33328 361.9048H588.0952V407.14286H633.33328V361.9048ZM723.80947 361.9048H678.5714V407.14286H723.80947V361.9048ZM859.5237 361.9048V407.14286H904.7617V361.9048H859.5237ZM588.09518 407.14286H542.857V452.38093H588.09518V407.14286ZM904.7617 452.38093H949.99966V407.14286H904.7617V452.38093ZM542.857 497.61906V452.38093H497.61894V497.61906H542.857ZM588.09518 452.38093V497.61906H678.57138V407.14286H633.3332V452.38093H588.0951 588.09518ZM859.5237 497.61906H814.28567V361.9048H769.0475V407.14286H723.80947V452.38093H769.0475V497.61906H723.80947V542.8571H859.5237V588.0952H904.7617V542.8572H949.99966V497.6191H904.7617V452.38099H859.5237V497.6191 497.61906ZM90.476139 588.0952V542.8572H45.238069V497.6191H0V588.0952H90.476139ZM678.5714 542.8572H723.80947V588.0952H814.28567V678.5714H859.5237V723.8096H769.0475V633.3334H678.57138V723.8096H588.09518V769.0476H542.857V723.8096H497.61894V678.5714H542.857V633.3334H497.61894V588.0952H407.14274V497.61909H90.476139V452.38096H226.19046V407.14289H271.42854V452.38096H316.6666V407.14289H271.42854V361.90483H407.1428V407.14289H361.90473V452.38096H407.1428V407.14289H497.619V452.38096H452.38093V497.61909H497.619V542.8572H542.85708V588.0952H678.5714V542.8572ZM633.33328 633.3334H588.0952V678.5714H633.33328V633.3334ZM271.42854 588.0952H316.6666V542.8572H271.42854V588.0952ZM361.90473 588.0952V633.3334H407.1428V588.0952H361.90473ZM316.6666 633.3334V950H0V633.3334H316.6666ZM271.42854 678.5714H45.238069V904.76187H271.42854V678.5714ZM904.7618 633.3334H859.5237V678.5714H904.7617V633.3334H904.7618ZM452.38093 678.5714V633.3334H407.1428V723.8096H361.90473V950H452.38093V904.76187H407.1428V814.28567H452.38093V769.0476H497.619V723.8096H452.38093V678.5714ZM90.476139 723.8096V859.5238H226.19046V723.8096H90.476139ZM904.7618 769.0476H949.9997V723.8096H904.7618V769.0476ZM769.0475 769.0476H723.80947V814.28567H814.28567V859.5238H769.0475V904.76187H859.5237V769.0476H769.0475ZM497.61897 859.5238H542.85708V814.28567H452.38093V859.5238H497.619 497.61897ZM588.09518 859.5238H633.33328V814.28567H588.0952V859.5238H588.09518ZM678.57138 859.5238V904.76187H723.80947V859.5238H678.5714 678.57138ZM497.61897 950H542.85708V904.76187H497.619V950H497.61897ZM588.09518 950H633.33328V904.76187H588.0952V950H588.09518ZM723.80947 950H769.0475V904.76187H723.80947V950ZM452.38093 0H407.1428V45.238134H452.38093V0ZM588.0952 0H542.85708V45.238134H588.0952V0ZM949.99978 0V316.66667H633.33328V0H949.99978ZM904.76187 45.238134H678.5714V271.4286H904.76187V45.238134Z" fill="#323232" />
              </g>
            </g>
            <g clipPath="url(#bpb_clip_25)">
              <path transform="matrix(.05187384,0,0,.05187384,176.48667,65.76462)" d="M1268.97 192.14H1221.13V222.14H1268.97C1294.85 222.14 1315.9099 243.2 1315.9099 269.08V1282.8099C1315.9099 1308.69 1294.8499 1329.7499 1268.97 1329.7499H255.24C229.36 1329.7499 208.3 1308.6898 208.3 1282.8099V269.07C208.3 243.19 229.36 222.13 255.24 222.13H303.08003V192.13H255.24002C212.82003 192.13 178.30002 226.64 178.30002 269.07V1282.8C178.30002 1325.2201 212.81002 1359.74 255.24002 1359.74H1268.97C1311.39 1359.74 1345.9099 1325.23 1345.9099 1282.8V269.07C1345.9099 226.65001 1311.3999 192.13 1268.97 192.13V192.14Z" fill="#323232" />
              <path transform="matrix(.05187384,0,0,.05187384,176.48667,65.76462)" d="M453.4 248.21C442.00999 248.21 434.94999 243.58 432.19999 234.33L399.46998 240.22C406.02998 263.55 423.30998 275.22 451.28999 275.22 466.59999 275.22 478.96998 271.61003 488.38999 264.4 497.81 257.19 502.52 247.76999 502.52 236.15 502.52 228.79999 500.59 222.40999 496.72 217 492.85 211.58 488.03 207.76 482.25 205.52 476.47 203.29001 466.71 200.71 452.97 197.81 447.98 196.75 444.61003 195.63 442.87 194.45 441.13 193.27 440.26 191.62 440.26 189.48999 440.26 184.71999 444.1 182.34 451.79 182.34 461.04 182.34 467.19 186.18 470.21003 193.87L499.40003 185.04C491.88005 166.25 476.43003 156.85999 453.05003 156.85999 437.63 156.85999 425.80003 160.44998 417.59004 167.62999 409.37004 174.80998 405.26005 183.81999 405.26005 194.63999 405.26005 203.05998 408.12004 210.37999 413.84004 216.59998 419.56004 222.82997 432.49003 227.86998 452.63005 231.72998 457.90003 232.78998 461.56004 234.00998 463.61006 235.38999 465.66004 236.75998 466.68006 238.68999 466.68006 241.14998 466.68006 245.85999 462.25007 248.21999 453.39006 248.21999L453.4 248.21Z" fill="#323232" />
              <path transform="matrix(.05187384,0,0,.05187384,176.48667,65.76462)" d="M563.02 275.21C575.98007 275.21 586.9 271.44999 595.79006 263.94 604.68008 256.42 609.88009 245.63 611.4 231.55L579.18008 229.61C578.06008 242.29001 572.84 248.62 563.53 248.62 558.31008 248.62 554.26 246.37999 551.37008 241.89 548.48007 237.4 547.04006 228.91 547.04006 216.4 547.04006 194.07999 552.59 182.92 563.7 182.92 567.68 182.92 571.15 184.63 574.09 188.05 577.04006 191.47 578.51 197.02 578.51 204.71L611.4 202.94C610.33 189.03 605.72006 177.87 597.56 169.46 589.4 161.05 577.72 156.84001 562.52 156.84001 546.25 156.84001 533.58 162.36002 524.49 173.41 515.41 184.46 510.86 198.99 510.86 216.99 510.86 234.99 515.64999 249.41 525.25 259.73 534.84 270.05003 547.43 275.21003 563.02 275.21003V275.21Z" fill="#323232" />
              <path transform="matrix(.05187384,0,0,.05187384,176.48667,65.76462)" d="M648.39 250.81H679.15L685.64 273.44H721.61L685.58999 158.6H648.31997L612.86996 273.44H641.4899L648.37997 250.81H648.39ZM663.68 192.43 672.97 225.73999H654.38998L663.67996 192.43H663.68Z" fill="#323232" />
              <path transform="matrix(.05187384,0,0,.05187384,176.48667,65.76462)" d="M760.8 217.84C760.8 212.68 759.87 206.4 758.01998 199 762.11996 208.3 766.18997 216.20999 770.23 222.70999L801.68 273.44999H830.37V158.60999H801.68V192.59999C801.68 202.85999 802.58 212.9 804.37 222.71999 801.62 216.37999 797.58999 209.02999 792.26 200.68L765.5 158.62H732.19V273.46H760.79V217.84999L760.8 217.84Z" fill="#323232" />
              <path transform="matrix(.05187384,0,0,.05187384,176.48667,65.76462)" d="M919.89 191.34 941.97 273.45H964.35L985.59 191.34V273.45H1018.32V158.61H972.09L956.19 219.6 939.53 158.61H893.47V273.45H919.89V191.34Z" fill="#323232" />
              <path transform="matrix(.05187384,0,0,.05187384,176.48667,65.76462)" d="M1124.74 246.02H1072.92V227.26H1114.81V201.77H1072.92V185.11H1124.74V158.61H1038.34V273.45H1124.74V246.02Z" fill="#323232" />
            </g>
            <image
              href={linkedinQrCode}
              x="188.53"
              y="80.09"
              width="55"
              height="55"
              preserveAspectRatio="xMidYMid meet"
            />
            <text fill="#0e0202" xmlSpace="preserve" transform="matrix(.57821378 0 0 .57821378 197.25797 144.68991)" fontSize="16" fontFamily="Space Mono" fontWeight="bold"><tspan y="14" x="0 8.969666 17.939332 26.908997 35.878664 44.848329 53.817995">LINKEDIN</tspan></text>
          </g>
        </g>
        <g opacity=".15">
          <g clipPath="url(#bpb_clip_31)">
            <g clipPath="url(#bpb_clip_32)">
              <path transform="matrix(.406071,0,0,.406071,-186.77059,-5.8540794)" d="M502 502H0V0H502V502ZM2 500H500V2H2V500ZM501 458.33H1V460.33H501V458.33ZM501 416.67H1V418.67H501V416.67ZM501 375H1V377H501V375ZM501 333.33H1V335.33H501V333.33ZM501 291.67H1V293.67H501V291.67ZM501 250H1V252H501V250ZM501 208.33H1V210.33H501V208.33ZM501 166.67H1V168.67H501V166.67ZM501 125H1V127H501V125ZM501 83.33H1V85.33H501V83.33ZM501 41.67H1V43.67H501V41.67ZM460.33 1H458.33V501H460.33V1ZM418.67 1H416.67V501H418.67V1ZM377 1H375V501H377V1ZM335.33 1H333.33V501H335.33V1ZM293.67 1H291.67V501H293.67V1ZM252 1H250V501H252V1ZM210.33 1H208.33V501H210.33V1ZM168.67 1H166.67V501H168.67V1ZM127 1H125V501H127V1ZM85.33 1H83.33V501H85.33V1ZM43.67 1H41.67V501H43.67V1Z" fill="#2fb7c4" />
            </g>
          </g>
        </g>
      </g>
      <path transform="matrix(1,0,0,-1,0,205.92)" d="M-175.05905-9.9437899H25.531418V240.7943H-175.05905Z" fillOpacity="0" />
      <path transform="matrix(1,0,0,-1,0,205.92)" d="M-390.62464 8.326401H-186.77056V212.18048H-390.62464Z" fillOpacity="0" />
      <path transform="matrix(1,0,0,-1,0,205.92)" d="M-186.77057 7.920004H17.083512V211.77408H-186.77057Z" fillOpacity="0" />
      <path transform="matrix(1,0,0,-1,0,205.92)" d="M59.46732 69.59878H122.81496V134.90563H59.46732Z" fillOpacity="0" />
      <path transform="matrix(1,0,0,-1,0,205.92)" d="M67.878948 76.394718H114.403339V122.91911H67.878948Z" fillOpacity="0" />
      <path transform="matrix(1,0,0,-1,0,205.92)" d="M146.44876 50.51387H147.94876V157.05509H146.44876Z" fillOpacity="0" />
      <path transform="matrix(1,0,0,-1,0,205.92)" d="M185.73577 69.596569H246.31133V132.0456H185.73577Z" fillOpacity="0" />
      <path transform="matrix(1,0,0,-1,0,205.92)" d="M193.7793 76.09511H238.26779V120.5836H193.7793Z" fillOpacity="0" />
      <path transform="matrix(1,0,0,-1,0,205.92)" d="M284.09834 55.383237H285.59834V161.92446H284.09834Z" fillOpacity="0" />
      <path transform="matrix(1,0,0,-1,0,205.92)" d="M322.90843 71.99759H385.60188V136.63H322.90843Z" fillOpacity="0" />
      <path transform="matrix(1,0,0,-1,0,205.92)" d="M331.23316 78.723339H377.27708V124.76726H331.23316Z" fillOpacity="0" />
      <path transform="matrix(1,0,0,-1,0,205.92)" d="M423.01243-31.226395H623.6029V219.51169H423.01243Z" fillOpacity="0" />
      <path transform="matrix(1,0,0,-1,0,205.92)" d="M431.26243 5.196162H635.1165V209.05025H431.26243Z" fillOpacity="0" />
      <path transform="matrix(1,0,0,-1,0,205.92)" d="M635.1165 4.7897655H838.9706V208.64385H635.1165Z" fillOpacity="0" />
      <path transform="matrix(1,0,0,-1,0,205.92)" d="M464.7373 27.720004H585.4879V43.96645H464.7373Z" fillOpacity="0" />
    </svg>
  );
});

CodexBoardingPassBackSVG.displayName = "CodexBoardingPassBackSVG";



/**
 * CodexBoardingPassSVG
 * Unified universal renderer for both Front and Back sides of the CodeX Boarding Pass.
 */
const CodexBoardingPassSVG = memo(({
  side = "front",
  boardingPass = {},
  id,
  className = "",
  style = {},
  ...props
}) => {
  if (side === "back") {
    return (
      <CodexBoardingPassBackSVG
        boardingPass={boardingPass}
        id={id || "codex-boarding-pass-back-svg"}
        className={className}
        style={style}
        {...props}
      />
    );
  }

  return (
    <CodexBoardingPassFrontSVG
      boardingPass={boardingPass}
      id={id || "codex-boarding-pass-front-svg"}
      className={className}
      style={style}
      {...props}
    />
  );
});

CodexBoardingPassSVG.displayName = "CodexBoardingPassSVG";

export { CodexBoardingPassFrontSVG, CodexBoardingPassBackSVG, CodexBoardingPassSVG };
export default CodexBoardingPassSVG;
