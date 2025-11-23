import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FlutterRenderingFactory = () => {
    const [step, setStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        let timer;
        if (isPlaying) {
            if (step < 5) {
                const duration = 2000;
                timer = setTimeout(() => {
                    setStep(prev => prev + 1);
                }, duration);
            } else {
                setIsPlaying(false);
            }
        }
        return () => clearTimeout(timer);
    }, [isPlaying, step]);

    const handlePlay = () => {
        setStep(0);
        setIsPlaying(true);
        setTimeout(() => setStep(1), 100);
    };

    const getStepDescription = () => {
        switch (step) {
            case 1: return "1. 信号 (VSync): 屏幕发出刷新信号，工厂开工！";
            case 2: return "2. 蓝图 (Widget): 设计师送来新的 UI 蓝图 (不可变配置)。";
            case 3: return "3. 工人 (Element): 拿到蓝图，检查是否需要更新现有产品。";
            case 4: return "4. 组装 (Layout): 测量尺寸，确定位置 (RenderObject)。";
            case 5: return "5. 上色 (Paint): 喷涂颜色，最终产品出厂！";
            default: return "点击开始：进入 Flutter 渲染工厂";
        }
    };

    // Animation Variants
    const blueprintVariants = {
        hidden: { x: -100, opacity: 0 },
        visible: { x: 50, opacity: 1, transition: { duration: 0.8 } },
        processed: { x: 150, opacity: 0, scale: 0.5, transition: { duration: 0.5 } }
    };

    const workerVariants = {
        idle: { scale: 1, rotate: 0 },
        working: { scale: 1.1, rotate: [0, -10, 10, 0], transition: { repeat: 2, duration: 0.5 } }
    };

    const productVariants = {
        hidden: { opacity: 0, scale: 0 },
        layout: { opacity: 1, scale: 1, width: 80, height: 80, backgroundColor: '#e0e0e0', border: '2px dashed #333' },
        paint: { backgroundColor: '#2196F3', border: 'none', transition: { duration: 0.5 } },
        shipped: { x: 200, opacity: 0, transition: { duration: 0.8 } }
    };

    return (
        <div className="animation-container" style={{
            height: '500px',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #ddd',
            borderRadius: '8px',
            overflow: 'hidden',
            background: 'white',
            fontFamily: 'sans-serif'
        }}>
            <div style={{ padding: '15px', background: '#f5f5f5', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ margin: '0 0 5px 0' }}>Flutter 渲染工厂 (流水线)</h3>
                    <small style={{ color: '#666' }}>Widget -&gt; Element -&gt; RenderObject</small>
                </div>
                <button onClick={handlePlay} disabled={isPlaying} style={{
                    padding: '8px 16px',
                    cursor: isPlaying ? 'not-allowed' : 'pointer',
                    background: '#FF9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                }}>
                    {step === 5 ? '再次生产' : '启动流水线'}
                </button>
            </div>

            <div style={{ flex: 1, position: 'relative', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                {/* Factory Floor */}
                <div style={{
                    width: '90%',
                    height: '200px',
                    borderBottom: '4px solid #333',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'flex-end',
                    paddingBottom: '10px'
                }}>
                    <div style={{ position: 'absolute', bottom: '-30px', width: '100%', textAlign: 'center', color: '#999', fontSize: '12px' }}>
                        RENDERING PIPELINE
                    </div>

                    {/* Station 1: Input (Widget) */}
                    <div style={{ width: '100px', height: '100%', position: 'absolute', left: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#666' }}>Input</div>
                        <AnimatePresence>
                            {step >= 2 && step < 3 && (
                                <motion.div
                                    variants={blueprintVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="processed"
                                    style={{
                                        width: '60px',
                                        height: '80px',
                                        background: '#E3F2FD',
                                        border: '2px solid #2196F3',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '10px',
                                        color: '#1565C0',
                                        textAlign: 'center',
                                        position: 'absolute',
                                        bottom: '20px',
                                        left: '0'
                                    }}
                                >
                                    Widget<br />(蓝图)
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Station 2: Worker (Element) */}
                    <div style={{ width: '100px', height: '100%', position: 'absolute', left: '35%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#666' }}>Manager</div>
                        <motion.div
                            variants={workerVariants}
                            animate={step === 3 ? "working" : "idle"}
                            style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: '#4CAF50',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                zIndex: 10
                            }}
                        >
                            Element
                        </motion.div>
                    </div>

                    {/* Station 3: Assembly (RenderObject) */}
                    <div style={{ width: '100px', height: '100%', position: 'absolute', left: '70%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#666' }}>Output</div>
                        <AnimatePresence>
                            {step >= 4 && (
                                <motion.div
                                    variants={productVariants}
                                    initial="hidden"
                                    animate={step === 5 ? "paint" : step > 5 ? "shipped" : "layout"}
                                    exit="shipped"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: step === 5 ? 'white' : '#333',
                                        fontWeight: 'bold',
                                        borderRadius: '8px'
                                    }}
                                >
                                    {step === 4 ? "Layout" : "UI"}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Conveyor Belt Animation */}
                    <motion.div
                        animate={{ backgroundPositionX: isPlaying ? "100%" : "0%" }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        style={{
                            position: 'absolute',
                            bottom: '0',
                            left: '0',
                            width: '100%',
                            height: '10px',
                            background: 'repeating-linear-gradient(45deg, #333, #333 10px, #444 10px, #444 20px)'
                        }}
                    />
                </div>

                {/* Description Box */}
                <div style={{
                    marginTop: '40px',
                    padding: '20px',
                    background: '#FFF3E0',
                    borderRadius: '8px',
                    border: '1px solid #FFE0B2',
                    width: '80%',
                    textAlign: 'center'
                }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#E65100' }}>当前工序</h4>
                    <p style={{ margin: 0, fontSize: '16px', color: '#333' }}>{getStepDescription()}</p>
                </div>

            </div>
        </div>
    );
};

export default FlutterRenderingFactory;
