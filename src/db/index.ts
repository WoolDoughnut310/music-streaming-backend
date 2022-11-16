import { Db, GridFSBucket, MongoClient } from "mongodb";
const connectionString = process.env.ATLAS_URI;
const client = new MongoClient(connectionString);

let db: Db;
let bucket: GridFSBucket;

export const connectToServer = async () => {
    await client.connect();
    db = client.db(process.env.DB_NAME);
    bucket = new GridFSBucket(db);
    console.log("Successfully connected to MongoDB.");
};

const getDb = () => db;

export const getBucket = () => bucket;

export default getDb;
