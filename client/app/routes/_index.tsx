import type { MetaFunction } from "@remix-run/node";
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
				<TabsContent value={$tab("users")}>Users content</TabsContent>
				<TabsContent value={$tab("roles")}>Roles content</TabsContent>
			</Tabs>
		</main>
	);
}
