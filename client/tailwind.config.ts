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
			boxShadow: {
				"workos-shadow-1":
					"0px 1.5px 2px 0px rgba(5, 5, 88, 0.024) inset, 0px 1.5px 2px 0px rgba(0, 0, 0, 0.024) inset",
			},
			colors: {
				workos: {
					neutral: {
						alpha: {
							6: "hsla(240, 95%, 9%, 0.13)",
						},
					},
					gray: {
						7: "hsla(233, 10%, 84%, 1)",
						11: "hsla(236, 11%, 88%, 1)", // table border
						12: "hsla(210, 16%, 20%, 1)",
						13: "hsla(240, 20%, 98%, 1)", // table header bg
						a3: "hsla(240, 100%, 12%, 0.05)",
						a5: "hsla(240, 100%, 9%, 0.11)",
						a8: "hsla(230, 100%, 9%, 0.28)",
						a9: "hsla(232, 100%, 6%, 0.46)",
						a11: "hsla(218, 100%, 4%, 0.62)",
					},
					purple: {
						a3: "hsla(236, 100%, 47%, 0.06)",
						9: "hsla(240, 78%, 66%, 1)",
						10: "hsl(240, 55%, 56%)",
					},
					red: {
						surface: "hsla(0, 100%, 98%, 0.8)",
						a3: "color(display-p3 0.804 0.008 0.11/0.079)",
						a7: "hsla(348, 100%, 39%, 0.31)",
						a11: "hsla(345, 100%, 38%, 0.86)",
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
