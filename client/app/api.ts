import { LRUCache } from "lru-cache";
import { z } from "zod";

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
 * USERS API
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

async function fetchUsers(options: ListOptions): Promise<UsersResponse> {
	const path = "/users";
	const baseApiUrl = "http://localhost:3002";
	const url = new URL(path, baseApiUrl);
	url.searchParams.set("page", options.page?.toString() ?? "1");
	if (options.search) {
		url.searchParams.set("search", options.search);
	}

	const jsonData = await retryWithExponentialBackoff(() => fetchJson(url), 3, 1000);
	const usersEndpointResponse = usersEndpointSchema.parse(jsonData);

	const roleIds = Array.from(new Set(usersEndpointResponse.data.map((user) => user.roleId)));
	const roles = await Promise.all(roleIds.map((id) => fetchRoleById(id)));
	const rolesMap = new Map(roles.map((role) => [role.id, role]));

	const users = usersEndpointResponse.data.map((user) => ({
		...user,
		role: rolesMap.get(user.roleId)?.name ?? "Unknown",
	}));

	const result: UsersResponse = {
		...usersEndpointResponse,
		data: users,
	};

	return result;
}

export { fetchUsers };

/**
 * ROLES API
 */

const roleSchema = z.object({
	id: z.string().trim().uuid(),
	createdAt: z.string().trim().datetime(),
	updatedAt: z.string().trim().datetime(),
	name: z.string().trim().min(1),
	isDefault: z.boolean(),
	description: z.string().trim().min(1),
});

export type Role = z.infer<typeof roleSchema>;

async function fetchRoles(options: ListOptions) {
	const path = "/roles";
	const baseApiUrl = "http://localhost:3002";
	const url = new URL(path, baseApiUrl);
	url.searchParams.set("page", options.page?.toString() ?? "1");
	if (options.search) {
		url.searchParams.set("search", options.search);
	}
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error("Failed to fetch roles");
	}
	const contentType = response.headers.get("content-type");
	if (!Boolean(contentType?.includes("application/json"))) {
		throw new Error(`${path} response is not JSON.`);
	}
	const jsonData = await response.json();
	const data = usersEndpointSchema.parse(jsonData);
	return data;
}

/**
 * Cache for roles (lookup by id), with a maximum of 100 entries and a 1-minute TTL.
 */
const rolesByIdLruCache = new LRUCache<string, Role>({
	max: 100,
	ttl: 1 * 60 * 1000, // 1 minute, in milliseconds
});

async function fetchRoleById(id: string) {
	// Check the cache first before making a network request.
	if (rolesByIdLruCache.has(id)) {
		const result = roleSchema.safeParse(rolesByIdLruCache.get(id));
		if (result.success) {
			return result.data;
		}
	}

	// If the role is not in the cache, fetch it from the network.
	const path = `/roles/${id}` as const;
	const baseApiUrl = "http://localhost:3002";
	const url = new URL(path, baseApiUrl);

	const jsonData = await retryWithExponentialBackoff(() => fetchJson(url), 3, 1000);
	const data = roleSchema.parse(jsonData);

	// don't forget to cache the result!
	rolesByIdLruCache.set(id, data);

	return data;
}

async function retryWithExponentialBackoff<T = unknown>(
	func: () => Promise<T>,
	retries: number = 1,
	backoff_ms: number = 1000,
): Promise<T> {
	for (let attempt = 0; attempt < retries; attempt++) {
		try {
			return await func(); // Call the provided function
		} catch (error) {
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

async function fetchJson(url: URL): Promise<unknown> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new ApiError(response.statusText, response.status);
	}
	const contentType = response.headers.get("content-type");
	if (!Boolean(contentType?.includes("application/json"))) {
		throw new ApiError(`${url} response is not JSON.`, 400);
	}
	return response.json();
}

export class ApiError extends Error {
	status: number;
	constructor(message: string, status: number) {
		super(message);
		this.status = status;
		this.name = "ApiError";
	}
}
