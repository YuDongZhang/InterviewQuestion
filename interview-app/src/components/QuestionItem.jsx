import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { marked } from 'marked';

const TOOLBAR_COLORS = [
  '#000000', '#434343', '#666666', '#999999',
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#0ea5e9', '#6366f1', '#a855f7', '#ec4899',
];

const textToHtml = (text) => {
  if (!text) return '';
  if (/<[a-z][\s\S]*>/i.test(text)) return text;
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
};

const QuestionItem = ({ data, onUpdate, onDelete, onInsert, isBatchMode, isSelected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(data);
  const [showDetail, setShowDetail] = useState(false);
  const [showHeadings, setShowHeadings] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const answerRef = useRef(null);

  useEffect(() => {
    setEditData(data);
  }, [data]);

  useEffect(() => {
    if (isEditing && answerRef.current) {
      answerRef.current.innerHTML = textToHtml(editData.answer);
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.heading-dropdown-wrapper')) setShowHeadings(false);
      if (!e.target.closest('.color-dropdown-wrapper')) setShowColorPicker(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    const updatedData = { ...editData };
    if (answerRef.current) {
      updatedData.answer = answerRef.current.innerHTML;
    }
    onUpdate(updatedData);
    setIsEditing(false);
    setShowHeadings(false);
    setShowColorPicker(false);
  };

  const handleCancelClick = (e) => {
    e.stopPropagation();
    setEditData(data);
    setIsEditing(false);
    setShowHeadings(false);
    setShowColorPicker(false);
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

  const execFormat = (command, value = null) => {
    answerRef.current?.focus();
    document.execCommand(command, false, value);
  };

  const looksLikeMarkdown = (text) => {
    return /^#{1,6}\s|^\s*[-*+]\s|^\s*\d+\.\s|^\s*>|```|\*\*.+\*\*|^\|.+\|/m.test(text);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');
    if (text && looksLikeMarkdown(text)) {
      const converted = marked.parse(text, { breaks: true, gfm: true });
      document.execCommand('insertHTML', false, converted);
    } else if (html) {
      document.execCommand('insertHTML', false, html);
    } else if (text) {
      document.execCommand('insertText', false, text);
    }
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
            <div className="answer-header">
              <h4>参考答案：</h4>
              {isEditing && (
                <div className="rich-toolbar">
                  <div className="toolbar-item heading-dropdown-wrapper">
                    <button
                      className="toolbar-btn heading-btn"
                      onClick={() => { setShowHeadings(!showHeadings); setShowColorPicker(false); }}
                    >
                      标题 <span className="dropdown-arrow">▾</span>
                    </button>
                    {showHeadings && (
                      <div className="toolbar-dropdown heading-menu">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                          <button
                            key={i}
                            className="heading-option"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              execFormat('formatBlock', `h${i}`);
                              setShowHeadings(false);
                            }}
                          >
                            <span style={{ fontSize: `${1.5 - i * 0.12}rem`, fontWeight: 600 }}>
                              H{i} 标题{i}
                            </span>
                          </button>
                        ))}
                        <button
                          className="heading-option"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            execFormat('formatBlock', 'p');
                            setShowHeadings(false);
                          }}
                        >
                          <span>正文</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="toolbar-divider" />
                  <button
                    className="toolbar-btn bold-btn"
                    onMouseDown={(e) => { e.preventDefault(); execFormat('bold'); }}
                    title="加粗"
                  >
                    <b>B</b>
                  </button>
                  <button
                    className="toolbar-btn italic-btn"
                    onMouseDown={(e) => { e.preventDefault(); execFormat('italic'); }}
                    title="斜体"
                  >
                    <i>I</i>
                  </button>
                  <button
                    className="toolbar-btn underline-btn"
                    onMouseDown={(e) => { e.preventDefault(); execFormat('underline'); }}
                    title="下划线"
                  >
                    <u>U</u>
                  </button>
                  <div className="toolbar-item color-dropdown-wrapper">
                    <button
                      className="toolbar-btn color-btn"
                      onClick={() => { setShowColorPicker(!showColorPicker); setShowHeadings(false); }}
                      title="字体颜色"
                    >
                      <span className="color-a">A</span>
                    </button>
                    {showColorPicker && (
                      <div className="toolbar-dropdown color-palette">
                        {TOOLBAR_COLORS.map(c => (
                          <button
                            key={c}
                            className="color-swatch"
                            style={{ backgroundColor: c }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              execFormat('foreColor', c);
                              setShowColorPicker(false);
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {isEditing ? (
              <div
                key="editor"
                ref={answerRef}
                className="rich-editor"
                contentEditable
                suppressContentEditableWarning
                onInput={() => handleChange('answer', answerRef.current.innerHTML)}
                onPaste={handlePaste}
              />
            ) : (
              <div key="display" className="answer-text">
                {data.answer ? (
                  <div className="answer-html" dangerouslySetInnerHTML={{ __html: textToHtml(data.answer) }} />
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
                    <div className="markdown-body">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {data.detail}
                      </ReactMarkdown>
                    </div>
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
