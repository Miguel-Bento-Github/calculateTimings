const calculateDuration = require("./util/calculate-duration");

/**
 * @returns A copy of `timingsData` with calculated `front_time`, `end_time`, and `back_time` fields.
 */
const calculateTimings = (episodeData, timingsData) => {
  // Parts
  const { part: newTimingPart, item: newTimingItem } = timingsData;
  const { parts: episodePartsIds } = episodeData.episode;

  // Set initial timings for the first part
  const [firstPartId] = episodePartsIds;
  const firstPartTiming = newTimingPart[firstPartId];

  // First Part Front Time
  // The Front Time of the first Part in an Episode is the same as the (Episode) On Air Time.
  firstPartTiming.front_time = timingsData.episode.on_air_time;
  // First Part End Time
  // The End Time of the first Part in an Episode is the same as the (Episode) On Air Time + Part Estimated Duration
  firstPartTiming.end_time =
    timingsData.episode.on_air_time +
    calculateDuration(firstPartTiming.estimated_duration);

  for (let i = 0; i < episodePartsIds.length; i++) {
    // Get current and previous part index
    const currentPartId = episodePartsIds[i];
    const previousPartId = episodePartsIds[i - 1];
    const currentTimings = newTimingPart[currentPartId];

    // Check if it's not the first item in the array
    // if (i) in this scenario is the same as if(i > 0)
    if (i) {
      // Get timing data for current and previous parts
      const previousTimings = newTimingPart[previousPartId];
      if (!previousTimings.front_time) return;

      // Part Front Time:
      // Previous front time + previous estimated duration
      currentTimings.front_time =
        previousTimings.front_time +
        calculateDuration(previousTimings.estimated_duration);

      // Part End Time:
      // Current front time + current estimated duration
      currentTimings.end_time =
        currentTimings.front_time +
        calculateDuration(currentTimings.estimated_duration);
    }

    // Question: How do I know the original Back Time?
    // I'm making an assumption by using the current part `front_time`
    if (currentTimings?.back_time) {
      currentTimings.back_time =
        currentTimings.back_time +
        calculateDuration(currentTimings.estimated_duration);
    } else if (!currentTimings?.back_time) {
      currentTimings.back_time = currentTimings.front_time;
    }

    const { items: currentItemsId } = episodeData.part[currentPartId];
    const [firstItemId] = currentItemsId;
    // Item Front Time:
    // The Front Time of the first Item in a Part is the same as the Front Time of the Part it belongs to.
    newTimingItem[firstItemId].front_time =
      newTimingPart[currentPartId].front_time;

    for (let j = 0; j < currentItemsId.length; j++) {
      const currentItemId = currentItemsId[j];
      const previousItemId = currentItemsId[j - 1];
      const currentItemTiming = newTimingItem[currentItemId];

      if (j) {
        const previousItemTiming = newTimingItem[previousItemId];
        if (!previousItemTiming.front_time) return;

        currentItemTiming.front_time =
          previousItemTiming.front_time +
          calculateDuration(previousItemTiming.estimated_duration);
      }

      if (!currentItemTiming.front_time) return;
      currentItemTiming.end_time =
        currentItemTiming.front_time +
        calculateDuration(currentItemTiming.estimated_duration);
    }
  }

  // Part Back Time:
  // Set initial back time for the last part
  // The Back Time of the last Part in an Episode is the same as the (Episode) Off Air Time - Part Estimated Duration
  const lastPart = newTimingPart[episodePartsIds[episodePartsIds.length - 1]];
  lastPart.back_time =
    timingsData.episode.off_air_time -
    calculateDuration(lastPart.estimated_duration);

  for (let i = episodePartsIds.length - 1; i >= 0; i--) {
    const currentPartId = episodePartsIds[i];

    const partItemsId = episodeData.part[currentPartId].items;
    for (let j = partItemsId.length - 1; j >= 0; j--) {
      const currentItem = timingsData.item[partItemsId[j]];
      if (j === partItemsId.length - 1) {
        // Item Back Part:
        // The Back Time of the last Item in a Part is the same as the End Time of the Part it belongs to.
        const lastPartBackTime = newTimingPart[currentPartId];
        currentItem.back_time = lastPartBackTime.end_time;
      } else {
        const previousItem = timingsData.item[partItemsId[j + 1]];
        if (!previousItem.back_time) return;

        currentItem.back_time =
          previousItem.back_time -
          calculateDuration(previousItem.estimated_duration);
      }
    }
  }

  return timingsData;
};

module.exports = calculateTimings;
