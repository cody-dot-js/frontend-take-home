import { cx } from "~/util/cx";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ComponentProps, type HTMLAttributes } from "react";

const alertVariants = cva("relative flex w-full gap-1.5 rounded-md border p-2.5 text-sm", {
	variants: {
		/**
		 * The priority of the Alert. Indicates the importance or impact level of the Alert,
		 * affecting its color and styling to communicate its purpose to the user.
		 * @default "default"
		 */
		priority: {
			danger: "border-red-500/50 bg-red-500/10 text-red-700",
			default: "border-gray-500/50 bg-gray-500/10 text-gray-700",
			info: "border-purple-500/50 bg-purple-500/10 text-purple-700",
			success: "border-green-500/50 bg-green-500/10 text-green-700",
			warning: "border-amber-500/50 bg-amber-500/10 text-amber-700",
		},
	},
	defaultVariants: {
		priority: "default",
	},
});

type AlertVariants = VariantProps<typeof alertVariants>;

/**
 * Displays a callout for user attention.
 */
const Alert = forwardRef<HTMLDivElement, ComponentProps<"div"> & AlertVariants>(
	({ className, priority = "default", ...props }, ref) => (
		<div ref={ref} className={cx(alertVariants({ priority }), className)} {...props} />
	),
);
Alert.displayName = "Alert";

/**
 * The container for the content slot of an alert. Place the title and description as direct children.
 */
const AlertContent = forwardRef<HTMLDivElement, ComponentProps<"div">>(({ className, ...props }, ref) => (
	<div ref={ref} className={cx("min-w-0 flex-1", className)} {...props} />
));
AlertContent.displayName = "AlertContent";

/**
 * The title of an alert.
 */
const AlertTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
	({ className, ...props }, ref) => <h5 ref={ref} className={cx("font-medium", className)} {...props} />,
);
AlertTitle.displayName = "AlertTitle";

/**
 * The description of an alert.
 */
const AlertDescription = forwardRef<HTMLParagraphElement, ComponentProps<"div">>(({ className, ...props }, ref) => (
	<div ref={ref} className={cx("text-sm", className)} {...props} />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertContent, AlertTitle, AlertDescription };
