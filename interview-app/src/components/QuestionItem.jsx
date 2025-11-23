import React, { useState, useEffect } from 'react';

const QuestionItem = ({ data, onUpdate, onDelete, onInsert, isBatchMode, isSelected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(data);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    setEditData(data);
  }, [data]);

  const toggleOpen = () => {
    if (!isEditing && !isBatchMode) setIsOpen(!isOpen);
  };

  const toggleDetail = (e) => {
    e.stopPropagation();
    setShowDetail(!showDetail);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setIsOpen(true);
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancelClick = (e) => {
    e.stopPropagation();
    setEditData(data);
    setIsEditing(false);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete();
  };

  const handleInsertClick = (e) => {
    e.stopPropagation();
    onInsert();
  };

  const handleChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  return (
    <div
      className={`question-item ${isOpen ? 'open' : ''} ${isEditing ? 'editing' : ''} ${isBatchMode ? 'batch-mode' : ''}`}
      onClick={isBatchMode ? onSelect : toggleOpen}
    >
      <div className="question-header">
        {isBatchMode && (
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onSelect}
              onClick={(e) => e.stopPropagation()}
              className="batch-checkbox"
            />
          </div>
        )}

        {isEditing ? (
          <input
            className="edit-input title-input"
            value={editData.question}
            onChange={(e) => handleChange('question', e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="输入题目..."
          />
        ) : (
          <h3 className="question-title">{data.question}</h3>
        )}

        {!isBatchMode && (
          <div className="header-controls">
            {!isEditing ? (
              <>
                <button className="icon-btn insert-btn" onClick={handleInsertClick} title="在下方插入新题">➕</button>
                <button className="icon-btn edit-btn" onClick={handleEditClick} title="编辑">✎</button>
                <button className="icon-btn delete-btn" onClick={handleDeleteClick} title="删除">🗑️</button>
                <span className="toggle-icon">{isOpen ? '−' : '+'}</span>
              </>
            ) : (
              <div className="edit-actions">
                <button className="save-btn" onClick={handleSaveClick}>保存</button>
                <button className="cancel-btn" onClick={handleCancelClick}>取消</button>
              </div>
            )}
          </div>
        )}
      </div>

      {isOpen && !isBatchMode && (
        <div className="question-content" onClick={(e) => e.stopPropagation()}>
          <div className="answer-section">
            <h4>参考答案：</h4>
            {isEditing ? (
              <textarea
                className="edit-textarea"
                value={editData.answer}
                onChange={(e) => handleChange('answer', e.target.value)}
                placeholder="输入参考答案..."
                rows={15}
              />
            ) : (
              <div className="answer-text">
                {data.answer ? (
                  <pre>{data.answer}</pre>
                ) : (
                  <p className="no-answer">暂无答案</p>
                )}
              </div>
            )}
          </div>

          {(data.detail || isEditing) && (
            <div className="detail-section-wrapper">
              {!isEditing && (
                <button className="detail-toggle-btn" onClick={toggleDetail}>
                  {showDetail ? '收起详解' : '查看详解'}
                </button>
              )}

              {(showDetail || isEditing) && (
                <div className="detail-content">
                  <h4>详解：</h4>
                  {isEditing ? (
                    <textarea
                      className="edit-textarea"
                      value={editData.detail}
                      onChange={(e) => handleChange('detail', e.target.value)}
                      placeholder="输入详解..."
                      rows={15}
                    />
                  ) : (
                    <pre>{data.detail}</pre>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionItem;
