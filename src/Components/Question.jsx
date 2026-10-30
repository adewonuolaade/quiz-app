export default function Question({ data, selected, onSelect }) {
  const answered = selected !== null;

  const getClass = (index) => {
    if (!answered) return "option";
    if (index === data.answer) return "option correct";
    if (index === selected) return "option wrong";
    return "option disabled";
  };

  return (
    <div>
      <h2 className="question">{data.question}</h2>
      <div className="options">
        {data.options.map((opt, i) => (
          <button
            key={i}
            className={getClass(i)}
            onClick={() => onSelect(i)}
            disabled={answered}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}