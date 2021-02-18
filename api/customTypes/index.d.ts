import { UserI } from "../interfaces/user.interface";

declare global {
   namespace Express {
      export interface Request {
         user?: UserI,
      }
   }
}
