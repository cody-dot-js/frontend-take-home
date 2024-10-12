import {
	Content as TabsPrimitiveContent,
	List as TabsPrimitiveList,
	Root as TabsPrimitiveRoot,
	Trigger as TabsPrimitiveTrigger,
} from "@radix-ui/react-tabs";
import { cx } from "~/util/cx.js";
import clsx from "clsx";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ElementRef } from "react";

type TabsProps = Omit<ComponentPropsWithoutRef<typeof TabsPrimitiveRoot>, "orientation">;

/**
 * A Tabs component. To save on time, only supports horizontal orientation.
 */
const Tabs = forwardRef<ElementRef<typeof TabsPrimitiveRoot>, TabsProps>(({ className, children, ...props }, ref) => (
	<TabsPrimitiveRoot className={cx("flex flex-col gap-6", className)} orientation="horizontal" ref={ref} {...props}>
		{children}
	</TabsPrimitiveRoot>
));
Tabs.displayName = "Tabs";

/**
 * A list of tab triggers. To save on time, only supports horizontal orientation.
 */
const TabsList = forwardRef<ElementRef<typeof TabsPrimitiveList>, ComponentPropsWithoutRef<typeof TabsPrimitiveList>>(
	({ className, ...props }, ref) => (
		<TabsPrimitiveList
			aria-orientation="horizontal"
			className={cx("border-workos-neutral-alpha-6 flex flex-row items-center border-b", className)}
			ref={ref}
			{...props}
		/>
	),
);
TabsList.displayName = "TabsList";

/**
 * A tab trigger (button), the clickable part of a tab.
 */
const TabsTrigger = forwardRef<
	ElementRef<typeof TabsPrimitiveTrigger>,
	ComponentPropsWithoutRef<typeof TabsPrimitiveTrigger>
>(({ children, className, ...props }, ref) => (
	<TabsPrimitiveTrigger
		className={cx(
			"group/tab-trigger",
			"relative flex cursor-pointer items-center gap-1 whitespace-nowrap",
			"text-workos-gray-a11 px-4 py-2.5 text-sm font-normal",
			"rounded-tl-lg rounded-tr-lg",
			"ring-focus-accent outline-none",
			"disabled:cursor-default disabled:opacity-50",
			"focus-visible:ring-4",
			"not-disabled:hover:font-medium not-disabled:hover:text-workos-gray-12",
			"data-state-active:font-medium data-state-active:text-workos-gray-12",
			className,
		)}
		ref={ref}
		{...props}
	>
		<span
			aria-hidden
			className={clsx(
				"z-1 group-data-state-active/tab-trigger:bg-purple-500 absolute",
				"-bottom-px left-0 right-0 h-0.5",
			)}
		/>
		{children}
	</TabsPrimitiveTrigger>
));
TabsTrigger.displayName = "TabsTrigger";

/**
 * The content of a tab.
 */
const TabsContent = forwardRef<
	ElementRef<typeof TabsPrimitiveContent>,
	ComponentPropsWithoutRef<typeof TabsPrimitiveContent>
>(({ className, ...props }, ref) => (
	<TabsPrimitiveContent
		ref={ref}
		className={cx("focus-visible:ring-focus-accent outline-none focus-visible:ring-4", className)}
		{...props}
	/>
));
TabsContent.displayName = "TabsContent";

export {
	//,
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
};
