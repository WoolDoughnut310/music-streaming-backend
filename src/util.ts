import { Readable, Stream } from "stream";

export const isStream = (input: string | Stream): input is Stream => {
    return (
        input instanceof Stream &&
        typeof (input as Readable)._read === "function"
    );
};

export const streamToBuffer = (stream: NodeJS.ReadableStream) => {
    const buffers = [];
    stream.on("readable", () => {
        for (;;) {
            const buffer = stream.read();
            if (!buffer) {
                break;
            }
            buffers.push(buffer);
        }
    });

    return new Promise<Buffer>((resolve, reject) => {
        stream
            .on("end", () => {
                const buffer = Buffer.concat(buffers);
                resolve(buffer);
            })
            .on("error", (err) => reject(err));
    });
};

