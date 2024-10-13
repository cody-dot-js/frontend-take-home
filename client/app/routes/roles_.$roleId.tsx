import { ArrowLeft } from "@phosphor-icons/react/ArrowLeft";
import { StyledLink } from "~/components/styled-link";

export default function Component() {
	return (
		<main className="mx-auto h-full max-w-[53.125rem] space-y-4 p-4 lg:py-10">
			<p>TODO: Create a role (by id) view (could also be a Sheet / Dialog)</p>
			<p>
				<StyledLink className="inline-flex items-center gap-1" to="/roles">
					<ArrowLeft /> Go back
				</StyledLink>
			</p>
		</main>
	);
}
