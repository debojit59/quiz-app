import { useEffect, useReducer } from "react";
import FinishScreen from "./components/FinishScreen";
import Footer from "./components/Footer";
import Main from "./components/Main";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import { Question } from "./components/Question";
import StartScreen from "./components/StartScreen";
import Timer from "./components/Timer";
import Error from "./Error";
import Header from "./Header";
import Loader from "./Loader";

// ⬇️ Using local JSON so it works in production (no localhost needed)
import questions from "./questions.json";

const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondRemaning: null,
};

const q_Sec = 30;

function reducer(state, action) {
  switch (action.type) {
    case "received":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "Start":
      return {
        ...state,
        status: "active",
        secondRemaning: state.questions.length * q_Sec,
      };
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
    case "prevPage":
      return { ...state, index: state.index - 1, answer: null };

    case "finish":
      return {
        ...state,
        status: "finish",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    case "reset":
      return {
        ...initialState,
        status: "ready",
        questions: state.questions,
      };

    case "tick":
      return {
        ...state,
        secondRemaning: state.secondRemaning - 1,
        status: state.secondRemaning === 0 ? "finish" : state.status,
      };

    default:
      throw new Error("Actions are not recieved ");
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    questions: qs,
    status,
    index,
    answer,
    points,
    highScore,
    secondRemaning,
  } = state;

  const maxPossiblePoints = qs.reduce((prev, cur) => prev + cur.points, 0);
  const numQuestions = qs.length;

  // ⬇️ Replace localhost fetch with local JSON dispatch
  useEffect(function () {
    // if your questions.json is { "questions": [...] }
    dispatch({ type: "received", payload: questions.questions });
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
                questions={qs[index]}
                dispatch={dispatch}
                answer={answer}
              />
              <Footer>
                <Timer secondRemaning={secondRemaning} dispatch={dispatch} />
                <NextButton
                  dispatch={dispatch}
                  answer={answer}
                  numQuestions={numQuestions}
                  index={index}
                />
                {index > 0 && (
                  <button
                    className="btn btn-ui"
                    onClick={() => dispatch({ type: "prevPage" })}
                  >
                    Prev
                  </button>
                )}
              </Footer>
            </>
          )}
          {status === "finish" && (
            <FinishScreen
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              highScore={highScore}
              dispatch={dispatch}
            />
          )}
        </Main>
      </div>
    </>
  );
}

export default App;
