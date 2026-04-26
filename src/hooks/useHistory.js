import { useCallback, useState } from 'react';

const useHistory = (initialState) => {
  const [history, setHistory] = useState([initialState]);
  const [index, setIndex] = useState(0);

  const undo = useCallback(() => {
    setIndex((current) => Math.max(0, current - 1));
  }, []);

  const redo = useCallback(() => {
    setIndex((current) => Math.min(history.length - 1, current + 1));
  }, [history.length]);

  const push = useCallback((state) => {
    const nextHistory = history.slice(0, index + 1).concat([state]);
    setHistory(nextHistory);
    setIndex(nextHistory.length - 1);
  }, [history, index]);

  return {
    state: history[index],
    undo,
    redo,
    push,
  };
};

export default useHistory;
