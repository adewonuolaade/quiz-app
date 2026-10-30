import { useState, useEffect } from "react";
import questions from "./data/questions";
import Question from "./Components/Question";
import Result from "./Components/Result";

const TIME_LIMIT = 15; // seconds per question, change this if you like

// Returns a new array in random order
function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function App() {
  const [quizQuestions, setQuizQuestions] = useState(() => shuffle(questions));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null); // null = not answered, -1 = time ran out
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem("quizHighScore")) || 0;
  });
  const [newRecord, setNewRecord] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (finished || selected !== null) return;

    const id = setTimeout(() => {
      if (timeLeft <= 1) {
        setTimeLeft(0);
        setSelected(-1); // time is up
      } else {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);

    return () => clearTimeout(id);
  }, [timeLeft, selected, finished]);

  const handleSelect = (index) => {
    setSelected(index);
    if (index === quizQuestions[current].answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (current + 1 < quizQuestions.length) {
      setCurrent(current + 1);
      setSelected(null);
      setTimeLeft(TIME_LIMIT);
    } else {
      // Quiz is over: check the high score
      if (score > highScore) {
        setHighScore(score);
        setNewRecord(true);
        localStorage.setItem("quizHighScore", String(score));
      }
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setQuizQuestions(shuffle(questions));
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setTimeLeft(TIME_LIMIT);
    setNewRecord(false);
  };

  const progress =
    ((current + (selected !== null ? 1 : 0)) / quizQuestions.length) * 100;

  return (
    <div className="app">
      <div className="card">
        <h1>React Quiz</h1>

        {finished ? (
          <Result
            score={score}
            total={quizQuestions.length}
            highScore={highScore}
            newRecord={newRecord}
            onRestart={handleRestart}
          />
        ) : (
          <>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${progress}%` }} />
            </div>

            <div className="top-row">
              <p className="counter">
                Question {current + 1} of {quizQuestions.length}
              </p>
              <p className={timeLeft <= 5 ? "timer low" : "timer"}>
                ⏱ {timeLeft}s
              </p>
            </div>

            <Question
              data={quizQuestions[current]}
              selected={selected}
              onSelect={handleSelect}
            />

            {selected === -1 && <p className="time-up">Time's up!</p>}

            <button
              className="primary"
              onClick={handleNext}
              disabled={selected === null}
            >
              {current + 1 === quizQuestions.length ? "Finish" : "Next"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}