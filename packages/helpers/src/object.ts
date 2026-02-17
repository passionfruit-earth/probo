/**
 * A type safe version of Object.keys
 */
export function objectKeys<T extends Record<string, unknown>>(object: T) {
    return Object.keys(object) as (keyof T)[];
}

export function objectEntries<T extends Record<string, unknown>>(object: T) {
    return Object.entries(object) as [keyof T, T[keyof T]][];
}

/**
 * Trims string values and converts empty strings to null in form data objects
 */
export function cleanFormData<T extends Record<string, any>>(data: T): T {
    return Object.fromEntries(
        Object.entries(data).map(([k, v]) => {
            const trimmed = typeof v === 'string' ? v.trim() : v;
            return [k, trimmed === "" ? null : trimmed];
        })
    ) as T;
}
