import express, { Request, Response } from 'express';
import { generateValidationErrorMessage } from '../validators/generate-validation-message';
import { AppDataSource } from '../../database/database';
import { AideProjetDemande } from '../../database/entities/aideProjetDemande';
import { AideProjetDemandeUsecase } from '../../domain/aideProjetDemande-usecase';
import { listAideProjetDemandeValidation, createAideProjetDemandeValidation, aideProjetDemandeIdValidation, updateAideProjetDemandeValidation } from '../validators/aideProjetDemande-validator';


export const AideProjetDemandeHandler = (app: express.Express) => {
    app.get("/aide-projet-demandes", async (req: Request, res: Response) => {
        const validation = listAideProjetDemandeValidation.validate(req.query);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const listAideProjetDemandeRequest = validation.value;
        let limit = 20;
        if (listAideProjetDemandeRequest.limit) {
            limit = listAideProjetDemandeRequest.limit;
        }
        const page = listAideProjetDemandeRequest.page ?? 1;

        try {
            const aideProjetDemandeUsecase = new AideProjetDemandeUsecase(AppDataSource);
            const listAideProjetDemandes = await aideProjetDemandeUsecase.listAideProjetDemandes({ ...listAideProjetDemandeRequest, page, limit });
            res.status(200).send(listAideProjetDemandes);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/aide-projet-demandes", async (req: Request, res: Response) => {
        const validation = createAideProjetDemandeValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
        const aideProjetDemandeRequest = validation.value;

        const aideProjetDemandeRepo = AppDataSource.getRepository(AideProjetDemande);

        try {
            const aideProjetDemandeCreated = await aideProjetDemandeRepo.save(aideProjetDemandeRequest);
            res.status(201).send(aideProjetDemandeCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.delete("/aide-projet-demandes/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = aideProjetDemandeIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const aideProjetDemandeId = validationResult.value;

            const aideProjetDemandeRepository = AppDataSource.getRepository(AideProjetDemande);
            const aideProjetDemande = await aideProjetDemandeRepository.findOneBy({ id: aideProjetDemandeId.id });
            if (aideProjetDemande === null) {
                res.status(404).send({ "error": `AideProjetDemande ${aideProjetDemandeId.id} not found` });
                return;
            }

            await aideProjetDemandeRepository.remove(aideProjetDemande);
            res.status(200).send("AideProjetDemande supprimée avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/aide-projet-demandes/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = aideProjetDemandeIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const aideProjetDemandeId = validationResult.value;

            const aideProjetDemandeUsecase = new AideProjetDemandeUsecase(AppDataSource);
            const aideProjetDemande = await aideProjetDemandeUsecase.getOneAideProjetDemande(aideProjetDemandeId.id);
            if (aideProjetDemande === null) {
                res.status(404).send({ "error": `AideProjetDemande ${aideProjetDemandeId.id} not found` });
                return;
            }
            res.status(200).send(aideProjetDemande);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.patch("/aide-projet-demandes/:id", async (req: Request, res: Response) => {
        const validation = updateAideProjetDemandeValidation.validate({ ...req.params, ...req.body });

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const updateAideProjetDemandeRequest = validation.value;

        try {
            const aideProjetDemandeUsecase = new AideProjetDemandeUsecase(AppDataSource);

            const validationResult = aideProjetDemandeIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const updatedAideProjetDemande = await aideProjetDemandeUsecase.updateAideProjetDemande(
                updateAideProjetDemandeRequest.id,
                { ...updateAideProjetDemandeRequest }
            );

            if (updatedAideProjetDemande === null) {
                res.status(404).send({ "error": `AideProjetDemande ${updateAideProjetDemandeRequest.id} not found` });
                return;
            }

            if (updatedAideProjetDemande === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }

            res.status(200).send(updatedAideProjetDemande);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};
