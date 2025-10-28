import { useEffect } from "react";

export default function Timer({ secondRemaning, dispatch }) {
  useEffect(
    function () {
      const id = setInterval(function () {
        dispatch({ type: "tick" });
      }, 1000);
      return () => clearInterval(id);
    },
    [dispatch]
  );
  return <div className="timer">{secondRemaning}</div>;
}
