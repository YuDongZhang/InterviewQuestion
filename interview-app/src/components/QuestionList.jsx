import React, { useState } from 'react';
import QuestionItem from './QuestionItem';

const QuestionList = ({ questions, category, onUpdateQuestion, onAddQuestion, onDeleteQuestion, onBatchDelete, onInsertQuestion }) => {
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState([]);

  if (!questions) {
    return <div className="empty-state">加载中...</div>;
  }

  const toggleBatchMode = () => {
    setIsBatchMode(!isBatchMode);
    setSelectedIndices([]);
  };

  const handleSelect = (index) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter(i => i !== index));
    } else {
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  const handleBatchDeleteClick = () => {
    onBatchDelete(selectedIndices);
    setSelectedIndices([]);
    setIsBatchMode(false);
  };

  const handleSelectAll = () => {
    if (selectedIndices.length === questions.length) {
      setSelectedIndices([]);
    } else {
      setSelectedIndices(questions.map((_, index) => index));
    }
  };

  return (
    <div className="question-list">
      <div className="list-header">
        <h2>{category.toUpperCase()} 题目列表</h2>
        <div className="header-actions">
          <span className="count">共 {questions.length} 题</span>
          {isBatchMode ? (
            <>
              <div className="select-all-wrapper" style={{ display: 'flex', alignItems: 'center', marginRight: '1rem' }}>
                <input
                  type="checkbox"
                  id="select-all"
                  checked={questions.length > 0 && selectedIndices.length === questions.length}
                  onChange={handleSelectAll}
                  style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer', marginRight: '0.5rem' }}
                />
                <label htmlFor="select-all" style={{ cursor: 'pointer', userSelect: 'none' }}>全选</label>
              </div>
              <button className="batch-delete-btn" onClick={handleBatchDeleteClick} disabled={selectedIndices.length === 0}>
                删除选中 ({selectedIndices.length})
              </button>
              <button className="cancel-btn" onClick={toggleBatchMode}>取消管理</button>
            </>
          ) : (
            <>
              <button className="batch-btn" onClick={toggleBatchMode}>批量管理</button>
              <button className="add-btn" onClick={onAddQuestion}>+ 新增题目</button>
            </>
          )}
        </div>
      </div>
      <div className="list-content">
        {questions.length === 0 ? (
          <div className="empty-state">该分类下暂无题目，点击上方按钮添加</div>
        ) : (
          questions.map((item, index) => (
            <QuestionItem
              key={index}
              data={item}
              onUpdate={(updatedData) => onUpdateQuestion(index, updatedData)}
              onDelete={() => onDeleteQuestion(index)}
              onInsert={() => onInsertQuestion(index)}
              isBatchMode={isBatchMode}
              isSelected={selectedIndices.includes(index)}
              onSelect={() => handleSelect(index)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default QuestionList;
