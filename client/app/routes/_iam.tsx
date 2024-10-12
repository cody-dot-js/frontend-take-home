import { ClientLoaderFunctionArgs, json, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/tabs";

export const clientLoader = ({ request }: ClientLoaderFunctionArgs) => {
	const url = new URL(request.url);
	const firstSegment = url.pathname.split("/")[1];
	const defaultTab = isTab(firstSegment) ? firstSegment : $tab("users");
	return json({ defaultTab });
};
clientLoader.hydrate = true;

const tabs = ["users", "roles"] as const;
type Tab = (typeof tabs)[number];
const $tab = <T extends Tab = Tab>(value: T) => value;
const isTab = (value: unknown): value is Tab => tabs.includes(value as Tab);

export default function Index() {
	const { defaultTab } = useLoaderData<typeof clientLoader>();
	const navigate = useNavigate();

	return (
		<main className="mx-auto h-full max-w-[53.125rem] p-4 lg:py-10">
			<Tabs
				defaultValue={defaultTab}
				onValueChange={(value) => {
					if (isTab(value)) {
						navigate(`/${value}`);
					}
				}}
			>
				<TabsList>
					<TabsTrigger value={$tab("users")}>Users</TabsTrigger>
					<TabsTrigger value={$tab("roles")}>Roles</TabsTrigger>
				</TabsList>
				<TabsContent value={$tab("users")}>
					<Outlet />
				</TabsContent>
				<TabsContent value={$tab("roles")}>
					<Outlet />
				</TabsContent>
			</Tabs>
		</main>
	);
}
