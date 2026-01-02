import { useEffect, useState } from 'react';
import * as Switch from '@radix-ui/react-switch';
import { features } from '../features/registry';
import { storage, FeatureStateMap, FeatureSettingsMap } from '../utils/storage';
import { FeatureSettingValue } from '../types';
import { cn } from '../utils/cn';

function App() {
    const [featureStates, setFeatureStates] = useState<FeatureStateMap>({});
    const [featureSettings, setFeatureSettings] = useState<FeatureSettingsMap>({});

    useEffect(() => {
        async function loadData() {
            const storedStates = await storage.getFeatureStates();
            const storedSettings = await storage.getFeatureSettingsAll();

            const initialStates: FeatureStateMap = {};
            const initialSettings: FeatureSettingsMap = {};

            for (const feature of features) {
                initialStates[feature.id] = storedStates[feature.id] ?? feature.initialState;
                initialSettings[feature.id] = storedSettings[feature.id] || {};
            }
            setFeatureStates(initialStates);
            setFeatureSettings(initialSettings);
        }
        loadData();
    }, []);

    const toggleFeature = async (featureId: string, newState: boolean) => {
        setFeatureStates((prev) => ({ ...prev, [featureId]: newState }));
        await storage.setFeatureState(featureId, newState);
    };

    const updateSetting = async (featureId: string, key: string, value: FeatureSettingValue) => {
        setFeatureSettings((prev) => ({
            ...prev,
            [featureId]: {
                ...prev[featureId],
                [key]: value
            }
        }));
        await storage.setFeatureSetting(featureId, key, value);
    };

    return (
        <div className="w-[350px] min-h-[400px] bg-gray-50 p-4 font-sans text-gray-900">
            <header className="mb-6 flex items-center justify-between">
                <h1 className="text-xl font-bold tracking-tight text-gray-900">확장프로그램 설정</h1>
            </header>

            <div className="space-y-4">
                {features.map((feature) => {
                    const isEnabled = !!featureStates[feature.id];

                    return (
                        <div
                            key={feature.id}
                            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="font-semibold text-gray-800">{feature.name}</div>
                                    <p className="mt-1 text-xs leading-relaxed text-gray-500">{feature.description}</p>
                                </div>

                                <Switch.Root
                                    className={cn(
                                        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-gray-200"
                                    )}
                                    checked={isEnabled}
                                    onCheckedChange={(checked) => toggleFeature(feature.id, checked)}
                                >
                                    <Switch.Thumb
                                        className={cn(
                                            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
                                        )}
                                    />
                                </Switch.Root>
                            </div>

                            {/* Settings Form */}
                            {isEnabled && feature.settingsSchema && feature.settingsSchema.length > 0 && (
                                <div className="mt-4 animate-in fade-in slide-in-from-top-2 border-t border-gray-100 pt-4">
                                    {feature.settingsSchema.map((setting) => {
                                        const currentValue = featureSettings[feature.id]?.[setting.key] ?? setting.defaultValue;

                                        return (
                                            <div key={setting.key} className="mb-3 last:mb-0">
                                                <label className="mb-1.5 block text-xs font-medium text-gray-600">
                                                    {setting.label}
                                                </label>

                                                {setting.type === 'color' && (
                                                    <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 p-1.5 focus-within:ring-2 focus-within:ring-indigo-500/20">
                                                        <div className="relative h-6 w-6 overflow-hidden rounded-full border border-gray-200 shadow-sm">
                                                            <input
                                                                type="color"
                                                                value={currentValue as string}
                                                                onChange={(e) => updateSetting(feature.id, setting.key, e.target.value)}
                                                                className="absolute -top-1/2 -left-1/2 h-[200%] w-[200%] cursor-pointer p-0 opacity-100"
                                                            />
                                                        </div>
                                                        <span className="font-mono text-xs text-gray-600 uppercase">{currentValue as string}</span>
                                                    </div>
                                                )}

                                                {setting.type === 'text' && (
                                                    <input
                                                        type="text"
                                                        value={currentValue as string}
                                                        onChange={(e) => updateSetting(feature.id, setting.key, e.target.value)}
                                                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default App;
