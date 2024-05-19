import express, { Request, Response } from "express";
import { invalidPathHandler } from "../errors/invalid-path-handler";
import { UserHandlerAuthentication } from "./users/userAuthentication";
import { UserHandler } from "./users/user";
import { RessourceHandler } from "./ressource";
import { ReservationHandler } from "./reservation";
import { TacheHandler } from "./tache";


export const initRoutes = (app: express.Express) => {

    app.get("/health", (req: Request, res: Response) => {
        res.send({ "message": "OP LE S" })
    })


    UserHandlerAuthentication(app)
    UserHandler(app)
    RessourceHandler(app)
    ReservationHandler(app)
    TacheHandler(app)
    app.use(invalidPathHandler);
}
