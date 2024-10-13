import { CircleNotch } from "@phosphor-icons/react/CircleNotch";
import { DotsThree } from "@phosphor-icons/react/DotsThree";
import { MagnifyingGlass } from "@phosphor-icons/react/MagnifyingGlass";
import { Plus } from "@phosphor-icons/react/Plus";
import {
	Await,
	Form,
	Link,
	Outlet,
	useLoaderData,
	useNavigation,
	useSearchParams,
	type MetaFunction,
} from "@remix-run/react";
import { defer, redirect, type LoaderFunctionArgs } from "@remix-run/server-runtime";
import { fetchRoles } from "~/api";
import { Button } from "~/components/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/dropdown-menu";
import { Input, InputIcon } from "~/components/input";
import { PrettyDateTime } from "~/components/pretty-date-time";
import { Skeleton } from "~/components/skeleton";
import { anchorClassNames } from "~/components/styled-link";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "~/components/table";
import { $queryParam, parsePageQueryParam, parseSearchQueryParam } from "~/query-params";
import { Suspense, useRef, type ElementRef } from "react";

export const meta: MetaFunction = () => {
	return [{ title: "Roles — IAM" }, { name: "description", content: "Roles — IAM" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const pageParam = url.searchParams.get($queryParam("page"));
	if (!pageParam) {
		url.searchParams.set($queryParam("page"), "1");
		throw redirect(url.toString());
	}
	const page = parsePageQueryParam(pageParam);
	const search = parseSearchQueryParam(url.searchParams.get($queryParam("search")));

	return defer({ response: fetchRoles({ page, search }) }, { headers: { "Cache-Control": "public, max-age=60" } });
};

export default function Component() {
	const loaderData = useLoaderData<typeof loader>();
	const navigation = useNavigation();
	const [searchParams] = useSearchParams();
	const searchInputRef = useRef<ElementRef<"input">>(null);
	const searchValue = parseSearchQueryParam(searchParams.get($queryParam("search")));
	const searchFormRef = useRef<ElementRef<"form">>(null);

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2">
				<Form ref={searchFormRef} method="GET" className="flex-1">
					<div className="relative flex-1">
						<InputIcon>
							<MagnifyingGlass className="size-4" />
						</InputIcon>
						<Input
							ref={searchInputRef}
							id={$queryParam("search")}
							name={$queryParam("search")}
							defaultValue={searchValue}
							className="pl-8"
							type="text"
							placeholder="Search by name or description..."
							onChange={() => searchFormRef.current?.requestSubmit()}
						/>
					</div>
				</Form>

				<Button asChild type="button" appearance="filled" priority="default" size="md">
					<Link to={{ pathname: "add", search: searchParams.toString() }}>
						<Plus /> Add Role
					</Link>
				</Button>
			</div>
			<div className="border-workos-gray-11 overflow-hidden rounded-lg border">
				<Table>
					<TableHeader>
						<TableRow withoutHover>
							<TableHead>Name</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>CreatedAt</TableHead>
							<TableHead>
								<span className="sr-only">Actions</span>
							</TableHead>
						</TableRow>
					</TableHeader>
					<Suspense fallback={<RoleTableSkeleton />}>
						<Await resolve={loaderData.response} errorElement={<AwaitRolesErrorElement />}>
							{(response) => {
								const roles = response.data.filter((role) => role != null);
								const hasPrevious = typeof response.prev === "number" && response.pages > 1;
								const hasNext = typeof response.next === "number" && response.pages > 1;

								return (
									<>
										<TableBody>
											{roles.length === 0 ? (
												<TableRow withoutHover>
													<TableCell colSpan={4} className="space-y-4 py-8 text-center">
														<p>No roles found! Try a different search?</p>
														<p>
															<Button
																asChild
																isLoading={navigation.state !== "idle"}
																type="button"
																onClick={() => {
																	if (searchInputRef.current) {
																		searchInputRef.current.value = "";
																	}
																}}
																appearance="outlined"
																priority="neutral"
																size="sm"
															>
																<Link to=".">
																	{navigation.state !== "idle" && <CircleNotch className="animate-spin" />} Clear search
																</Link>
															</Button>
														</p>
													</TableCell>
												</TableRow>
											) : (
												roles.map((role) => (
													<TableRow key={role.id}>
														<TableCell>{role.name}</TableCell>
														<TableCell>{role.description}</TableCell>
														<TableCell>
															<PrettyDateTime value={role.createdAt} />
														</TableCell>
														<TableCell className="text-right">
															<DropdownMenu>
																<DropdownMenuTrigger
																	className="ring-workos-purple-9/20 hover:bg-workos-gray-a3 inline-flex size-6 items-center justify-center rounded-full focus:outline-none focus-visible:ring-4"
																	type="button"
																>
																	<DotsThree className="size-4" />
																</DropdownMenuTrigger>
																<DropdownMenuContent align="end" hideWhenDetached>
																	<DropdownMenuItem asChild>
																		<Link to={role.id}>Edit role</Link>
																	</DropdownMenuItem>
																	<DropdownMenuItem asChild>
																		<Link
																			to={{
																				pathname: `./${role.id}/delete`,
																				search: searchParams.toString(),
																			}}
																		>
																			Delete role
																		</Link>
																	</DropdownMenuItem>
																</DropdownMenuContent>
															</DropdownMenu>
														</TableCell>
													</TableRow>
												))
											)}
										</TableBody>
										<TableFooter>
											<TableRow withoutHover>
												<TableCell colSpan={4}>
													<Form method="GET" className="flex items-center justify-end gap-2">
														<Button
															name="page"
															value={response.prev ?? "1"}
															type="submit"
															appearance="outlined"
															priority="neutral"
															size="sm"
															disabled={!hasPrevious}
															isLoading={navigation.state !== "idle"}
														>
															{navigation.state !== "idle" && <CircleNotch className="animate-spin" />}
															Previous
														</Button>
														<Button
															name="page"
															value={response.next ?? "1"}
															type="submit"
															appearance="outlined"
															priority="neutral"
															size="sm"
															disabled={!hasNext}
															isLoading={navigation.state !== "idle"}
														>
															{navigation.state !== "idle" && <CircleNotch className="animate-spin" />} Next
														</Button>
													</Form>
												</TableCell>
											</TableRow>
										</TableFooter>
									</>
								);
							}}
						</Await>
					</Suspense>
				</Table>
			</div>
			<Outlet />
		</div>
	);
}

/**
 * Error element to show when the roles couldn't be loaded.
 */
function AwaitRolesErrorElement() {
	return (
		<>
			<TableBody>
				<TableRow withoutHover>
					<TableCell colSpan={4} className="space-y-4 py-8 text-center">
						<p>Sorry, something went wrong and we couldn't load your Workspace's Roles 😭</p>
						<p>
							Please try again by refreshing the page. If the problem persists,{" "}
							<a className={anchorClassNames()} href="mailto:support@workos.com">
								please contact support.
							</a>
						</p>
						<p>
							<Button asChild type="button" appearance="outlined" priority="neutral" size="sm">
								<Link to="." reloadDocument>
									Reload Page
								</Link>
							</Button>
						</p>
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
							<Button type="button" appearance="outlined" priority="neutral" size="sm" disabled>
								Next
							</Button>
						</div>
					</TableCell>
				</TableRow>
			</TableFooter>
		</>
	);
}

/**
 * Skeleton table body + footer to show while loading the roles.
 */
function RoleTableSkeleton() {
	return (
		<>
			<TableBody>
				{Array.from({ length: 10 }).map((_, index) => (
					<TableRow key={index}>
						<TableCell>
							<div className="flex items-center gap-2">
								<Skeleton className="size-6 rounded-full" /> <Skeleton className="h-5 w-32" />
							</div>
						</TableCell>
						<TableCell>
							<Skeleton className="h-5 w-36" />
						</TableCell>
						<TableCell>
							<Skeleton className="h-5 w-[5.375rem]" />
						</TableCell>
						<TableCell className="text-right">
							<button
								type="button"
								className="ring-workos-purple-9/20 hover:bg-workos-gray-a3 inline-flex size-6 items-center justify-center rounded-full opacity-50 focus:outline-none focus-visible:ring-4"
							>
								<DotsThree className="size-4" />
							</button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
			<TableFooter>
				<TableCell colSpan={4}>
					<Form method="GET" className="flex items-center justify-end gap-2">
						<Button name="page" type="submit" appearance="outlined" priority="neutral" size="sm" isLoading>
							<CircleNotch className="animate-spin" />
							Previous
						</Button>
						<Button name="page" type="submit" appearance="outlined" priority="neutral" size="sm" isLoading>
							<CircleNotch className="animate-spin" /> Next
						</Button>
					</Form>
				</TableCell>
			</TableFooter>
		</>
	);
}
