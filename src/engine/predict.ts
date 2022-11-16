import { ObjectId } from "mongodb";
import { KMeans, StandardScaler } from "scikitjs";
import getDb, { getBucket } from "../db";
import { Song } from "../db/types";
import extractFeatures, { decodeAudio } from "./features";

export const predictFromGridFS = async (
    model: KMeans,
    filename: string
): Promise<number> => {
    const bucket = getBucket();
    const stream = bucket.openDownloadStreamByName(filename);

    // Decode file stream from GridFS
    const audioData = await decodeAudio(stream);
    const features = extractFeatures(audioData);

    // Standardize features
    const data = new StandardScaler().fitTransform([features]);

    const output = await model.predict(data).array();
    return output[0];
};

export const getFavouriteCluster = async (songIds: ObjectId[]) => {
    const db = getDb();

    // Since there are 8 total clusters for the model
    const clusters: number[] = new Array(8).fill(0);
    const collection = db.collection<Song>("song");

    // Get the cluster from each favourite song
    const songs = await collection
        .find({ _id: { $in: songIds } }, { projection: { cluster: 1 } })
        .toArray();

    // Keep track of the number of songs with a certain cluster
    for (const song of songs) {
        clusters[song.cluster]++;
    }

    // Remember that each array index corresponds to the cluster number
    const favouriteCluster = clusters.indexOf(Math.max(...clusters));
    return favouriteCluster;
};

export const getSuggestions = async (cluster: number, exclude: ObjectId[]) => {
    const db = getDb();
    const collection = db.collection<Song>("song");

    const songs = await collection
        .find({ cluster, _id: { $nin: exclude } }, { projection: { _id: 1 } })
        .toArray();
    const suggestions = songs.map((song) => song._id);
    return suggestions;
};
