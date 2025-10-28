export default function NextButton({ dispatch, answer, numQuestions, index }) {
  if (answer === null) return null;
  if (index < numQuestions - 1)
    return (
      <div>
        <button
          className="btn btn-ui"
          onClick={() => dispatch({ type: "nextPage" })}
        >
          Next
        </button>
      </div>
    );

  if (index === numQuestions - 1)
    return (
      <div>
        <button
          className="btn btn-ui"
          onClick={() => dispatch({ type: "finish" })}
        >
          Finish
        </button>
      </div>
    );
}
