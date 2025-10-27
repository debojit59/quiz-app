import { useEffect, useReducer } from "react";
import Main from "./components/Main";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import { Question } from "./components/Question";
import StartScreen from "./components/StartScreen";
import Error from "./Error";
import Header from "./Header";
import Loader from "./Loader";

const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "received":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "Start":
      return { ...state, status: "active" };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextPage":
      return { ...state, index: state.index + 1, answer: null };

    default:
      throw new Error("Actions are not recieved ");
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { questions, status, index, answer, points } = state;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  const numQuestions = questions.length;
  useEffect(function () {
    async function fetchdata() {
      try {
        const res = await fetch(`http://localhost:8000/questions`);
        const json = await res.json();
        const data = dispatch({ type: "received", payload: json });
      } catch (error) {
        dispatch({ type: "error" });
      }
    }
    fetchdata();
  }, []);

  return (
    <>
      <div className="app">
        <Header />
        <Main>
          {status === "loading" && <Loader />}
          {status === "error" && <Error />}
          {status === "ready" && (
            <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
          )}
          {status === "active" && (
            <>
              <Progress
                index={index}
                numQuestions={numQuestions}
                maxPossiblePoints={maxPossiblePoints}
                points={points}
                answer={answer}
              />

              <Question
                questions={questions[index]}
                dispatch={dispatch}
                answer={answer}
              />
              <NextButton dispatch={dispatch} answer={answer} />
            </>
          )}
        </Main>
      </div>
    </>
  );
}

export default App;
