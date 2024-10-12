import { Slot } from "@radix-ui/react-slot";
import { cx } from "~/util/cx";
import { cva, type VariantProps } from "class-variance-authority";
import { Children, cloneElement, forwardRef, isValidElement, type ComponentProps } from "react";
import invariant from "tiny-invariant";

const buttonVariants = cva(
	"inline-flex font-medium cursor-pointer border items-center justify-center gap-2 whitespace-nowrap focus:outline-none focus-visible:ring-4 disabled:cursor-default ",
	{
		variants: {
			appearance: {
				filled:
					"bg-workos-purple-9 border-workos-purple-a3 text-white ring-workos-purple-9/20 hover:bg-workos-purple-10 active:bg-workos-purple-10 active:saturate-[1.1] active:brightness-[0.92]",
				outlined:
					"bg-white border-workos-gray-7 disabled:bg-workos-gray-a3 disabled:border-workos-gray-a3 disabled:text-workos-gray-a8 ring-workos-purple-9/20",
			},
			priority: {
				danger: "",
				default: "",
				neutral: "",
			},
			size: {
				sm: "rounded-[0.1875rem] h-6 px-2 text-xs",
				md: "rounded-[0.25rem] h-8 px-3 text-sm",
			},
			isLoading: {
				false: "",
				true: "opacity-50",
			},
		},
		defaultVariants: {
			isLoading: false,
			size: "md",
			priority: "default",
			appearance: "outlined",
		},
		compoundVariants: [
			{
				appearance: "outlined",
				priority: "danger",
				class:
					"border-workos-red-a7 bg-workos-red-surface text-workos-red-a11 focus-visible:ring-workos-red-a3 active:bg-workos-red-a3",
			},
		],
	},
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

type ButtonProps = ComponentProps<"button"> &
	ButtonVariants &
	(
		| {
				asChild: true;
				type?: ComponentProps<"button">["type"];
		  }
		| {
				asChild?: false | undefined;
				type: Exclude<ComponentProps<"button">["type"], undefined>;
		  }
	);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			"aria-disabled": _ariaDisabled,
			appearance = "outlined",
			asChild,
			children,
			className,
			disabled: _disabled,
			isLoading = false,
			priority = "default",
			size = "md",
			type,
			...props
		},
		ref,
	) => {
		const disabled = parseBooleanish(_ariaDisabled ?? _disabled ?? isLoading);

		const buttonProps = {
			"aria-disabled": disabled,
			className: cx(buttonVariants({ appearance, isLoading, priority, size }), className),
			"data-loading": isLoading,
			disabled,
			ref,
			...props,
		};

		if (asChild) {
			const singleChild = Children.only(children);
			invariant(
				isValidElement<ButtonProps>(singleChild),
				"When using `asChild`, Button must be passed a single child as a JSX tag.",
			);
			const grandchildren = singleChild.props?.children;

			return <Slot {...buttonProps}>{cloneElement(singleChild, {}, grandchildren)}</Slot>;
		}

		return (
			<button {...buttonProps} type={type}>
				{children}
			</button>
		);
	},
);

export {
	//,
	Button,
};

type Booleanish = boolean | "true" | "false";

/**
 * Parse/coerce a booleanish value (boolean | "true" | "false") into a boolean.
 * @default false if the value is not a boolean or "true"
 */
function parseBooleanish(value: Booleanish | (string & {}) | undefined | null): boolean {
	if (typeof value === "boolean") {
		return value;
	} else {
		return value === "true";
	}
}
