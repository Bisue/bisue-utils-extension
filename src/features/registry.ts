import { Feature } from '../types';

// Type guard to check if an object is a Feature
function isFeature(obj: unknown): obj is Feature {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'id' in obj &&
        'name' in obj &&
        'matches' in obj &&
        ('execute' in obj || 'component' in obj)
    );
}

const modules = import.meta.glob('./*/index.{ts,tsx}', {
    eager: true,
    import: 'default'
});

export const features: Feature[] = Object.values(modules).flatMap((module: unknown) => {
    // If the module itself is the feature (default export)
    if (isFeature(module)) {
        return [module];
    }

    // If it's a module object with named exports, we might need different logic
    // But since we use import: 'default', 'module' here IS the default export.
    // If for some reason we need to support named exports, we'd need to change glob import.
    // For now, consistent usage of 'export default' is enforced by this logic.

    return [];
});

console.log('[Extension] Loaded features:', features.map(f => f.id));
