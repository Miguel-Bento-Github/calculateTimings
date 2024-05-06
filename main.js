const episodeData = require("./data/episode.json");
const timingsData = require("./data/timings.json");
const calculateTimings = require("./calculate-timings");

const timings = calculateTimings(episodeData, timingsData);
console.log(timings);
