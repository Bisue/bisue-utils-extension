export interface Feature {
    id: string;
    name: string;
    description: string;
    /**
     * List of URL patterns to match.
     * Can be a simple string (substring match) or a RegExp.
     * If empty, it matches all URLs (use carefully).
     */
    matches: (string | RegExp)[];
    initialState: boolean;
    execute: () => void | Promise<void>;
}
