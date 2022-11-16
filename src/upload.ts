import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";

const storage = new GridFsStorage({ url: process.env.ATLAS_URI });

const upload = multer({ storage });

export default upload;
