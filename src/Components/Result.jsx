export default function Result({ score, total, highScore, newRecord, onRestart }) {
  const percent = Math.round((score / total) * 100);

  let message = "Keep practicing!";
  if (percent >= 80) message = "Excellent work! 🎉";
  else if (percent >= 50) message = "Good job! 👍";

  return (
    <div className="result">
      <h2>Quiz Complete</h2>
      <p className="score">
        {score} / {total}
      </p>
      <p>
        {percent}% – {message}
      </p>

      {newRecord && <p className="record">🏆 New high score!</p>}
      <p className="high-score">
        High score: {highScore} / {total}
      </p>

      <button className="primary" onClick={onRestart}>
        Restart Quiz
      </button>
    </div>
  );
}