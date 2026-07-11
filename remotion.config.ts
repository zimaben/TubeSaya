
import { Config } from "@remotion/cli/config";
import path from "path";

Config.setVideoImageFormat("png");
Config.setPixelFormat("yuva444p10le");
Config.setCodec("prores");
Config.setProResProfile("4444");
Config.setPublicDir(path.join(process.cwd(), "src/assets"));
