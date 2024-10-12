import { MagnifyingGlass } from "@phosphor-icons/react/MagnifyingGlass";
import { Plus } from "@phosphor-icons/react/Plus";
import type { MetaFunction } from "@remix-run/node";
import { Button } from "~/components/button";
import { Input, InputIcon } from "~/components/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/tabs";

export const meta: MetaFunction = () => {
	return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

const tabs = ["users", "roles"] as const;
type Tab = (typeof tabs)[number];
const $tab = <T extends Tab = Tab>(value: T) => value;
const isTab = (value: unknown): value is Tab => tabs.includes(value as Tab);

export default function Index() {
	return (
		<main className="mx-auto h-full max-w-screen-lg p-4">
			<Tabs
				defaultValue={$tab("users")}
				onValueChange={(value) => {
					if (isTab(value)) {
						// update url here
					}
				}}
			>
				<TabsList>
					<TabsTrigger value={$tab("users")}>Users</TabsTrigger>
					<TabsTrigger value={$tab("roles")}>Roles</TabsTrigger>
				</TabsList>
				<TabsContent value={$tab("users")}>
					<p>Users content</p>
					<Button type="button" appearance="filled" priority="default" size="md">
						<Plus /> Add User
					</Button>
					<Button type="button" appearance="outlined" priority="danger" size="md">
						Delete User
					</Button>

					<Button type="button" appearance="outlined" priority="default" size="sm" disabled>
						Previous
					</Button>
					<Button type="button" appearance="outlined" priority="default" size="sm" asChild>
						<a href="#">Next</a>
					</Button>
					<div className="relative">
						<InputIcon>
							<MagnifyingGlass className="size-4" />
						</InputIcon>
						<Input className="pl-8" type="text" placeholder="Search by name..." />
					</div>
				</TabsContent>
				<TabsContent value={$tab("roles")}>Roles content</TabsContent>
			</Tabs>
		</main>
	);
}
