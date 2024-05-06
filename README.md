# Cuez

## How to

To see the output of `calculateTimings(episodeData, timingsData)` with Node.js run the command:
`node main.js`

## Steps taken

This was originally written with Typescript and ES6+ on the browser with Vite but since no external libraries are allowed, everything has been converted to JS so that it can be used directly on the command line.

The sketch idea can be found at https://stackblitz.com/edit/vitejs-vite-yidhec?file=src%2Fmain.ts

To better understand the outcome of my process I used visual help by converting the timestamps to Date with the `Intl` API, this method was written as

```ts
/**
 * Converts a Unix timestamp to a formatted date string.
 *
 * @param timestamp The Unix timestamp to convert, represented in seconds.
 * @returns A formatted date string representing the given timestamp
 */
export const timestampToDate = (timestamp?: number) => {
  if (!timestamp) return;
  // For brevity I'll be using hard-coded options but these should be taken from elsewhere
  const options: Intl.DateTimeFormatOptions = {
    timeStyle: "medium",
    timeZone: "UTC",
    hour12: false, // avoid mixups by preventing 12h clock
  };
  const dateTimeFormat = new Intl.DateTimeFormat("en-US", options);

  return dateTimeFormat.format(new Date(timestamp * 1000));
};
```

## File structure

```
.
├── README.md
├── calculateTimings.js
├── data
│   ├── episode.json
│   └── timings.json
├── main.js
└── util
    └── timestamp-to-date.js
```
