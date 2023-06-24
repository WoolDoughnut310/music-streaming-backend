import extractFeatures, { decodeAudio } from "./features";
import { parentPort, MessagePort } from "worker_threads";

const getFeatures = async (filepath: string, parentPort: MessagePort) => {
    const audioData = await decodeAudio(filepath);
    const features = extractFeatures(audioData);
    parentPort.postMessage(features);
};

parentPort.on("message", (filepath: string) => {
    getFeatures(filepath, parentPort);
});
