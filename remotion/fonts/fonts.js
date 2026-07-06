// remotion/fonts/index.js

import { loadFont } from "@remotion/fonts";

import ABeeZeeRegular from "./files/ABeeZee-Regular.ttf";
import ABeeZeeItalic from "./files/ABeeZee-Italic.ttf";
import BelgranoRegular from "./files/Belgrano-Regular.ttf";
import GaeguRegular from "./files/Gaegu-Regular.ttf";
import GaeguBold from "./files/Gaegu-Bold.ttf";
import GaeguLight from "./files/Gaegu-Light.ttf";
import GowunDodumRegular from "./files/GowunDodum-Regular.ttf";
import YujiSyukuRegular from "./files/YujiSyuku-Regular.ttf";

const FONTS = {
  "ABeeZee-Regular": ABeeZeeRegular,
  "ABeeZee-Italic": ABeeZeeItalic,
  "Belgrano-Regular": BelgranoRegular,
  "Gaegu-Regular": GaeguRegular,
  "Gaegu-Bold": GaeguBold,
  "Gaegu-Light": GaeguLight,
  "GowunDodum-Regular": GowunDodumRegular,
  "YujiSyuku-Regular": YujiSyukuRegular,
};

Object.entries(FONTS).forEach(([family, url]) => {
  loadFont({
    family,
    url,
  });
});

export const resolveFont = (fontName) => {
  return FONTS[fontName] ? fontName : "sans-serif";
};


// import { loadFont } from "@remotion/fonts";

// const FONT_NAMES = [
//   "ABeeZee-Regular",
//   "ABeeZee-Italic",
//   "Belgrano-Regular",
//   "Gaegu-Regular",
//   "Gaegu-Bold",
//   "Gaegu-Light",
//   "GowunDodum-Regular",
// ];

// export const FONTS = {};

// FONT_NAMES.forEach((fontName) => {
//   loadFont({
//     family: fontName,
//     url: new URL(`./files/${fontName}.ttf`, import.meta.url).href,
//   });

//   FONTS[fontName] = fontName;
// });

// export const resolveFont = (fontName) => {
//   return FONTS[fontName] || "sans-serif";
// };