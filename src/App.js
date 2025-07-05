import React, { useState } from 'react';
import './App.css';

function App() {
  // 9:00〜17:00の30分刻み
  const times = Array.from({ length: 17 }, (_, i) => {
    const hour = 9 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour}:${minute}`;
  });

  const getWeekDates = (offset = 0) => {
    const today = new Date();
    const sunday = new Date(today);
    sunday.setDate(sunday.getDate() - sunday.getDay() + offset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);
      const mmdd = date.toLocaleDateString('ja-JP', {
        month: '2-digit',
        day: '2-digit',
      });
      const dayName = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
      return `${mmdd}(${dayName})`;
    });
  };

  const [offset, setOffset] = useState(0);
  const days = getWeekDates(offset);
  const [slots, setSlots] = useState(
    Array.from({ length: times.length }, () =>
      Array(days.length).fill('available')
    )
  );

  const toggleSlot = (rowIdx, colIdx) => {
    setSlots(prev => {
      const newSlots = prev.map(row => [...row]);
      newSlots[rowIdx][colIdx] =
        newSlots[rowIdx][colIdx] === 'available' ? 'unavailable' : 'available';
      return newSlots;
    });
  };

  return (
    <div>
      <h2>予約空き状況（週間カレンダー 9:00〜17:00）</h2>
      <div style={{fontSize: '13px', marginBottom: '6px'}}>クリックで○／×切り替え</div>
      <div style={{ textAlign: 'center', margin: '10px 0' }}>
        <button onClick={() => setOffset(offset - 1)}>← 前の週</button>
        <button onClick={() => setOffset(0)} style={{ margin: '0 10px' }}>今週</button>
        <button onClick={() => setOffset(offset + 1)}>次の週 →</button>
      </div>
      <table className="reservation-table">
        <thead>
          <tr>
            <th>時間＼日</th>
            {days.map((day, colIdx) => (
              <th key={colIdx}>
                <div className="day-header">
                  <span>{day.slice(0, 5)}</span>  {/* 例: 07/01 */}
                  <span>{day.slice(6)}</span>      {/* 例: (火) */}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((time, rowIdx) => (
            <tr key={rowIdx}>
              <td>{time}</td>
              {days.map((_, colIdx) => {
                const status = slots[rowIdx][colIdx] === 'available' ? '○' : '×';
                return (
                  <td
                    key={colIdx}
                    className={slots[rowIdx][colIdx] === 'available' ? 'available' : 'unavailable'}
                    onClick={() => toggleSlot(rowIdx, colIdx)}
                  >
                    <span className="status-circle">{status}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
