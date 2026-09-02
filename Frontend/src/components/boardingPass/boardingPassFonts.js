/**
 * Embedded Web Fonts for Codex Boarding Pass SVGs
 * Space Mono bold and regular styles
 */
import spaceMonoRegular from "@fontsource/space-mono/files/space-mono-latin-400-normal.woff2";
import spaceMonoBold from "@fontsource/space-mono/files/space-mono-latin-700-normal.woff2";

export const BOARDING_PASS_FONTS_CSS = `
@font-face {
	font-family: 'Space Mono';
	font-style: normal;
	font-weight: 400;
	font-display: block;
	src: url('${spaceMonoRegular}') format('woff2');
}
@font-face {
	font-family: 'Space Mono';
	font-style: normal;
	font-weight: 700;
	font-display: block;
	src: url('${spaceMonoBold}') format('woff2');
}
`;
