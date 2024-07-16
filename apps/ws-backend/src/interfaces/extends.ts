import { Request } from "express";

export interface request extends Request {
    userId: number
}