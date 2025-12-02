import React from 'react';

const Sidebar = ({ activeCategory, onSelectCategory, mode, onSwitchMode }) => {
    const questionCategories = [
        { id: 'base', label: '基础面试' },
        { id: 'resume', label: '简历面试题' },
        { id: 'android', label: 'Android 面试题' },
        { id: 'kotlin', label: 'Kotlin 面试题' },
        { id: 'flutter', label: 'Flutter 面试题' },
        { id: 'animations', label: '动画演示' },
    ];

    const knowledgeCategories = [
        { id: 'flutter', label: 'Flutter' },
        { id: 'compose', label: 'Compose' },
        { id: 'go', label: 'Go' },
    ];

    const categories = mode === 'questions' ? questionCategories : knowledgeCategories;

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="mode-toggle">
                    <button
                        className={`toggle-btn ${mode === 'questions' ? 'active' : ''}`}
                        onClick={() => onSwitchMode('questions')}
                    >
                        面试题库
                    </button>
                    <button
                        className={`toggle-btn ${mode === 'knowledge' ? 'active' : ''}`}
                        onClick={() => onSwitchMode('knowledge')}
                    >
                        知识学习
                    </button>
                </div>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    {categories.map((category) => (
                        <li key={category.id}>
                            <button
                                className={`nav-item ${activeCategory === category.id ? 'active' : ''}`}
                                onClick={() => onSelectCategory(category.id)}
                            >
                                {category.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
