import type { User } from "../../generated/prisma/client.ts";
import type * as express from 'express'

declare global {
    namespace Express {
        export interface Request {
            user?: User
        }
    }
}