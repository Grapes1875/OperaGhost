import React from 'react';

function Square({ chooseSquare, val, marked }) {
  return (
    <div className={`square ${marked ? 'checked' : ''}`} onClick={chooseSquare}>
      {val}
    </div>
  );
}

export default Square;
