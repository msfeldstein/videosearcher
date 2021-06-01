import "./App.css";
import { useEffect, useMemo, useRef, useState } from "react";
import Results from "./Results";

function App() {
  const [query, setQuery] = useState("");
  const [subtitles, setSubtitles] = useState([]);
  const videoRef = useRef();

  useEffect(() => {
    async function parse() {
      const response = await fetch("./videos/subtitle.json");
      const json = await response.json();
      console.log(json);
      setSubtitles(json);
    }
    parse();
  }, []);
  if (subtitles.length === 0) {
    return <div>Loading</div>;
  }

  const matches =
    query.length < 3
      ? []
      : subtitles.filter((subtitle) => {
          return (
            subtitle.text.toLowerCase().indexOf(query.toLowerCase()) !== -1
          );
        });

  const resultClick = (result) => {
    console.log(result);
    const video = videoRef.current;
    const src = "./videos/" + result.file;
    console.log("SRC", src);
    video.src = src.replace("mkv", "mp4");
    video.play();
    function loaded() {
      video.currentTime = result.time / 1000;
      video.removeEventListener("loadeddata", loaded);
    }
    video.addEventListener("loadeddata", loaded);
  };
  return (
    <div className="App">
      <video controls ref={videoRef}></video>
      <div>
        <input
          className="search-box"
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
      </div>
      <Results onResultClick={resultClick} results={matches} />
    </div>
  );
}

export default App;
