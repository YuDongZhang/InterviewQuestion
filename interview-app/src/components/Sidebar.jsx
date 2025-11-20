import React from 'react';

const Sidebar = ({ activeCategory, onSelectCategory }) => {
    const categories = [
        { id: 'android', label: 'Android 面试题' },
        { id: 'kotlin', label: 'Kotlin 面试题' },
        { id: 'flutter', label: 'Flutter 面试题' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>面试题库</h2>
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
