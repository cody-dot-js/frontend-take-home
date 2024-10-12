import { cx } from "~/util/cx";
import { forwardRef, type ComponentProps } from "react";

/**
 * A wrapper around the native `input` element. For saving time, it will only support the "md" size, ignoring disabled visual states.
 */
const Input = forwardRef<HTMLInputElement, ComponentProps<"input">>(({ className, ...props }, ref) => (
	<input
		//
		ref={ref}
		className={cx(
			"border-workos-gray-a5 text-workos-gray-a9 ring-workos-purple-9/20 shadow-workos-shadow-1 block h-8 w-full rounded-[0.25rem] border text-sm font-medium focus:outline-none focus-visible:ring-4",
			className,
		)}
		{...props}
	/>
));
Input.displayName = "Input";

const InputIcon = forwardRef<HTMLDivElement, ComponentProps<"div">>(({ className, ...props }, ref) => (
	<div
		aria-hidden
		className={cx(
			"text-workos-gray-a11 pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2",
			className,
		)}
		ref={ref}
		{...props}
	/>
));
InputIcon.displayName = "InputIcon";

export {
	//,
	Input,
	InputIcon,
};
