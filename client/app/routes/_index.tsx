import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, redirect } from "@remix-run/react";

export const loader = ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);

	// if we're at the root of the app, redirect to the users tab by default
	if (url.pathname === "/") {
		throw redirect("/users?page=1");
	}
};

export default function Component() {
	return <Outlet />;
}
