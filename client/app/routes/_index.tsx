import { ClientLoaderFunctionArgs, Outlet, redirect } from "@remix-run/react";

export const clientLoader = ({ request }: ClientLoaderFunctionArgs) => {
	const url = new URL(request.url);

	// if we're at the root of the app, redirect to the users tab by default
	if (url.pathname === "/") {
		throw redirect("/users");
	}
};
clientLoader.hydrate = true;

export default function Component() {
	return <Outlet />;
}
