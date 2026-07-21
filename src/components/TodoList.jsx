import React, { useState, useEffect } from 'react';

function TodoList() {
  // 1. 初始化狀態：先檢查 localStorage 有沒有舊資料，若有就載入，沒有就用空陣列
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('persist_todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [inputValue, setInputValue] = useState('');

  // 2. 監聽 todos 的變化：只要 todos 有任何變動（新增、刪除、完成），就同步寫入 localStorage
  useEffect(() => {
    localStorage.setItem('persist_todos', JSON.stringify(todos));
  }, [todos]);

  // 新增待辦事項
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      completedAt: null // 用來記錄完成時間
    };

    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  // 切換完成狀態並記錄時間
  const handleToggleComplete = (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        const isCurrentlyCompleted = !todo.completed;
        return {
          ...todo,
          completed: isCurrentlyCompleted,
          // 如果標記為完成，紀錄當下時間；若取消完成，則清空時間
          completedAt: isCurrentlyCompleted ? new Date().toLocaleString() : null
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  // 刪除待辦事項
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>永久儲存的待辦清單</h2>
      
      <form onSubmit={handleAddTodo} style={{ display: 'flex', marginBottom: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="輸入待辦事項..."
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', marginLeft: '8px' }}>新增</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <div>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id)}
                style={{ marginRight: '8px' }}
              />
              <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#c1d0eb' : '#efffa5' }}>
                {todo.text}
              </span>
              {todo.completed && todo.completedAt && (
                <div style={{ fontSize: '12px', color: 'white', marginLeft: '24px' }}>
                  ✓ 完成於: {todo.completedAt}
                </div>
              )}
            </div>
            <button onClick={() => handleDeleteTodo(todo.id)} style={{ background: 'red', color: 'white', border: 'none', padding: '4px 8px', cursor: 'pointer' }}>
              刪除
            </button>
          </li>
        ))}
      </ul>
      
    </div>
  );
}

export default TodoList;