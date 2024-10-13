import { LRUCache } from "lru-cache";
import { z } from "zod";
import { $queryParam } from "./query-params";

type ListOptions = {
	page: number;
	search?: string | undefined;
};

const pagedSchema = <TSchema extends z.AnyZodObject>(schema: TSchema) =>
	z.object({
		data: z.array(schema),
		next: z.number().nullable(),
		prev: z.number().nullable(),
		pages: z.number(),
	});

export type PagedData<T> = {
	data: T[];
	next: number | null;
	prev: number | null;
	pages: number;
};

/**
 * --- USERS API ---
 */

const userResponseSchema = z.object({
	id: z.string().trim().uuid(),
	createdAt: z.string().trim().datetime(),
	updatedAt: z.string().trim().datetime(),
	first: z.string().trim().min(1),
	last: z.string().trim().min(1),
	roleId: z.string().trim().uuid(),
	photo: z.string().trim().url(),
});

const usersEndpointSchema = pagedSchema(userResponseSchema);

const userSchema = z
	.object({
		role: z.string().trim().min(1),
	})
	.merge(userResponseSchema);

export type User = z.infer<typeof userSchema>;

const usersResponseSchema = pagedSchema(userSchema);
type UsersResponse = z.infer<typeof usersResponseSchema>;

/**
 * A cache of Users by ID, with a maximum of 100 entries and a 1-minute TTL.
 */
const usersByIdLruCache = new LRUCache<string, User>({
	max: 100,
	ttl: 1 * 60 * 1000, // 1 minute, in milliseconds
});

/**
 * GET /users, by page and search query.
 */
async function fetchUsers(options: ListOptions): Promise<UsersResponse> {
	// TODO(cody): would love to cache this, but ran out of time!
	// it gets gnarly when caching by page + search and invalidating on delete

	const path = "/users";
	const baseApiUrl = "http://localhost:3002";
	const url = new URL(path, baseApiUrl);
	url.searchParams.set($queryParam("page"), options.page?.toString() ?? "1");
	if (options.search) {
		url.searchParams.set($queryParam("search"), options.search);
	}

	const jsonData = await retryWithExponentialBackoff(() => fetchJson(url), { retries: 3, backoff_ms: 1000 });
	const usersEndpointResponse = usersEndpointSchema.parse(jsonData);

	const roleIds = Array.from(new Set(usersEndpointResponse.data.map((user) => user.roleId)));
	const roles = await Promise.all(roleIds.map((id) => fetchRoleById(id)));
	const rolesMap = new Map(roles.map((role) => [role.id, role]));

	const users = usersEndpointResponse.data.map((user) => ({
		...user,
		role: rolesMap.get(user.roleId)?.name ?? "Unknown",
	}));

	// add each user to the byId cache
	users.forEach((user) => {
		usersByIdLruCache.set(user.id, user);
	});

	const result: UsersResponse = {
		...usersEndpointResponse,
		data: users,
	};

	return result;
}

/**
 * GET /user/:id
 */
async function fetchUserById(id: string | undefined): Promise<User> {
	if (!id) {
		// bad request
		throw new Response("User ID is required", { status: 400 });
	}

	// Check the cache first before making a network request.
	if (usersByIdLruCache.has(id)) {
		const result = userSchema.safeParse(usersByIdLruCache.get(id));
		if (result.success) {
			return result.data;
		}
	}

	// If the user is not in the cache, fetch it from the api.
	const path = `/users/${id}` as const;
	const baseApiUrl = "http://localhost:3002";
	const url = new URL(path, baseApiUrl);

	const jsonData = await retryWithExponentialBackoff(() => fetchJson(url), {
		retries: 3,
		backoff_ms: 1000,
		shouldNotRetry: (error) => {
			// Don't retry if the user is not found (404)
			return error instanceof Response && error.status === 404;
		},
	});
	const userResponse = userResponseSchema.parse(jsonData);

	const role = await fetchRoleById(userResponse.roleId);
	const user = { ...userResponse, role: role.name };

	// don't forget to cache the result!
	usersByIdLruCache.set(id, user);

	return user;
}

/**
 * DELETE /user/:id
 */
async function deleteUserById(id: string | undefined): Promise<void> {
	if (!id) {
		// bad request
		throw new Response("User ID is required", { status: 400 });
	}

	// If the user is not in the cache, fetch it from the api.
	const path = `/users/${id}` as const;
	const baseApiUrl = "http://localhost:3002";
	const url = new URL(path, baseApiUrl);

	try {
		await retryWithExponentialBackoff(() => fetchJson(url, { method: "DELETE" }), {
			retries: 3,
			backoff_ms: 1000,
			shouldNotRetry: (error) => {
				// Don't retry if the user is not found (404)
				return error instanceof Response && error.status === 404;
			},
		});
	} catch (error) {
		throw error;
	} finally {
		// don't forget to delete the result from the cache!
		usersByIdLruCache.delete(id);
	}
}

export { fetchUsers, fetchUserById, deleteUserById, fetchRoles };

/**
 * --- ROLES API ---
 */

const roleSchema = z.object({
	id: z.string().trim().uuid(),
	createdAt: z.string().trim().datetime(),
	updatedAt: z.string().trim().datetime(),
	name: z.string().trim().min(1),
	isDefault: z.boolean(),
	description: z.string().trim().min(1),
});

const rolesEndpointSchema = pagedSchema(roleSchema);
type RolesResponse = z.infer<typeof rolesEndpointSchema>;

export type Role = z.infer<typeof roleSchema>;

/**
 * GET /roles, by page and search query.
 */
async function fetchRoles(options: ListOptions): Promise<RolesResponse> {
	// TODO(cody): would love to cache this, but ran out of time!
	// it gets gnarly when caching by page + search and progressively enhancing on renames!

	const path = "/roles";
	const baseApiUrl = "http://localhost:3002";
	const url = new URL(path, baseApiUrl);
	url.searchParams.set($queryParam("page"), options.page?.toString() ?? "1");
	if (options.search) {
		url.searchParams.set($queryParam("search"), options.search);
	}
	const jsonData = await retryWithExponentialBackoff(() => fetchJson(url), { retries: 3, backoff_ms: 1000 });
	const data = rolesEndpointSchema.parse(jsonData);
	return data;
}

/**
 * Cache for roles (lookup by id), with a maximum of 100 entries and a 1-minute TTL.
 */
const rolesByIdLruCache = new LRUCache<string, Role>({
	max: 100,
	ttl: 1 * 60 * 1000, // 1 minute, in milliseconds
});

/**
 * GET /roles/:id
 */
async function fetchRoleById(id: string) {
	// Check the cache first before making a network request.
	if (rolesByIdLruCache.has(id)) {
		const result = roleSchema.safeParse(rolesByIdLruCache.get(id));
		if (result.success) {
			return result.data;
		}
	}

	// If the role is not in the cache, fetch it from the api.
	const path = `/roles/${id}` as const;
	const baseApiUrl = "http://localhost:3002";
	const url = new URL(path, baseApiUrl);

	const jsonData = await retryWithExponentialBackoff(() => fetchJson(url), { retries: 3, backoff_ms: 1000 });
	const data = roleSchema.parse(jsonData);

	// don't forget to cache the result!
	rolesByIdLruCache.set(id, data);

	return data;
}

/**
 * --- PRIVATE HELPERS ---
 */

/**
 * Retry an async function (e.g. fetch) with a given number of retries and exponential backoff.
 * Has an optional shouldNotRetry function that can be used to determine if a specific error should not be retried, e.g. 404 Not Found.
 */
async function retryWithExponentialBackoff<T = unknown>(
	func: () => Promise<T>,
	options: {
		retries?: number;
		backoff_ms?: number;
		shouldNotRetry?: (error: unknown) => boolean;
	},
): Promise<T> {
	const { retries = 1, backoff_ms = 1000, shouldNotRetry } = options;

	for (let attempt = 0; attempt < retries; attempt++) {
		try {
			return await func(); // Call the provided function
		} catch (error) {
			// Check to see if the error should be retried
			if (shouldNotRetry?.(error)) {
				throw error; // Rethrow the error if it should not be retried
			}

			if (attempt < retries - 1) {
				const waitTime = backoff_ms * 2 ** attempt; // Calculate wait time
				console.error(`Attempt ${attempt + 1} failed. Retrying in ${waitTime}ms...`);
				await new Promise((resolve) => setTimeout(resolve, waitTime)); // Wait before retrying
			} else {
				throw error; // Rethrow the last error after all retries
			}
		}
	}
	throw new Error("Unreachable code"); // This should never be reached
}

/**
 * Wrapper around fetch that throws a Response when the status code is not 2xx or if the content type is not JSON.
 */
async function fetchJson(url: URL, options?: RequestInit): Promise<unknown> {
	const response = await fetch(url, options);
	if (!response.ok) {
		throw response;
	}
	const contentType = response.headers.get("content-type");
	if (!Boolean(contentType?.includes("application/json"))) {
		throw new Response(`${url} response is not JSON.`, { status: 400 });
	}
	return response.json();
}
