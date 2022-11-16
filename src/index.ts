import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import { connectToServer } from "./db";
import songRouter from "./routes/songs";
import authRouter from "./routes/auth";
import { load as loadModel } from "./engine/kmeans";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/songs", songRouter);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use((err: Error, req: Request, res: Response) => {
    res.status(500).json({ message: err.message });
});

connectToServer().then(async () => {
    await loadModel();

    app.listen(port, () => {
        return console.log(`Express is listening at http://localhost:${port}`);
    });
});
