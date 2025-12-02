import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import QuestionList from './components/QuestionList';
import AnimationList from './components/AnimationList';
import defaultQuestionsData from './data/questions.json';
import knowledgeData from './data/knowledge.json';

function App() {
  const [mode, setMode] = useState('questions'); // 'questions' or 'knowledge'
  const [activeCategory, setActiveCategory] = useState('android');
  const [questionsData, setQuestionsData] = useState(defaultQuestionsData);

  // Save to file system via API
  const saveQuestions = async (newData) => {
    console.log('Saving questions...', newData);
    try {
      const response = await fetch('/api/save-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });
      const result = await response.json();
      console.log('Save result:', result);
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Failed to save questions:', error);
      alert('保存失败，请检查控制台');
    }
  };

  const currentData = mode === 'questions' ? questionsData : knowledgeData;
  const currentQuestions = currentData[activeCategory] || [];

  const handleUpdateQuestion = (index, updatedQuestion) => {
    const newQuestions = [...currentQuestions];
    newQuestions[index] = updatedQuestion;
    const newData = {
      ...questionsData,
      [activeCategory]: newQuestions
    };
    setQuestionsData(newData);
    if (mode === 'questions') {
      saveQuestions(newData);
    }
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      question: "新题目",
      answer: "",
      detail: ""
    };
    const newData = {
      ...questionsData,
      [activeCategory]: [newQuestion, ...currentQuestions]
    };
    setQuestionsData(newData);
    if (mode === 'questions') {
      saveQuestions(newData);
    }
  };

  const handleDeleteQuestion = (index) => {
    if (window.confirm('确定要删除这道题吗？')) {
      const newQuestions = currentQuestions.filter((_, i) => i !== index);
      const newData = {
        ...questionsData,
        [activeCategory]: newQuestions
      };
      setQuestionsData(newData);
      if (mode === 'questions') {
        saveQuestions(newData);
      }
    }
  };

  const handleBatchDelete = (indices) => {
    if (indices.length === 0) return;
    if (window.confirm(`确定要删除选中的 ${indices.length} 道题目吗？`)) {
      const newQuestions = currentQuestions.filter((_, i) => !indices.includes(i));
      const newData = {
        ...questionsData,
        [activeCategory]: newQuestions
      };
      setQuestionsData(newData);
      if (mode === 'questions') {
        saveQuestions(newData);
      }
    }
  };

  const handleInsertQuestion = (index) => {
    const newQuestion = {
      question: "新题目",
      answer: "",
      detail: ""
    };
    const newQuestions = [...currentQuestions];
    newQuestions.splice(index + 1, 0, newQuestion);
    const newData = {
      ...questionsData,
      [activeCategory]: newQuestions
    };
    setQuestionsData(newData);
    if (mode === 'questions') {
      saveQuestions(newData);
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        mode={mode}
        onSwitchMode={(newMode) => {
          setMode(newMode);
          // Reset category when switching modes
          if (newMode === 'knowledge') {
            setActiveCategory('flutter');
          } else {
            setActiveCategory('android');
          }
        }}
      />
      <main className="main-content">
        {activeCategory === 'animations' ? (
          <AnimationList />
        ) : (
          <QuestionList
            questions={currentQuestions}
            category={activeCategory}
            onUpdateQuestion={handleUpdateQuestion}
            onAddQuestion={handleAddQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onBatchDelete={handleBatchDelete}
            onInsertQuestion={handleInsertQuestion}
          />
        )}
      </main>
    </div>
  );
}

export default App;
