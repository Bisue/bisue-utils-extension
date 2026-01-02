import { Feature } from '../types';

// Auto-register all features using Vite's glob import
// It matches any 'index.ts' inside 'src/features/*' (subdirectories)
// eager: true ensures they are included in the bundle directly
const modules = import.meta.glob<Record<string, Feature>>('./*/index.ts', {
    eager: true,
    import: 'default' // We assume default export, but we'll check named exports too if needed
});

export const features: Feature[] = Object.values(modules).flatMap((module: any) => {
    // If the module default export is the Feature object
    if (module.default && module.default.id) {
        return [module.default];
    }
    // If the module exports the Feature object as a named export (fallback)
    // We search for any export that looks like a Feature
    const validFeatures = Object.values(module).filter((exp: any) =>
        exp && typeof exp === 'object' && 'id' in exp && 'execute' in exp
    ) as Feature[];

    return validFeatures;
});

console.log('[Extension] Loaded features:', features.map(f => f.id));
