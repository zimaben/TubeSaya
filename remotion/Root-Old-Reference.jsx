import { Composition, staticFile } from "remotion";
import { AnimateText } from "./compositions/AnimateText/AnimateText";
import { AnimateImage } from "./compositions/AnimateImage/AnimateImage";
import "./fonts";


export const Root = () => {
  return (
    // <Composition
    //   id="AnimateText"
    //   component={AnimateText}
    //   width={1920}
    //   height={1080}
    //   fps={30}
    //   durationInFrames={120} // 30 FPS
    //   defaultProps={{
    //     text: "Episode 1: Dirt",
    //    // font:"Gaegu-Bold",
    //     font:"Belgrano-Regular",
    //     yPosition: "bottom",
    //     fontSize:112,
    //     fontColor: "#EE4266",
    //     outlineColor: "transparent",
    //    // animation: "dance",
    //     animation: "typewriter",
    //   }}
    // />

    <Composition
      id="AnimateImage"
      component={AnimateImage}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={320}
      defaultProps={{
        src: staticFile("imgs/TitleCard-fixed.png"),
        width: 600,
        xPosition: "center",
        yPosition: "center",
        animation: "bounceIn",
      }}
    />
  );
};