import React, { useState } from 'react';
import useWhiteboardStore from '../store/whiteboardStore';
import './BoardSelector.css';

const BoardSelector = () => {
  const { boards, currentBoardId, setCurrentBoardId, addBoard, renameBoard } = useWhiteboardStore();
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const handleRename = (id) => {
    if (editName.trim()) {
      renameBoard(id, editName);
    }
    setEditingId(null);
  };

  return (
    <div className="board-selector">
      <div className="board-selector-header">
        <h3>Boards</h3>
        <button className="add-board-btn" onClick={() => addBoard()}>
          +
        </button>
      </div>
      <div className="board-list">
        {Object.values(boards).map((board) => (
          <div
            key={board.id}
            className={`board-item ${currentBoardId === board.id ? 'active' : ''}`}
            onClick={() => setCurrentBoardId(board.id)}
          >
            {editingId === board.id ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={() => handleRename(board.id)}
                onKeyDown={(e) => e.key === 'Enter' && handleRename(board.id)}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <>
                <span className="board-name">{board.name}</span>
                <button
                  className="rename-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(board.id);
                    setEditName(board.name);
                  }}
                >
                  ✏️
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardSelector;
