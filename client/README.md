# workos takehome frontend

> _As shrimple as that!_

– cody.js / 🦐 (same thing)

## Setup

If you have direnv installed, you can use `direnv allow` to scaffold out the necessary tooling (`nvm`, `node`, `pnpm`). If not, please follow these instructions (duplicated from the [.envrc](../.envrc)):

1. [Install `nvm`](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) from and run the following to install `node` 20 LTS:

```sh
nvm install
```

> [!NOTE]  
> If you don't want to use `nvm`, please make sure you've installed `node` 20 LTS any other way you prefer.

2. Next, enable `corepack` to use and install `pnpm` by running:

```sh
corepack enable pnpm
```

3. Now, install `pnpm` with `corepack` (version comes from the [package.json#packageManager](../package.json)):

```sh
corepack install
```

4. Finally, install all dependencies with `pnpm`:

```sh
pnpm install
```

This will leverage [`pnpm` workspaces](https://pnpm.io/workspaces) for both the [client](./) and [server](../server).

## Development

To run everything in development mode:

```sh
pnpm -w run start
```

This uses [turborepo](https://turbo.build/) to run the the [client](./) and [server](../server) concurrently.

## Production

For running everything in production mode (preferred).

```sh
pnpm -w run serve
```

This will uses [turborepo](https://turbo.build/) to build and cache the [client](./) as well as run the [client](./) and [server](../server) concurrently.

## Improvements / What I'd do Differently

First off, this was a fun project to tackle within 8 hours!
As is tradition with frontend work, it looks simple on the outside until you get to building (especially with pagination and search thrown in)!

From the criteria/rubric:

> Work on the following tasks in this order. If you can’t complete all tasks, focus on quality rather than quantity.
>
> 1. Setup the "Users" and "Roles" tab structure
> 2. Add the users table
> 3. Add support for filtering the users table via the "Search" input field
> 4. Add support for deleting a user via the "more" icon button dropdown menu
> 5. Add support for viewing all roles in the "Roles" tab
> 6. Add support for renaming a role in the "Roles" tab
> 7. [Bonus] Add pagination to the user table

I completed all tasks (even the bonus pagination one) except for number 6.
It's not that it's complicated to do, just that I ran out of time and wanted to remain honest.
Admittedly, I read this list when I first started and forgot to consider the roles view as required criteria as I got into the thick of implementation.

To accomplish this feature, I would simply add a new remix `Form` + `action` to edit the name of a role in the [/roles/:roleId route](./app/routes/roles_.$roleId.tsx).
The form would basically be something like:

```tsx
<Form method="POST">
	<label htmlForm="name" className="mb-1 block">
		Name:
	</label>
	<Input id="name" name="name" defaultValue={role.name} />
	{actionData.error ? <p className="text-red-500">{actionData.error.message}</p> : null}
	<Button type="submit" appearance="filled" priority="default">
		Submit
	</Button>
</Form>
```

In the action, I would pull out the `name` from the `FormData`, validate that it's present, and then call `PATCH /roles/:id`.
Something along the lines of:

```tsx
export const action = async ({ params, request }: ActionFunctionArgs) => {
	const { roleId } = params;
	if (!roleId) {
		throw new Response("Invalid role ID", { status: 400 });
	}

	const formData = await request.formData();
	const name = String(formData.get("name") ?? "").trim();

	if (!name) {
		return { error: new Error("Name must be present") };
	}
	// maybe consider a minimum length too

	// maybe consider checking for duplicate name here or client side (remix-hook-form)
	// but, that's duplicated effort that is already done in the API

	try {
		// call PATCH /roles/:id
		// pseudo code, would need to include the "rest" of the role object here too
		await updateRole(roleId, name);
		return { error: null };
	} catch (error) {
		return { error };
	}
};
```

### Some other things I would consider changing/doing:

#### There's no tests in the client code!

This is obviously required when shipping to production.
I have `vitest` set up to run, but simply didn't prioritize writing any tests; I preferred to get the product built and work on styling/UX instead.

#### Reusable Components + Styling

I used tailwind instead of Radix Themes and took some shortcuts when building out reusable components + styling.
First, I stole some of my own prior art from [mantle](https://mantle.ngrok.com/) ([src](https://github.com/ngrok-oss/mantle)) to scaffold out some reusable components (similar to/inspired by [shadcn/ui](https://ui.shadcn.com/)).
I also added new "workos" tokens to the tailwind config, but they are sloppily named, especially the box-shadow tokens.
This should be cleaned up and/or switch over to use Radix Themes.

#### Time Management (The Deadline Comes for ALL!!)

I wasted a bit of time fighting remix `defer` + `Await`, especially around error handling.
The DX is a bit rough!

This was admittedly new territory for me because we haven't tried/used streaming in remix at ngrok yet.
But, I wanted to stretch myself a bit because it allowed me to leverage skeleton loading on the `/index` routes for users and roles.
Without it, the page was clunky and noticeably slow to respond, especially when you consider changing the speed of the api server!

#### Caching of `GET /index` responses server side!

It's nice to be able to use `Cache-Control` headers in remix, but they simply aren't sufficient in dashboard-like apps or apps with dynamic data; it helps, but leaves a lot to be desired!

It was trivial to cache `GET /{users,roles}/:id` with an LRU cache, but not so much for `/index` lists!
The complexity came about when considering how we cached pages and search results.

What I wanted to design for was to use a structure like how `react-query` caching is typically done: cache keys are of the form `["users", page, search]`.
This works great until you need to optimistically update the cache with mutations (e.g. edits/deletes)!

From my brief testing, the `LRUCache` library doesn't seem to let you have non-string cache keys (even though it says it can take non-primitives).
Even so, I would still need to build functionality to invalidate all sublists by some root key OR carefully pass in the current `search` and `page` search param values for each mutation.
The first option, if done wrong, could be expensive: e.g. walk all N entries (lists of Users/Roles) and update one item in a list of M (Users/Roles).
The second option, if done wrong, could strand data if missed (mem leak); however, this is probably not that big of a deal in retrospect because of the 1 minute TTL on the LRUCache instance assuming it does eager garbage collection (would need to verify).

#### Drawing the REST of the Owl 🦉

The screens in the Figma were built, but the _extra stuff_ wasn't, e.g. add, edit/view routes.
Of course, these would be nice to build out too with more time.
As alluded to above (in the role edit form discussion), there's not too much complexity in these views.
They are fairly straightforward and just take more time to build.

#### Authentication and Authorization

Additionally, I left out any authentication (authn) and authorization (authz) management and validation.
Authn, likely with a session cookie or jwt token, is important for knowing identity (who the user is) and gating whether someone can enter/view the iam screens.
Authz with Role-Based Access Control (RBAC), is important because we don't want all users to have elevated permissions.
Some users will have read-only access while others can mutate specific things.
This feels like something that user and role management views should include!

These responsibilities span across the application and API.

#### Vercel + .env

I started off the effort by converting the repo into a monorepo with turborepo + pnpm workspaces.
I also connected my personal Vercel account so that I could get PR preview deploys.
However, I didn't get the API server hooked up in preview deployments, so it's pretty useless outside of testing 500 responses!
Given more time, this would have been sick to connect together and use as part of the demo!

As an aside, I hardcoded the API url (localhost:3002) into the client app (server side remix).
Instead, it would be nice to flex that via environment variables as well.

#### Dynamic Data Table + Mobile

Last but not least: it would be awesome to integrate something like [TanStack Table](https://tanstack.com/table/latest) to get fun table features like sorting, reordering, hiding/showing columns, etc.

Could also leverage it to render a more "mobile-friendly" view on smaller viewports (likely a list of cards instead of a table).
Likewise, could have a view toggle that lets users switch between card/grid/list views for "desktop" viewports.
