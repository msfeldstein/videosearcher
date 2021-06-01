const fs = require("fs");
const { SubtitleParser } = require("matroska-subtitles");
const videoDir = "./public/videos/";
// afterwards each subtitle is emitted

function getTracksForFile(dir, file) {
  return new Promise((resolve, reject) => {
    const parser = new SubtitleParser();
    let subtitles = [];
    let activeTrack = 1;
    parser.once("tracks", (tracks) => {
      const englishTrack = tracks.find(
        (track) => track.name.toLowerCase() === "english"
      );
      if (englishTrack) {
        activeTrack = englishTrack.number;
      } else {
        throw "No english track found";
      }
    });
    // first an array of subtitle track information is emitted
    parser.on("subtitle", (subtitle, trackNumber) => {
      if (trackNumber === activeTrack) {
        subtitle.file = file;
        subtitle.text = subtitle.text.replace(/\r\n/g, " ");
        subtitles.push(subtitle);
      }
    });
    parser.on("finish", () => resolve(subtitles));
    fs.createReadStream(dir + file).pipe(parser);
  });
}
const videos = fs
  .readdirSync(videoDir)
  .filter((file) => file.indexOf("mkv") !== -1);
console.log("videos", videos);
Promise.all(videos.map((video) => getTracksForFile(videoDir, video))).then(
  (results) => {
    const subtitleFile = videoDir + "subtitle.json";
    fs.writeFileSync(subtitleFile, JSON.stringify(results.flat(), null, 2));
    console.log("Written to " + subtitleFile);
  }
);
