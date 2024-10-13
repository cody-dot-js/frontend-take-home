import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cx } from "~/util/cx";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ElementRef } from "react";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

type DropdownMenuContentProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> & {
	/**
	 * Whether the DropdownMenuContent should match the width of the trigger or use the intrinsic content width.
	 */
	width?: "trigger" | "content";
};

const DropdownMenuContent = forwardRef<ElementRef<typeof DropdownMenuPrimitive.Content>, DropdownMenuContentProps>(
	({ className, loop = true, width, ...props }, ref) => (
		<DropdownMenuPortal>
			<DropdownMenuPrimitive.Content
				ref={ref}
				className={cx(
					"shadow-workos-popover text-workos-gray-12 z-50 min-w-[9rem] overflow-hidden rounded-lg bg-white p-1 text-sm outline-none",
					"data-side-bottom:slide-in-from-top-2 data-side-left:slide-in-from-right-2 data-side-right:slide-in-from-left-2 data-side-top:slide-in-from-bottom-2 data-state-closed:animate-out data-state-closed:fade-out-0 data-state-closed:zoom-out-95 data-state-open:animate-in data-state-open:fade-in-0 data-state-open:zoom-in-95",
					"my-1.5 max-h-[calc(var(--radix-dropdown-menu-content-available-height)_-_16px)] overflow-auto",
					width === "trigger" && "w-[var(--radix-dropdown-menu-trigger-width)]",
					className,
				)}
				loop={loop}
				{...props}
			/>
		</DropdownMenuPortal>
	),
);
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = forwardRef<
	ElementRef<typeof DropdownMenuPrimitive.Item>,
	ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
		inset?: boolean;
	}
>(({ className, inset, ...props }, ref) => (
	<DropdownMenuPrimitive.Item
		ref={ref}
		className={cx(
			"relative flex cursor-pointer select-none items-center rounded px-3 py-1.5 text-sm font-normal outline-none transition-colors",
			"focus:bg-workos-purple-9 focus:text-white",
			"data-disabled:pointer-events-none data-disabled:opacity-50",
			"[&>svg]:size-6 [&>svg]:sm:size-5 [&_svg]:shrink-0",
			inset && "pl-8",
			className,
		)}
		{...props}
	/>
));
DropdownMenuItem.displayName = "DropdownMenuItem";

export {
	//,
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
};
