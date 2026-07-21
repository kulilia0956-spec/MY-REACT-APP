import React, { useState, useEffect } from 'react';

function FocusApp() {
  // --- 1. 定義 State ---
  // 專注時間設定（為了測試方便，設為 5 秒，實際可用 25 分鐘 = 1500 秒）
  const FOCUS_TIME = 5; 

  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  
  const [completedCount, setCompletedCount] = useState(() => {
    const saved = localStorage.getItem('focus_count');
    return saved ? JSON.parse(saved) : 0;
  });

  // --- 2. 定義 useEffect ---

  // 【useEffect 應用一】：處理倒數計時器 與 音效播放
  useEffect(() => {
    let timer = null;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } 
    // ⭐【核心修改點】：當時間倒數完畢時
    else if (timeLeft === 0) {
      setIsRunning(false);

      // --- 👇 新增：播放提示音效 👇 ---
      // 這裡使用一個線上的清脆鈴聲作為範例
      const audioUrl = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';
      const notificationSound = new Audio(audioUrl);
      
      // 播放音效 (注意：部分瀏覽器可能需要使用者先與頁面互動才能播放)
      notificationSound.play()
        .catch(error => console.error("音效播放失敗 (可能是瀏覽器權限限制):", error));
      // --- 👆 新增結束 👆 ---

      setCompletedCount((prevCount) => prevCount + 1);
      setTimeLeft(FOCUS_TIME); 
      
      // 延遲一點點跳出 alert，讓音效先動
      setTimeout(() => {
        alert('🎉 太棒了！完成了一次專注時間！');
      }, 100);
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);


  // 【useEffect 應用二】：將完成次數同步到 localStorage (維持不變)
  useEffect(() => {
    localStorage.setItem('focus_count', JSON.stringify(completedCount));
  }, [completedCount]);


  // --- 3. 功能函式 (維持不變) ---
  const handleResetStorage = () => {
    setCompletedCount(0);
    localStorage.removeItem('focus_count');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };


  // --- 4. JSX 畫面 (維持不變) ---
  return (
    <div style={{ maxWidth: '350px', margin: '50px auto', padding: '20px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '12px', fontFamily: 'sans-serif', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <h2>⏱️ 專注鐘 (含音效)</h2>

      <div style={{ fontSize: '48px', fontWeight: 'bold', margin: '20px 0', color: isRunning ? '#2b8a3e' : '#333' }}>
        {formatTime(timeLeft)}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setIsRunning(!isRunning)}
          style={{ padding: '10px 20px', fontSize: '16px', marginRight: '10px', cursor: 'pointer', borderRadius: '6px', border: 'none', backgroundColor: isRunning ? '#ff6b6b' : '#51cf66', color: 'white' }}
        >
          {isRunning ? '暫停' : '開始專注'}
        </button>
        <button 
          onClick={() => { setIsRunning(false); setTimeLeft(FOCUS_TIME); }}
          style={{ padding: '10px 15px', fontSize: '16px', cursor: 'pointer', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#f8f9fa' }}
        >
          重置
        </button>
      </div>

      <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />

      <div>
        <h3>🏆 累計專注次數：{completedCount} 次</h3>
        <p style={{ fontSize: '12px', color: '#666' }}>（即便重新整理頁面或關閉瀏覽器，紀錄依然會保留！）</p>
        <button 
          onClick={handleResetStorage}
          style={{ padding: '4px 8px', fontSize: '12px', cursor: 'pointer', color: '#999', background: 'none', border: 'none', textDecoration: 'underline' }}
        >
          清空歷史戰績
        </button>
      </div>
    </div>
  );
}

export default FocusApp;