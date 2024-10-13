import { Link, type LinkProps } from "@remix-run/react";
import { cx } from "~/util/cx";

const anchorClassNames = (className?: string | undefined) =>
	cx(
		"text-blue-600 focus-visible:ring-blue-600/20 cursor-pointer rounded bg-transparent hover:underline focus:outline-none focus-visible:ring",
		className,
	);

/**
 * Remix Link styled to look like a typical anchor tag (text color, underline, hover, etc.)
 * (useful because of tailwind preflight styles)
 */
const StyledLink = ({ className, ...props }: LinkProps) => <Link className={anchorClassNames(className)} {...props} />;

export {
	//,
	StyledLink,
	anchorClassNames,
};
