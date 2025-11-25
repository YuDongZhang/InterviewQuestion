import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SharedFlowDemo = () => {
    const [isEmitting, setIsEmitting] = useState(false);
    const [emittedItems, setEmittedItems] = useState([]);
    const [collectors, setCollectors] = useState([
        { id: 1, name: 'Collector 1', active: false, collected: [] },
        { id: 2, name: 'Collector 2', active: false, collected: [] },
        { id: 3, name: 'Collector 3', active: false, collected: [] }
    ]);
    const [replayCache, setReplayCache] = useState([]); // For replay feature
    const nextId = useRef(0);
    const REPLAY_SIZE = 2; // Number of items to replay

    // Hot Flow: Emit even without collectors
    useEffect(() => {
        let interval;
        if (isEmitting) {
            interval = setInterval(() => {
                const id = nextId.current++;
                const value = Math.floor(Math.random() * 100) + 1;
                const color = `hsl(${Math.random() * 360}, 70%, 60%)`;

                const newItem = { id, value, color };

                // Add to emitted items (they will flow through)
                setEmittedItems(prev => [...prev, newItem]);

                // Update replay cache (keep only last N items)
                setReplayCache(prev => {
                    const updated = [...prev, newItem];
                    return updated.slice(-REPLAY_SIZE);
                });

                // Deliver to all active collectors
                setCollectors(prevCollectors =>
                    prevCollectors.map(collector =>
                        collector.active
                            ? { ...collector, collected: [...collector.collected, newItem] }
                            : collector
                    )
                );

                // Remove from emitted items after animation completes
                setTimeout(() => {
                    setEmittedItems(prev => prev.filter(item => item.id !== id));
                }, 2000);

            }, 1200);
        }

        return () => clearInterval(interval);
    }, [isEmitting]);

    const toggleCollector = (collectorId) => {
        setCollectors(prevCollectors =>
            prevCollectors.map(collector => {
                if (collector.id === collectorId) {
                    const newActive = !collector.active;

                    // If activating: replay cached items
                    if (newActive && replayCache.length > 0) {
                        return {
                            ...collector,
                            active: newActive,
                            collected: [...collector.collected, ...replayCache]
                        };
                    }

                    return { ...collector, active: newActive };
                }
                return collector;
            })
        );
    };

    const clearCollector = (collectorId) => {
        setCollectors(prevCollectors =>
            prevCollectors.map(collector =>
                collector.id === collectorId
                    ? { ...collector, collected: [] }
                    : collector
            )
        );
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>Kotlin SharedFlow (热流 Hot Flow)</h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '14px' }}>
                SharedFlow 是 "热" 的。即使没有收集器，也会持续发射数据。
                <br />
                支持<strong>多个收集器</strong>同时订阅，并可<strong>重放最近的值</strong> (replay={REPLAY_SIZE})。
            </p>

            {/* Emit Control */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEmitting(!isEmitting)}
                    style={{
                        padding: '12px 24px',
                        fontSize: '16px',
                        backgroundColor: isEmitting ? '#F44336' : '#FF9800',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                >
                    {isEmitting ? '🔥 停止发射 (Stop Emit)' : '🔥 开始发射 (Start Emit)'}
                </motion.button>
            </div>

            {/* SharedFlow Emitter + Pipeline */}
            <div style={{
                backgroundColor: '#FFF3E0',
                border: '3px solid #FF9800',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                position: 'relative',
                minHeight: '150px'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '20px',
                    fontWeight: 'bold',
                    color: '#E65100',
                    fontSize: '16px'
                }}>
                    🔥 SharedFlow (Hot)
                </div>

                <div style={{
                    position: 'absolute',
                    top: '40px',
                    left: '20px',
                    fontSize: '12px',
                    color: '#666'
                }}>
                    Replay Cache: [{replayCache.map(item => item.value).join(', ')}]
                </div>

                {/* Flowing items */}
                <div style={{ position: 'relative', height: '80px', marginTop: '40px' }}>
                    <AnimatePresence>
                        {emittedItems.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ x: '10%', y: 20, opacity: 0, scale: 0.5 }}
                                animate={{ x: '90%', y: 20, opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 2, ease: "linear" }}
                                style={{
                                    position: 'absolute',
                                    width: '45px',
                                    height: '45px',
                                    borderRadius: '50%',
                                    backgroundColor: item.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    boxShadow: '0 3px 6px rgba(0,0,0,0.2)'
                                }}
                            >
                                {item.value}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div style={{
                    textAlign: 'center',
                    marginTop: '10px',
                    fontSize: '11px',
                    color: '#999',
                    fontStyle: 'italic'
                }}>
                    {isEmitting ? '持续发射中... (无论是否有收集器)' : '暂停发射'}
                </div>
            </div>

            {/* Collectors */}
            <h3 style={{ color: '#555', fontSize: '16px', marginBottom: '15px' }}>收集器 (Collectors)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                {collectors.map((collector) => (
                    <div
                        key={collector.id}
                        style={{
                            border: `2px solid ${collector.active ? '#4CAF50' : '#ccc'}`,
                            borderRadius: '8px',
                            padding: '10px',
                            backgroundColor: collector.active ? '#E8F5E9' : '#f9f9f9',
                            transition: 'all 0.3s'
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px'
                        }}>
                            <h4 style={{
                                margin: 0,
                                fontSize: '14px',
                                color: collector.active ? '#2E7D32' : '#666'
                            }}>
                                {collector.name}
                            </h4>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => toggleCollector(collector.id)}
                                style={{
                                    padding: '4px 10px',
                                    fontSize: '11px',
                                    backgroundColor: collector.active ? '#F44336' : '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                {collector.active ? 'Stop' : 'Start'}
                            </motion.button>
                        </div>

                        <div style={{
                            minHeight: '60px',
                            backgroundColor: 'white',
                            borderRadius: '4px',
                            padding: '6px',
                            border: '1px solid #eee'
                        }}>
                            <div style={{ fontSize: '10px', color: '#999', marginBottom: '4px' }}>
                                Collected ({collector.collected.length}):
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                {collector.collected.slice(-8).map((item, index) => (
                                    <motion.div
                                        key={`${collector.id}-${index}`}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            backgroundColor: item.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '9px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {item.value}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {collector.collected.length > 0 && (
                            <button
                                onClick={() => clearCollector(collector.id)}
                                style={{
                                    marginTop: '6px',
                                    width: '100%',
                                    padding: '3px',
                                    fontSize: '10px',
                                    cursor: 'pointer',
                                    border: '1px solid #ddd',
                                    borderRadius: '3px',
                                    backgroundColor: 'white'
                                }}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Info Box */}
            <div style={{
                marginTop: '20px',
                padding: '12px',
                backgroundColor: '#E3F2FD',
                borderLeft: '4px solid #2196F3',
                fontSize: '12px',
                color: '#555'
            }}>
                <strong>💡 SharedFlow 特性：</strong>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    <li><strong>热流 (Hot)</strong>：无论是否有收集器，都会发射数据</li>
                    <li><strong>多播 (Multicast)</strong>：支持多个收集器同时订阅</li>
                    <li><strong>重放 (Replay)</strong>：新收集器订阅时，会收到最近的 {REPLAY_SIZE} 个值</li>
                    <li><strong>状态共享</strong>：所有收集器收到相同的数据流</li>
                </ul>
            </div>
        </div>
    );
};

export default SharedFlowDemo;
