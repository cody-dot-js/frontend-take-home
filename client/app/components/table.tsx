import { cx } from "~/util/cx.js";
import { forwardRef } from "react";
import type { ComponentProps, HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";

const Table = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(({ className, ...props }, ref) => (
	<table
		ref={ref}
		className={cx("relative w-full caption-bottom overflow-auto text-sm text-[#2b333b]", className)}
		{...props}
	/>
));
Table.displayName = "Table";

const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
	({ className, ...props }, ref) => (
		<thead ref={ref} className={cx("bg-workos-gray-13 [&_tr]:border-b", className)} {...props} />
	),
);
TableHeader.displayName = "TableHeader";

const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
	({ className, ...props }, ref) => (
		<tbody ref={ref} className={cx("[&_tr:last-child]:border-0", className)} {...props} />
	),
);
TableBody.displayName = "TableBody";

const TableFooter = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
	({ className, ...props }, ref) => (
		<tfoot
			ref={ref}
			className={cx("border-workos-gray-11 border-t bg-white font-medium [&>tr]:last:border-b-0", className)}
			{...props}
		/>
	),
);
TableFooter.displayName = "TableFooter";

type TableRowProps = ComponentProps<"tr"> & {
	withoutHover?: boolean;
};

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
	({ className, withoutHover = false, ...props }, ref) => (
		<tr
			ref={ref}
			className={cx(
				"data-state-selected:bg-gray-200 border-workos-gray-11 border-b",
				!withoutHover && "hover:bg-gray-200/10",
				className,
			)}
			{...props}
		/>
	),
);
TableRow.displayName = "TableRow";

const TableHead = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
	({ className, ...props }, ref) => (
		<th ref={ref} className={cx("h-11 px-4 text-left align-middle font-medium", className)} {...props} />
	),
);
TableHead.displayName = "TableHead";

const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
	({ className, ...props }, ref) => (
		<td ref={ref} className={cx("min-h-11 px-3 py-2.5 align-middle font-normal", className)} {...props} />
	),
);
TableCell.displayName = "TableCell";

export {
	//,
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	TableCell,
};
