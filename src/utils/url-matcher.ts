export function isUrlMatched(url: string, patterns: (string | RegExp)[]): boolean {
    if (patterns.length === 0) return true;

    return patterns.some((pattern) => {
        if (typeof pattern === 'string') {
            return url.includes(pattern);
        } else if (pattern instanceof RegExp) {
            return pattern.test(url);
        }
        return false;
    });
}
