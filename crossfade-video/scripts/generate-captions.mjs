import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import {
  installWhisperCpp,
  downloadWhisperModel,
  transcribe,
  toCaptions,
} from "@remotion/install-whisper-cpp";

const to = path.join(process.cwd(), "whisper.cpp");
const modelFolder = path.join(to, "models");
const VERSION = "1.5.5";
const MODEL = "tiny.en";

console.log("== Installing whisper.cpp ==");
const installResult = await installWhisperCpp({ to, version: VERSION });
console.log(installResult);

console.log("== Ensuring model is present ==");
const modelResult = await downloadWhisperModel({
  model: MODEL,
  folder: modelFolder,
});
console.log(modelResult);

const inputMp4 = path.join(process.cwd(), "public", "speech_test.mp4");
const wavPath = path.join(process.cwd(), "public", "speech_test.wav");

console.log("== Converting mp4 to 16kHz wav ==");
execSync(
  `./node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg -i "${inputMp4}" -ar 16000 -ac 1 "${wavPath}" -y`,
  { stdio: "inherit" },
);

console.log("== Transcribing ==");
const whisperCppOutput = await transcribe({
  model: MODEL,
  whisperPath: to,
  whisperCppVersion: VERSION,
  modelFolder,
  inputPath: wavPath,
  tokenLevelTimestamps: true,
});

const { captions } = toCaptions({ whisperCppOutput });

const outPath = path.join(process.cwd(), "public", "captions_speech_test.json");
fs.writeFileSync(outPath, JSON.stringify(captions, null, 2));

console.log("== Done ==");
console.log(`Wrote ${captions.length} captions to ${outPath}`);
console.log("Full text:", captions.map((c) => c.text).join(""));
