import React from "react";

const ResultList = ({ result, onResultClick }) => {
  return (
    <div
      onClick={() => onResultClick(result)}
      className="result-item"
      key={result.file + result.time}
    >
      {result.text}
    </div>
  );
};
export default function Results(props) {
  const results = props.results;
  const onResultClick = props.onResultClick;
  return (
    <div className="result-list">
      {results.map((r) => (
        <ResultList onResultClick={onResultClick} result={r} />
      ))}
    </div>
  );
}
