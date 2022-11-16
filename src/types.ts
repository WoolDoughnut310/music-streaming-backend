import { Request as JwtRequest } from "express-jwt";
import { User } from "./db/types";

export type Request = JwtRequest & { user: User };
