// remotion/fonts/index.js

import { loadFont } from "@remotion/fonts";

import ABeeZeeRegular from "./files/ABeeZee-Regular.ttf";
import ABeeZeeItalic from "./files/ABeeZee-Italic.ttf";
import BelgranoRegular from "./files/Belgrano-Regular.ttf";
import GaeguRegular from "./files/Gaegu-Regular.ttf";
import GaeguBold from "./files/Gaegu-Bold.ttf";
import GaeguLight from "./files/Gaegu-Light.ttf";
import GlutenBold from "./files/Gluten-Bold.ttf";
import GowunDodumRegular from "./files/GowunDodum-Regular.ttf";
import YujiSyukuRegular from "./files/YujiSyuku-Regular.ttf";
import InterBlack from "./files/Inter_18pt-Black.ttf";
import InterExtraBold from "./files/Inter_18pt-ExtraBold.ttf";
import InterExtraLight from "./files/Inter_18pt-ExtraLight.ttf";
import InterExtraLightItalic from "./files/Inter_18pt-ExtraLightItalic.ttf";
import InterLight from "./files/Inter_18pt-Light.ttf";
import InterMedium from "./files/Inter_18pt-Medium.ttf";
import InterRegular from "./files/Inter_18pt-Regular.ttf";
import InterThin from "./files/Inter_18pt-Thin.ttf";
import MarkoOneRegular from "./files/MarkoOne-Regular.ttf";
import MochiyPopOneRegular from "./files/MochiyPopOne-Regular.ttf";
import PermanentMarkerRegular from "./files/PermanentMarker-Regular.ttf";
import RalewayMedium from "./files/Raleway-Medium.ttf";
import RalewaySemiBold from "./files/Raleway-SemiBold.ttf";
import RalewayThin from "./files/Raleway-Thin.ttf";

const FONTS = {
  "ABeeZee-Regular": ABeeZeeRegular,
  "ABeeZee-Italic": ABeeZeeItalic,
  "Belgrano-Regular": BelgranoRegular,
  "Gaegu-Regular": GaeguRegular,
  "Gaegu-Bold": GaeguBold,
  "Gaegu-Light": GaeguLight,
  "Gluten-Bold": GlutenBold,
  "GowunDodum-Regular": GowunDodumRegular,
  "YujiSyuku-Regular": YujiSyukuRegular,
  "Inter_18pt-Black": InterBlack,
  "Inter_18pt-ExtraBold": InterExtraBold,
  "Inter_18pt-ExtraLight": InterExtraLight,
  "Inter_18pt-ExtraLightItalic": InterExtraLightItalic,
  "Inter_18pt-Light": InterLight,
  "Inter_18pt-Medium": InterMedium,
  "Inter_18pt-Regular": InterRegular,
  "Inter_18pt-Thin": InterThin,
  "MarkoOne-Regular": MarkoOneRegular,
  "MochiyPopOne-Regular": MochiyPopOneRegular,
  "PermanentMarker-Regular": PermanentMarkerRegular,
  "Raleway-Medium": RalewayMedium,
  "Raleway-SemiBold": RalewaySemiBold,
  "Raleway-Thin": RalewayThin,
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

