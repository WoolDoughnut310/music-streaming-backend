import express from "express";
import getDb from "../db";
import { User } from "../db/types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
    const db = getDb();
    const users = db.collection<User>("user");

    const password = await bcrypt.hash(req.body.password, 10);

    await users.insertOne({
        email: req.body.email,
        password,
        username: req.body.username,
    });

    res.status(200).json({ message: "Registered successfully" });
});

router.post("/login", async (req, res) => {
    const db = getDb();
    const users = db.collection<User>("user");

    const user = await users.findOne({
        email: req.body.email,
    });

    const passwordValid = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if (user === null || !passwordValid) {
        return res.status(401).json({
            accessToken: null,
            message: "Email or password is incorrect",
        });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(200).json({ accessToken });
});

export default router;
