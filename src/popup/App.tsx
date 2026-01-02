import { useEffect, useState } from 'react';
import { features } from '../features/registry';
import { storage } from '../utils/storage';


function App() {
    const [featureStates, setFeatureStates] = useState<{ [key: string]: boolean }>({});
    const [featureSettings, setFeatureSettings] = useState<{ [key: string]: any }>({});

    useEffect(() => {
        async function loadData() {
            // Load States
            const states: { [key: string]: boolean } = {};
            const settingsMap: { [key: string]: any } = {};

            const storedStates = await storage.getFeatureStates();
            const storedSettings = await storage.getFeatureSettingsAll();

            for (const feature of features) {
                states[feature.id] = storedStates[feature.id] ?? feature.initialState;
                settingsMap[feature.id] = storedSettings[feature.id] || {};
            }
            setFeatureStates(states);
            setFeatureSettings(settingsMap);
        }
        loadData();
    }, []);

    const toggleFeature = async (featureId: string) => {
        const newState = !featureStates[featureId];
        setFeatureStates((prev) => ({ ...prev, [featureId]: newState }));
        await storage.setFeatureState(featureId, newState);
    };

    const updateSetting = async (featureId: string, key: string, value: any) => {
        // Optimistic UI Update
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
        <div style={{ padding: '20px', minWidth: '350px', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9' }}>
            <h1 style={{ fontSize: '18px', marginBottom: '15px', color: '#333' }}>확장프로그램 설정</h1>
            <div>
                {features.map((feature) => {
                    const isEnabled = !!featureStates[feature.id];
                    return (
                        <div
                            key={feature.id}
                            style={{
                                marginBottom: '15px',
                                padding: '15px',
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isEnabled && feature.settingsSchema ? '15px' : '0' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>{feature.name}</div>
                                    <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{feature.description}</div>
                                </div>
                                <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '24px', flexShrink: 0 }}>
                                    <input
                                        type="checkbox"
                                        checked={isEnabled}
                                        onChange={() => toggleFeature(feature.id)}
                                        style={{ opacity: 0, width: 0, height: 0 }}
                                    />
                                    <span
                                        style={{
                                            position: 'absolute',
                                            cursor: 'pointer',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: isEnabled ? '#4CAF50' : '#e0e0e0',
                                            transition: '.3s',
                                            borderRadius: '34px',
                                        }}
                                    >
                                        <span
                                            style={{
                                                position: 'absolute',
                                                content: '""',
                                                height: '18px',
                                                width: '18px',
                                                left: '3px',
                                                bottom: '3px',
                                                backgroundColor: 'white',
                                                transition: '.3s',
                                                borderRadius: '50%',
                                                transform: isEnabled ? 'translateX(16px)' : 'none',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                            }}
                                        />
                                    </span>
                                </label>
                            </div>

                            {/* Settings Form */}
                            {isEnabled && feature.settingsSchema && feature.settingsSchema.length > 0 && (
                                <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '15px' }}>
                                    {feature.settingsSchema.map((setting) => {
                                        const currentValue = featureSettings[feature.id]?.[setting.key] ?? setting.defaultValue;

                                        return (
                                            <div key={setting.key} style={{ marginBottom: '10px' }}>
                                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '5px', color: '#555' }}>
                                                    {setting.label}
                                                </label>

                                                {setting.type === 'color' && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <input
                                                            type="color"
                                                            value={currentValue}
                                                            onChange={(e) => updateSetting(feature.id, setting.key, e.target.value)}
                                                            style={{ border: 'none', padding: 0, width: '30px', height: '30px', cursor: 'pointer', backgroundColor: 'transparent' }}
                                                        />
                                                        <span style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>{currentValue}</span>
                                                    </div>
                                                )}

                                                {setting.type === 'text' && (
                                                    <input
                                                        type="text"
                                                        value={currentValue}
                                                        onChange={(e) => updateSetting(feature.id, setting.key, e.target.value)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '8px',
                                                            fontSize: '13px',
                                                            border: '1px solid #ddd',
                                                            borderRadius: '6px',
                                                            boxSizing: 'border-box'
                                                        }}
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
