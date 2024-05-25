import express, { Request, Response } from "express";
import { invalidPathHandler } from "../errors/invalid-path-handler";
import { UserHandlerAuthentication } from "./users/userAuthentication";
import { UserHandler } from "./users/user";
import { RessourceHandler } from "./ressource";
import { ReservationHandler } from "./reservation";
import { TacheHandler } from "./tache";
import { TransactionHandler } from "./transaction";
import { ParrainageDemandeHandler } from "./parrainageDemande";
import { DemandeHandler } from "./demande";
import { AideProjetDemandeHandler } from "./aideProjetDemande";
import { EvenementHandler } from "./evenement";
import { EvenementDemandeHandler } from "./evenementDemande";
import { AzureBlobService } from "./azureBlobService";


export const initRoutes = (app: express.Express) => {

    app.get("/health", (req: Request, res: Response) => {
        res.send({ "message": "OP LE S" })
    })


    UserHandlerAuthentication(app)
    UserHandler(app)
    RessourceHandler(app)
    ReservationHandler(app)
    TacheHandler(app)
    TransactionHandler(app)
    ParrainageDemandeHandler(app)
    DemandeHandler(app)
    AideProjetDemandeHandler(app)
    EvenementHandler(app)
    EvenementDemandeHandler(app)
    AzureBlobService(app)
    app.use(invalidPathHandler);
}
