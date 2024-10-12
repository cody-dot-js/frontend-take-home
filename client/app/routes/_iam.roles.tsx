import { MagnifyingGlass } from "@phosphor-icons/react/MagnifyingGlass";
import { Plus } from "@phosphor-icons/react/Plus";
import { MetaFunction } from "@remix-run/react";
import { Button } from "~/components/button";
import { Input, InputIcon } from "~/components/input";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "~/components/table";

export const meta: MetaFunction = () => {
	return [{ title: "Roles — IAM" }, { name: "description", content: "Roles — IAM" }];
};

export default function Component() {
	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2">
				<div className="relative flex-1">
					<InputIcon>
						<MagnifyingGlass className="size-4" />
					</InputIcon>
					<Input className="pl-8" type="text" placeholder="Search by name..." />
				</div>
				<Button type="button" appearance="filled" priority="default" size="md">
					<Plus /> Add Role
				</Button>
			</div>
			<div className="border-workos-gray-11 overflow-hidden rounded-lg border">
				<Table>
					<TableHeader>
						<TableRow withoutHover>
							<TableHead>Role</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>CreatedAt</TableHead>
							<TableHead>
								<span className="sr-only">Actions</span>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell>Design</TableCell>
							<TableCell>Designers create the visual and interactive elements of our products and services.</TableCell>
							<TableCell>Aug 27, 2024</TableCell>
							<TableCell className="text-right">
								<button type="button">...</button>
							</TableCell>
						</TableRow>
					</TableBody>
					<TableFooter>
						<TableRow withoutHover>
							<TableCell colSpan={4}>
								<div className="flex items-center justify-end gap-2">
									<Button type="button" appearance="outlined" priority="neutral" size="sm" disabled>
										Previous
									</Button>
									<Button type="button" appearance="outlined" priority="neutral" size="sm">
										Next
									</Button>
								</div>
							</TableCell>
						</TableRow>
					</TableFooter>
				</Table>
			</div>
		</div>
	);
}
