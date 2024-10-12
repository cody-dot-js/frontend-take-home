import { z } from "zod";

/**
 * Schema for the page query parameter.
 */
const pageQueryParamSchema = z
	.string()
	.transform((value) => parseInt(value, 10))
	.refine((value) => value > 0);

/**
 * Parse the page query parameter, defaulting to 1 if it's not a valid number.
 */
function parsePageQueryParam(value: string | null | undefined) {
	return pageQueryParamSchema.safeParse(value).data ?? 1;
}

/**
 * Schema for the search query parameter.
 */
const searchQueryParamSchema = z.string().trim().optional();

/**
 * Parse the search query parameter, defaulting to an empty string if null.
 */
function parseSearchQueryParam(value: string | null | undefined) {
	return searchQueryParamSchema.safeParse(value).data ?? "";
}

/**
 * List of blessed query parameters.
 */
const queryParams = ["page", "search"] as const;
export type QueryParam = (typeof queryParams)[number];

/**
 * Create a query parameter string (type to runtime value converter).
 */
const $queryParam = <T extends QueryParam = QueryParam>(value: T) => value;

export {
	//,
	parsePageQueryParam,
	parseSearchQueryParam,
	$queryParam,
};
