import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin.js";

export default {
	content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			cursor: {
				inherit: "inherit",
				initial: "initial",
			},
			data: {
				"active-item": "active-item",
				"drag-over": 'drag-over="true"',
				disabled: "disabled",
				highlighted: "highlighted",
				"orientation-horizontal": 'orientation="horizontal"',
				"orientation-vertical": 'orientation="vertical"',
				"side-bottom": 'side="bottom"',
				"side-left": 'side="left"',
				"side-right": 'side="right"',
				"side-top": 'side="top"',
				"state-active": 'state~="active"',
				"state-checked": 'state~="checked"',
				"state-closed": 'state~="closed"',
				"state-idle": 'state~="idle"',
				"state-inactive": 'state~="inactive"',
				"state-indeterminate": 'state~="indeterminate"',
				"state-open": 'state~="open"',
				"state-pending": 'state~="pending"',
				"state-selected": 'state~="selected"',
				"state-submitting": 'state~="submitting"',
				"state-unchecked": 'state~="unchecked"',
				"validation-error": 'validation="error"',
				"validation-success": 'validation="success"',
				"validation-warning": 'validation="warning"',
			},
			fontFamily: {
				sans: [
					'"Inter"',
					"ui-sans-serif",
					"system-ui",
					"sans-serif",
					'"Apple Color Emoji"',
					'"Segoe UI Emoji"',
					'"Segoe UI Symbol"',
					'"Noto Color Emoji"',
				],
			},
			colors: {
				workos: {
					neutral: {
						alpha: {
							6: "hsla(240, 95%, 9%, 0.13)",
						},
					},
					gray: {
						a11: "hsla(218, 100%, 4%, 0.62)",
						11: "#dddde3",
						// 12: "#f9f9fb",
						12: "hsla(210, 16%, 20%, 1)",
					},
					purple: {
						9: "#6565ec",
					},
				},
			},
		},
	},
	plugins: [
		plugin(function ({ addVariant }) {
			addVariant("not-disabled", ["&:not(:disabled)"]);
		}),
	],
} satisfies Config;
