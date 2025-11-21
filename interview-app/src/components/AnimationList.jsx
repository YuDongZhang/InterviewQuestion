import React, { useState } from 'react';
import AndroidViewDrawCycle from './animations/AndroidViewDrawCycle';
import FlutterArchitectureDemo from './animations/FlutterArchitectureDemo';
import FlutterRenderingFactory from './animations/FlutterRenderingFactory';
import FlutterStreamDemo from './animations/FlutterStreamDemo';

const AnimationList = () => {
    const [selectedAnimation, setSelectedAnimation] = useState(null);

    const animations = [
        {
            id: 'android-view-draw',
            title: 'Android View 绘制流程',
            description: '演示 View 的 Measure -> Layout -> Draw 生命周期',
            component: AndroidViewDrawCycle
        },
        {
            id: 'flutter-architecture',
            title: 'Flutter 渲染机制 (3D)',
            description: '演示 Widget -> Element -> RenderObject 三棵树关系',
            component: FlutterArchitectureDemo
        },
        {
            id: 'flutter-rendering-factory',
            title: 'Flutter 渲染流水线 (工厂模式)',
            description: '用工厂流水线比喻 Flutter 的 Build -> Layout -> Paint 过程',
            component: FlutterRenderingFactory
        },
        {
            id: 'flutter-stream',
            title: 'Flutter Stream 演示',
            description: '演示 Stream 数据流向：Source -> Pipe -> Listener',
            component: FlutterStreamDemo
        },
    ];

    if (selectedAnimation) {
        const Component = selectedAnimation.component;
        return (
            <div className="animation-detail">
                <button
                    onClick={() => setSelectedAnimation(null)}
                    style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}
                >
                    ← 返回列表
                </button>
                <Component />
            </div>
        );
    }

    return (
        <div className="animation-list">
            <h2>动画演示库</h2>
            <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {animations.map((anim) => (
                    <div
                        key={anim.id}
                        className="card"
                        onClick={() => setSelectedAnimation(anim)}
                        style={{
                            border: '1px solid #ddd',
                            padding: '20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            backgroundColor: 'white'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <h3 style={{ marginTop: 0, color: '#2196F3' }}>{anim.title}</h3>
                        <p style={{ color: '#666' }}>{anim.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnimationList;
