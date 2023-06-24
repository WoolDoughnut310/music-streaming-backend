import { Essentia, EssentiaWASM } from "essentia.js";
import fs from "fs";
import decode from "audio-decode";
import { isStream, streamToBuffer } from "../util";

const algorithms = {
    Danceability: "danceability",
    KeyExtractor: "key",
    PercivalBpmEstimator: "bpm",
    Intensity: "intensity",
    Energy: "energy",
};

const essentia = new Essentia(EssentiaWASM);

const SCALE = ["C", "D", "E", "F", "G", "A", "B"];

const parseKey = (keyData: { key: string; scale: string }) => {
    const keyNumber = SCALE.indexOf(keyData.key.toUpperCase());
    const scaleNumber = keyData.scale.toLowerCase() === "major" ? 1 : 0;
    return [keyNumber, scaleNumber];
};

export const decodeAudio = async (filepath: string | NodeJS.ReadableStream) => {
    let buffer: Buffer;

    if (isStream(filepath)) {
        buffer = await streamToBuffer(filepath);
    } else {
        buffer = fs.readFileSync(filepath);
    }

    const audioBuffer = await decode(buffer);
    const audioData = essentia.arrayToVector(audioBuffer._channelData[0]);
    return audioData;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function extractFeatures(audioData: any) {
    const features: number[] = [];

    for (const [algorithm, identifier] of Object.entries(algorithms)) {
        const algorithmFunc = essentia[algorithm];

        const value = algorithmFunc.call(essentia, audioData);

        if (algorithm === "KeyExtractor") {
            // Parse key returns array of 2 values
            features.push(...parseKey(value));
        } else {
            value[identifier] = Number(value[identifier].toFixed(2));
            features.push(value[identifier]);
        }
    }

    return features;
}
