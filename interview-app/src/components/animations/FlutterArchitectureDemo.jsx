import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Html, RoundedBox, CameraControls } from '@react-three/drei';
import * as THREE from 'three';

// --- Components ---

const Widget = ({ color, position, opacity = 1, isNew = false }) => {
    const mesh = useRef();
    useFrame((state) => {
        if (mesh.current) {
            // Float effect
            mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
            if (isNew) {
                mesh.current.rotation.y += 0.02;
            }
        }
    });

    return (
        <group position={position}>
            <mesh ref={mesh}>
                <boxGeometry args={[1.8, 2.4, 0.05]} />
                <meshStandardMaterial color={color} transparent opacity={opacity} />
            </mesh>
            <Text position={[0, 1.5, 0]} fontSize={0.2} color="#333" anchorY="bottom">
                Widget
            </Text>
            <Text position={[0, 0, 0.1]} fontSize={0.15} color="white" textAlign="center">
                {isNew ? "New Config\n(Red)" : "Config\n(Blue)"}
            </Text>
        </group>
    );
};

const Element = ({ position, active }) => {
    const mesh = useRef();
    useFrame((state) => {
        if (mesh.current) {
            mesh.current.rotation.z -= 0.01;
            mesh.current.rotation.x += 0.01;
            // Pulse effect when active
            const scale = active ? 1.2 + Math.sin(state.clock.elapsedTime * 10) * 0.1 : 1;
            mesh.current.scale.setScalar(scale);
        }
    });

    return (
        <group position={position}>
            <mesh ref={mesh}>
                <torusGeometry args={[0.8, 0.2, 16, 32]} />
                <meshStandardMaterial color="#4CAF50" emissive={active ? "#81C784" : "#000"} />
            </mesh>
            <Text position={[0, 1.5, 0]} fontSize={0.2} color="#333" anchorY="bottom">
                Element
            </Text>
            <Html position={[0, -1.2, 0]} center>
                <div style={{
                    background: active ? '#4CAF50' : '#eee',
                    color: active ? 'white' : '#666',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    transition: 'all 0.3s',
                    whiteSpace: 'nowrap'
                }}>
                    {active ? "Diffing..." : "Stable"}
                </div>
            </Html>
        </group>
    );
};

const RenderObject = ({ color, position }) => {
    return (
        <group position={position}>
            <RoundedBox args={[2, 2, 2]} radius={0.1}>
                <meshStandardMaterial color={color} />
            </RoundedBox>
            <Text position={[0, 1.5, 0]} fontSize={0.2} color="#333" anchorY="bottom">
                RenderObject
            </Text>
            <Text position={[0, 0, 1.1]} fontSize={0.2} color="white">
                UI
            </Text>
        </group>
    );
};

const Connection = ({ start, end, active }) => {
    const lineGeometry = useMemo(() => {
        const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
        return new THREE.BufferGeometry().setFromPoints(points);
    }, [start, end]);

    return (
        <group>
            <line geometry={lineGeometry}>
                <lineBasicMaterial color={active ? "#FF5722" : "#ccc"} linewidth={2} />
            </line>
            {active && (
                <mesh position={[(start[0] + end[0]) / 2, (start[1] + end[1]) / 2, (start[2] + end[2]) / 2]}>
                    <sphereGeometry args={[0.1]} />
                    <meshBasicMaterial color="#FF5722" />
                </mesh>
            )}
        </group>
    );
};

const Scene = ({ step }) => {
    // State derived from step
    const showWidget1 = step >= 1 && step < 4;
    const showWidget2 = step >= 4;
    const showElement = step >= 2;
    const showRenderObject = step >= 3;

    const widgetColor = step < 4 ? "#2196F3" : "#F44336"; // Blue -> Red
    const renderObjectColor = step < 6 ? "#2196F3" : "#F44336"; // Blue -> Red (delayed update)
    const elementActive = step === 4 || step === 5; // Active during switch

    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 7]} intensity={1} />

            {/* Widget Position: Left */}
            {showWidget1 && <Widget color="#2196F3" position={[-4, 0, 0]} />}
            {showWidget2 && <Widget color="#F44336" position={[-4, 0, 0]} isNew={true} />}

            {/* Element Position: Center */}
            {showElement && (
                <>
                    <Connection start={[-2.8, 0, 0]} end={[-1, 0, 0]} active={elementActive} />
                    <Element position={[0, 0, 0]} active={elementActive} />
                </>
            )}

            {/* RenderObject Position: Right */}
            {showRenderObject && (
                <>
                    <Connection start={[1, 0, 0]} end={[2.8, 0, 0]} active={step === 5} />
                    <RenderObject color={renderObjectColor} position={[4, 0, 0]} />
                </>
            )}

            <CameraControls makeDefault />
        </>
    );
};

const FlutterArchitectureDemo = () => {
    const [step, setStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        let timer;
        if (isPlaying) {
            if (step < 6) {
                // Timing for each step
                const duration = step === 4 ? 2000 : 1500;
                timer = setTimeout(() => {
                    setStep((prev) => prev + 1);
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
            case 1: return "1. Build: Widget (配置) 创建";
            case 2: return "2. Mount: Element (管家) 被创建，持有 Widget";
            case 3: return "3. Render: Element 创建 RenderObject (UI)";
            case 4: return "4. Update: 新的 Widget (红) 来了！旧 Widget 被丢弃";
            case 5: return "5. Diff: Element 发现类型一样，复用自己！只更新配置";
            case 6: return "6. Paint: Element 通知 RenderObject 修改颜色 (无需重建)";
            default: return "点击开始：演示 Flutter 核心复用机制";
        }
    };

    return (
        <div className="animation-container" style={{ height: '600px', display: 'flex', flexDirection: 'column', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', background: 'white' }}>
            <div style={{ padding: '15px', background: '#f5f5f5', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ margin: '0 0 5px 0' }}>Flutter 渲染机制：三棵树与复用</h3>
                    <small style={{ color: '#666' }}>观察 Element 如何在 Widget 变化时保持稳定</small>
                </div>
                <div>
                    <button onClick={handlePlay} disabled={isPlaying} style={{
                        marginRight: '10px',
                        padding: '8px 16px',
                        cursor: isPlaying ? 'not-allowed' : 'pointer',
                        background: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px'
                    }}>
                        {step === 6 ? '再看一遍' : '开始演示'}
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, position: 'relative', background: '#f0f2f5' }}>
                <Canvas camera={{ position: [0, 0, 9], fov: 45 }}>
                    <Scene step={step} />
                </Canvas>

                {/* Progress Bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: '#ddd' }}>
                    <div style={{ width: `${(step / 6) * 100}%`, height: '100%', background: '#4CAF50', transition: 'width 0.5s' }} />
                </div>

                <div style={{
                    position: 'absolute',
                    bottom: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(255,255,255,0.95)',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    width: '80%',
                    maxWidth: '600px',
                    textAlign: 'center',
                    border: '1px solid #eee'
                }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#2196F3' }}>{getStepDescription().split(':')[0]}</h4>
                    <p style={{ margin: 0, fontSize: '16px', color: '#333' }}>
                        {getStepDescription().split(':')[1] || getStepDescription()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FlutterArchitectureDemo;
