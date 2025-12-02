import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KotlinFlowDemo = () => {
    const [isCollecting, setIsCollecting] = useState(false);
    const [flowItems, setFlowItems] = useState([]);
    const [collectedItems, setCollectedItems] = useState([]);
    const nextId = useRef(0);

    // Simulate Cold Flow Emission
    useEffect(() => {
        let interval;
        if (isCollecting) {
            interval = setInterval(() => {
                const id = nextId.current++;
                const value = Math.floor(Math.random() * 10) + 1; // 1-10
                const newItem = {
                    id,
                    value,
                    status: 'emitted', // emitted -> processed -> collected
                    color: '#2196F3'
                };

                setFlowItems(prev => [...prev, newItem]);

                // Simulate processing (map operator: value * 2)
                setTimeout(() => {
                    setFlowItems(prev => prev.map(item =>
                        item.id === id ? { ...item, value: item.value * 2, status: 'processed', color: '#FF9800' } : item
                    ));
                }, 1500);

                // Simulate collection
                setTimeout(() => {
                    setFlowItems(prev => prev.filter(item => item.id !== id));
                    setCollectedItems(prev => [...prev, { id, value: value * 2, color: '#4CAF50' }]);
                }, 3000);

            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isCollecting]);

    const handleToggleCollection = () => {
        setIsCollecting(!isCollecting);
        if (!isCollecting) {
            // Reset if starting fresh? Optional. For now let's keep history or maybe clear it.
            // setCollectedItems([]); 
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>Kotlin Flow (Cold Stream)</h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
                Flow 是 "冷" 的 (Cold)。只有调用 <code>{"collect()"}</code> 时，上游 (Upstream) 才会开始生产数据。
                <br />
                演示：Upstream (Emits) -&gt; Operator (map * 2) -&gt; Downstream (Collect)
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleToggleCollection}
                    style={{
                        padding: '12px 24px',
                        fontSize: '16px',
                        backgroundColor: isCollecting ? '#F44336' : '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                >
                    {isCollecting ? 'Stop Collection (Cancel)' : 'Start Collection (collect)'}
                </motion.button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', height: '250px', backgroundColor: '#FAFAFA', borderRadius: '16px', padding: '0 20px', border: '1px solid #eee' }}>

                {/* Upstream / Flow Builder */}
                <div style={{ zIndex: 2, textAlign: 'center', width: '120px' }}>
                    <div style={{
                        padding: '15px',
                        backgroundColor: '#E3F2FD',
                        border: '2px solid #2196F3',
                        borderRadius: '12px',
                        color: '#1565C0',
                        fontWeight: 'bold'
                    }}>
                        flow &#123; ... &#125;
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>Upstream</div>
                </div>

                {/* Pipeline Visualization */}
                <div style={{ flex: 1, position: 'relative', height: '100%' }}>
                    {/* Operator Node */}
                    <div style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '10px 20px',
                        backgroundColor: '#FFF3E0',
                        border: '2px dashed #FF9800',
                        borderRadius: '8px',
                        zIndex: 1,
                        color: '#E65100',
                        fontSize: '14px'
                    }}>
                        map( x * 2 )
                    </div>

                    {/* Moving Items */}
                    <AnimatePresence>
                        {flowItems.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ x: 0, opacity: 0, scale: 0.5 }}
                                animate={{
                                    x: item.status === 'emitted' ? '20%' : item.status === 'processed' ? '80%' : '100%',
                                    opacity: 1,
                                    scale: 1,
                                    backgroundColor: item.color
                                }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                style={{
                                    position: 'absolute',
                                    top: '40%', // Slightly above center to not overlap text too much
                                    left: 0,
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    zIndex: 10
                                }}
                            >
                                {item.value}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Downstream / Collector */}
                <div style={{ zIndex: 2, textAlign: 'center', width: '120px' }}>
                    <motion.div
                        animate={{ scale: isCollecting ? 1.05 : 1, borderColor: isCollecting ? '#4CAF50' : '#ddd' }}
                        style={{
                            padding: '15px',
                            backgroundColor: '#E8F5E9',
                            border: '2px solid #4CAF50',
                            borderRadius: '12px',
                            color: '#2E7D32',
                            fontWeight: 'bold'
                        }}>
                        .collect()
                    </motion.div>
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>Downstream</div>
                </div>

            </div>

            {/* Collected Items Log */}
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px', minHeight: '80px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#555', fontSize: '14px' }}>Collected Values:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {collectedItems.length === 0 && <span style={{ color: '#999', fontSize: '12px' }}>No items collected yet...</span>}
                    {collectedItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{
                                padding: '4px 10px',
                                backgroundColor: item.color,
                                color: 'white',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}
                        >
                            {item.value}
                        </motion.div>
                    ))}
                </div>
                {collectedItems.length > 0 && (
                    <button
                        onClick={() => setCollectedItems([])}
                        style={{ marginTop: '10px', padding: '4px 8px', fontSize: '10px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px', background: 'white' }}
                    >
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
};

export default KotlinFlowDemo;
