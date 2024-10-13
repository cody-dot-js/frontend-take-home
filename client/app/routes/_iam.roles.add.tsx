import { Link, useNavigate, useSearchParams } from "@remix-run/react";
import { Button } from "~/components/button";
import { Dialog, DialogBody, DialogClose, DialogContent, DialogTitle } from "~/components/dialog";

export default function Component() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	return (
		<Dialog open onOpenChange={() => navigate({ pathname: "/roles", search: searchParams.toString() })}>
			<DialogContent>
				<DialogBody>
					<DialogTitle>New Role</DialogTitle>
					<form className="my-4">
						<p>TODO: create a new role form</p>
					</form>
					<footer className="flex items-center justify-end">
						<DialogClose asChild>
							<Button type="button" appearance="outlined" priority="neutral" size="md" asChild>
								<Link to={{ pathname: "/roles", search: searchParams.toString() }}>Cancel</Link>
							</Button>
						</DialogClose>
					</footer>
				</DialogBody>
			</DialogContent>
		</Dialog>
	);
}
