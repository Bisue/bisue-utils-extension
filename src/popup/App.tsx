import { useEffect, useState } from 'react';
import { features } from '../features/registry';
import { storage } from '../utils/storage';

function App() {
    const [featureStates, setFeatureStates] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        async function loadStates() {
            const states: { [key: string]: boolean } = {};
            for (const feature of features) {
                states[feature.id] = await storage.isFeatureEnabled(feature.id, feature.initialState);
            }
            setFeatureStates(states);
        }
        loadStates();
    }, []);

    const toggleFeature = async (featureId: string) => {
        const newState = !featureStates[featureId];
        setFeatureStates((prev) => ({ ...prev, [featureId]: newState }));
        await storage.setFeatureState(featureId, newState);
    };

    return (
        <div style={{ padding: '20px', minWidth: '350px', fontFamily: 'sans-serif' }}>
            <h1 style={{ fontSize: '18px', marginBottom: '15px' }}>확장프로그램 설정</h1>
            <div>
                {features.map((feature) => (
                    <div
                        key={feature.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '10px',
                            padding: '10px',
                            border: '1px solid #eee',
                            borderRadius: '8px',
                        }}
                    >
                        <div>
                            <div style={{ fontWeight: 'bold' }}>{feature.name}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>{feature.description}</div>
                        </div>
                        <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '24px' }}>
                            <input
                                type="checkbox"
                                checked={!!featureStates[feature.id]}
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
                                    backgroundColor: featureStates[feature.id] ? '#4CAF50' : '#ccc',
                                    transition: '.4s',
                                    borderRadius: '34px',
                                }}
                            >
                                <span
                                    style={{
                                        position: 'absolute',
                                        content: '""',
                                        height: '16px',
                                        width: '16px',
                                        left: '4px',
                                        bottom: '4px',
                                        backgroundColor: 'white',
                                        transition: '.4s',
                                        borderRadius: '50%',
                                        transform: featureStates[feature.id] ? 'translateX(16px)' : 'none',
                                    }}
                                />
                            </span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
