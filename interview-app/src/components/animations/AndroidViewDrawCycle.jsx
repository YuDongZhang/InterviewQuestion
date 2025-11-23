import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AndroidViewDrawCycle = () => {
    const [step, setStep] = useState(0); // 0: Idle, 1: Measure, 2: Layout, 3: Draw
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        let timer;
        if (isPlaying) {
            if (step < 3) {
                timer = setTimeout(() => {
                    setStep(prev => prev + 1);
                }, 1500); // 每步间隔 1.5秒
            } else {
                setIsPlaying(false);
            }
        }
        return () => clearTimeout(timer);
    }, [isPlaying, step]);

    const handlePlay = () => {
        setStep(0);
        setIsPlaying(true);
        // 立即开始第一步
        setTimeout(() => setStep(1), 100);
    };

    const handleReset = () => {
        setStep(0);
        setIsPlaying(false);
    };

    // 动画变体
    const boxVariants = {
        idle: {
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            opacity: 0,
            backgroundColor: "#e0e0e0",
            borderColor: "transparent",
            borderWidth: 0
        },
        measure: {
            width: 100,
            height: 100,
            x: 0,
            y: 0,
            opacity: 1,
            backgroundColor: "#e0e0e0", // 还没定位置，先显示大小
            borderColor: "#2196F3", // 蓝色边框表示测量
            borderWidth: 2,
            transition: { duration: 0.8, type: "spring" }
        },
        layout: {
            width: 100,
            height: 100,
            x: 100, // 移动到指定位置
            y: 50,
            opacity: 1,
            backgroundColor: "#e0e0e0",
            borderColor: "#4CAF50", // 绿色边框表示布局完成
            borderWidth: 2,
            transition: { duration: 0.8, type: "spring" }
        },
        draw: {
            width: 100,
            height: 100,
            x: 100,
            y: 50,
            opacity: 1,
            backgroundColor: "#FF9800", // 填充颜色表示绘制
            borderColor: "#FF9800",
            borderWidth: 0,
            transition: { duration: 0.5 }
        }
    };

    const getStepLabel = () => {
        switch (step) {
            case 0: return "等待开始...";
            case 1: return "1. onMeasure (测量大小)";
            case 2: return "2. onLayout (确定位置)";
            case 3: return "3. onDraw (绘制内容)";
            default: return "";
        }
    };

    return (
        <div className="animation-container" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
            <h3>Android View 绘制流程演示</h3>
            <div className="controls" style={{ marginBottom: '20px' }}>
                <button onClick={handlePlay} disabled={isPlaying} style={{ marginRight: '10px', padding: '8px 16px', cursor: 'pointer' }}>
                    {step === 3 ? '重播' : '开始绘制'}
                </button>
                <button onClick={handleReset} disabled={isPlaying && step === 0} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                    重置
                </button>
            </div>

            <div className="stage" style={{ position: 'relative', width: '300px', height: '200px', border: '2px dashed #ccc', background: 'white' }}>
                <div style={{ position: 'absolute', top: '5px', left: '5px', color: '#999', fontSize: '12px' }}>Parent View</div>

                <motion.div
                    initial="idle"
                    animate={step === 0 ? "idle" : step === 1 ? "measure" : step === 2 ? "layout" : "draw"}
                    variants={boxVariants}
                    style={{
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '14px'
                    }}
                >
                    {step === 3 && "View"}
                </motion.div>
            </div>

            <div className="status" style={{ marginTop: '20px', fontWeight: 'bold', color: '#333' }}>
                当前阶段: <span style={{ color: '#2196F3' }}>{getStepLabel()}</span>
            </div>

            <div className="explanation" style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                {step === 1 && "父容器询问子 View 需要多大 (MeasureSpec)，子 View 计算并确定自己的宽高。"}
                {step === 2 && "父容器根据子 View 的大小和布局规则，确定子 View 在屏幕上的坐标 (Left, Top, Right, Bottom)。"}
                {step === 3 && "View 在 Canvas 上绘制自己的内容 (Background, Content, ScrollBar 等)。"}
            </div>
        </div>
    );
};

export default AndroidViewDrawCycle;
