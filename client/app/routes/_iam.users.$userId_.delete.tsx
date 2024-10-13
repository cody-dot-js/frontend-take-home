import { CircleNotch } from "@phosphor-icons/react/CircleNotch";
import { WarningCircle } from "@phosphor-icons/react/WarningCircle";
import {
	Form,
	json,
	Link,
	redirect,
	useActionData,
	useLoaderData,
	useNavigate,
	useNavigation,
	useRouteError,
	useSearchParams,
} from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/server-runtime";
import { deleteUserById, fetchUserById } from "~/api";
import { Alert, AlertContent, AlertDescription, AlertTitle } from "~/components/alert";
import { Button } from "~/components/button";
import { Dialog, DialogBody, DialogClose, DialogContent, DialogTitle } from "~/components/dialog";
import { anchorClassNames, StyledLink } from "~/components/styled-link";
import type { PropsWithChildren } from "react";
import { z } from "zod";

export async function loader({ params }: LoaderFunctionArgs) {
	const { userId } = params;
	const user = await fetchUserById(userId);
	return { user };
}

export async function action({ params }: ActionFunctionArgs) {
	const { userId } = params;

	try {
		await deleteUserById(userId);
		// TODO(cody): Add a success message/toast
		// for now, just redirect back to the users list
		return redirect("/users");
	} catch (error) {
		return json({ error, success: false });
	}
}

const withStatusSchema = z
	.object({
		status: z.number(),
	})
	.passthrough();
type WithStatus = z.infer<typeof withStatusSchema>;

const hasStatus = (value: unknown): value is WithStatus => withStatusSchema.safeParse(value).success;

export function ErrorBoundary() {
	const error = useRouteError();
	const [searchParams] = useSearchParams();

	const errorStatus = hasStatus(error) ? error.status : 500;

	if (errorStatus === 404) {
		return (
			<Layout>
				<DialogTitle className="mb-3">Delete user</DialogTitle>
				<Alert priority="warning" className="my-4">
					<WarningCircle className="size-5" />
					<AlertContent>
						<AlertTitle>User not found!</AlertTitle>
						<AlertDescription>The user you are trying to delete does not exist.</AlertDescription>
					</AlertContent>
				</Alert>
				<p>
					<StyledLink to={{ pathname: "..", search: searchParams.toString() }}>Go back to the users page?</StyledLink>
				</p>
				<footer className="flex items-center justify-end">
					<DialogClose asChild>
						<Button type="button" appearance="outlined" priority="neutral" size="md" asChild>
							<Link to={{ pathname: "..", search: searchParams.toString() }}>Cancel</Link>
						</Button>
					</DialogClose>
				</footer>
			</Layout>
		);
	}

	return (
		<Layout>
			<DialogTitle className="mb-3">Something went wrong!</DialogTitle>
			<Alert priority="danger" className="my-4">
				<WarningCircle className="size-5" />
				<AlertContent>
					<AlertTitle>Our server couldn't process your request :(</AlertTitle>
					<AlertDescription>
						Please refresh the page and try again. If the problem persists,{" "}
						<a className={anchorClassNames()} href="mailto:support@workos.com">
							please contact support.
						</a>
						.
					</AlertDescription>
				</AlertContent>
			</Alert>
			<p className="text-center">
				<Button asChild type="button" appearance="outlined" priority="neutral" size="sm">
					<Link to="." reloadDocument>
						Reload Page
					</Link>
				</Button>
			</p>
			<footer className="flex items-center justify-end">
				<DialogClose asChild>
					<Button type="button" appearance="outlined" priority="neutral" size="md" asChild>
						<Link to={{ pathname: "..", search: searchParams.toString() }}>Cancel</Link>
					</Button>
				</DialogClose>
			</footer>
		</Layout>
	);
}

export default function Component() {
	const loaderData = useLoaderData<typeof loader>();
	const navigation = useNavigation();
	const actionData = useActionData<typeof action>();
	const { user } = loaderData;

	return (
		<Layout>
			<DialogTitle className="mb-3">Delete user</DialogTitle>
			{actionData?.success === false && actionData.error != null && navigation.state === "idle" && (
				<Alert priority="danger" className="my-4">
					<WarningCircle className="size-5" />
					<AlertContent>
						<AlertTitle>Could not delete user!</AlertTitle>
						<AlertDescription>
							Something went wrong with our server. Please try again. If the problem persists,{" "}
							<a className={anchorClassNames()} href="mailto:support@workos.com">
								please contact support.
							</a>
						</AlertDescription>
					</AlertContent>
				</Alert>
			)}
			<Form method="POST">
				<p className="mb-4">
					Are you sure? The user{" "}
					<span className="font-medium">
						{user.first} {user.last}
					</span>{" "}
					will be permanently deleted.
				</p>
				<footer className="flex items-center justify-end gap-2">
					<DialogClose asChild>
						<Button
							type="button"
							appearance="outlined"
							priority="neutral"
							size="md"
							asChild
							isLoading={navigation.state !== "idle"}
						>
							<Link to="..">{navigation.state !== "idle" && <CircleNotch className="animate-spin" />} Cancel</Link>
						</Button>
					</DialogClose>
					<Button
						type="submit"
						appearance="outlined"
						priority="danger"
						size="md"
						isLoading={navigation.state !== "idle"}
					>
						{navigation.state !== "idle" && <CircleNotch className="animate-spin" />} Delete user
					</Button>
				</footer>
			</Form>
		</Layout>
	);
}

/**
 * Common layout (dialog) for the delete user page.
 */
function Layout({ children }: PropsWithChildren) {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	return (
		<Dialog
			open
			onOpenChange={() =>
				navigate({
					pathname: "..",
					search: searchParams.toString(),
				})
			}
		>
			<DialogContent>
				<DialogBody>{children}</DialogBody>
			</DialogContent>
		</Dialog>
	);
}
