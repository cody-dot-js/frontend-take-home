import { Slot } from "@radix-ui/react-slot";
import { cx } from "~/util/cx";
import type { ComponentProps } from "react";

type Props = Exclude<ComponentProps<"div">, "children"> & { asChild?: boolean };

const skeletonClassNames = (className: string | undefined) =>
	cx("h-4 animate-pulse rounded-md bg-gray-300/25", className);

/**
 * A skeleton is a placeholder for content that is loading.
 * By using a skeleton, you can give the user an idea of what the content will
 * look like and reduce the perceived loading time and CLS (Cumulative Layout Shift).
 *
 * @note Default height is 1rem.
 */
function Skeleton({ asChild = false, className, ...props }: Props) {
	const Component = asChild ? Slot : "div";

	return <Component className={skeletonClassNames(className)} {...props} />;
}

export {
	//,
	Skeleton,
	skeletonClassNames,
};
