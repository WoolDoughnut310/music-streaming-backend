import { Response } from "express";
import { Filter, ObjectId } from "mongodb";
import getDb, { getBucket } from "../db";
import { Song, User } from "../db/types";
import { Request } from "../types";
import express from "express";
import verifyAuth from "../middlewares/verifyAuth";
import upload from "../upload";
import getModel from "../engine/kmeans";
import {
    getFavouriteCluster,
    getSuggestions,
    predictFromGridFS,
} from "../engine/predict";
import asyncHandler from "express-async-handler";

const router = express.Router();

router.use(verifyAuth());

router.post(
    "/",
    upload.single("song"),
    asyncHandler(async (req: Request, res: Response) => {
        const db = getDb();
        const collection = db.collection<Song>("song");
        const model = getModel();
        if (!req.file?.filename) {
            res.status(400).send("File not uploaded");
            return;
        }

        const cluster = await predictFromGridFS(model, req.file.filename);

        const result = await collection.insertOne({
            userId: req.auth.id,
            filename: req.file.filename,
            mimeType: req.file.mimetype,
            title: req.body.title,
            duration: req.body.duration,
            genre: req.body.genre,
            lyrics: req.body.lyrics,
            uploaded: new Date(),
            cluster: cluster,
        });

        res.status(200).json(result);
    })
);

router.get(
    "/me",
    asyncHandler(async (req: Request, res: Response) => {
        const db = getDb();
        const collection = db.collection<Song>("song");

        const songs = await collection
            .find({ userId: req.auth.id })
            .sort({ date: -1 })
            .toArray();
        res.status(200).json(songs);
    })
);

router.get(
    "/",
    asyncHandler(async (req: Request, res: Response) => {
        const db = getDb();
        const collection = db.collection<Song>("song");

        let filter: Filter<Song> = {};

        if (typeof req.query.user === "string") {
            filter = { userId: new ObjectId(req.query.user) };
        }

        const songs = await collection
            .find(filter)
            .sort({ date: -1 })
            .toArray();
        res.status(200).json(songs);
    })
);

router.get(
    "/recommend",
    asyncHandler(async (req: Request, res: Response) => {
        const db = getDb();
        const collection = db.collection<Song>("song");

        // /songs/recommend?limit=N
        const limit = parseInt(req.params.limit) || 20;

        // Array of song IDs
        const favourites = req.user.favourites;

        let suggestions: ObjectId[];

        if (!favourites) {
            // Getting any songs
            const songs = await collection
                .find({}, { limit, projection: { _id: 1 } })
                .toArray();
            suggestions = songs.map((song) => song._id);
        } else {
            // Suggesting
            const favouriteCluster = await getFavouriteCluster(favourites);
            suggestions = await getSuggestions(favouriteCluster, favourites);
        }

        res.status(200).json(suggestions);
    })
);

router.get(
    "/:id",
    asyncHandler(async (req: Request, res: Response) => {
        const db = getDb();
        const collection = db.collection<Song>("song");

        const song = await collection.findOne({
            _id: new ObjectId(req.params.id),
        });

        if (song === null) {
            res.status(404).send("Song not found");
            return;
        }

        res.status(200).json(song);
    })
);

router.put(
    "/:id",
    upload.single("song"),
    asyncHandler(async (req: Request, res: Response) => {
        const db = getDb();
        const collection = db.collection<Song>("song");

        let cluster: number;

        if (req.file?.filename) {
            const model = getModel();
            cluster = await predictFromGridFS(model, req.file.filename);
        }

        await collection.updateOne(
            { userId: req.auth.id, _id: req.body.id },
            {
                $set: {
                    filename: req.file?.filename,
                    title: req.body.title,
                    duration: req.body.duration,
                    genre: req.body.genre,
                    lyrics: req.body.lyrics,
                    cluster,
                },
            }
        );
        res.status(200).json("Updated successfully");
    })
);

router.delete(
    "/:id",
    asyncHandler(async (req: Request, res: Response) => {
        const db = getDb();
        const collection = db.collection<Song>("song");

        await collection.deleteOne({ userId: req.auth.id, _id: req.body.id });
        res.status(200).json("Deleted successfully");
    })
);

router.get(
    "/:id/stream",
    asyncHandler(async (req, res) => {
        const bucket = getBucket();
        const db = getDb();
        const collection = db.collection<Song>("song");

        const song = await collection.findOne({
            _id: new ObjectId(req.params.id),
        });

        if (song === null) {
            res.status(404).send("Song not found");
            return;
        }

        res.status(200);

        res.set({
            "Content-Type": song.mimeType,
            "Transfer-Encoding": "chunked",
        });

        bucket.openDownloadStreamByName(song.filename).pipe(res);
    })
);

router.post(
    "/:id/favourite",
    asyncHandler(async (req: Request, res: Response) => {
        const db = getDb();
        const collection = db.collection<Song>("song");
        const songId = new ObjectId(req.params.id);

        const song = await collection.findOne({
            _id: new ObjectId(req.params.id),
        });

        // Check if the song exists
        if (song === null) {
            res.status(404).send("Song not found");
            return;
        }

        const favourites = req.user.favourites ?? [];

        // Define the operator on the favourites list
        const operator = favourites.find((id) => id.equals(songId))
            ? "$pull"
            : "$push";

        await db.collection<User>("user").updateOne(
            {
                _id: req.auth.id,
            },
            {
                [operator]: { favourites: songId },
            }
        );

        // Update the user variable in the request
        req.user = await db
            .collection<User>("user")
            .findOne({ _id: req.auth.id });
        res.status(200).json(req.user.favourites);
    })
);

export default router;
