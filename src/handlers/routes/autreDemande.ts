import express, { Request, Response } from 'express';
import { AppDataSource } from "../../database/database";
import { AutreDemande } from '../../database/entities/autreDemande';
import { AutreDemandeUsecase } from '../../domain/autreDemande-usecase';
import { listAutreDemandeValidation, createAutreDemandeValidation, autreDemandeIdValidation, updateAutreDemandeValidation } from '../validators/autreDemande-validator';
import { generateValidationErrorMessage } from '../validators/generate-validation-message';

export const AutreDemandeHandler = (app: express.Express) => {
    app.get("/autre-demandes", async (req: Request, res: Response) => {
        const validation = listAutreDemandeValidation.validate(req.query);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const listAutreDemandeRequest = validation.value;
        let limit = 20;
        if (listAutreDemandeRequest.limit) {
            limit = listAutreDemandeRequest.limit;
        }
        const page = listAutreDemandeRequest.page ?? 1;

        try {
            const autreDemandeUsecase = new AutreDemandeUsecase(AppDataSource);
            const listAutreDemandes = await autreDemandeUsecase.listAutreDemandes({ ...listAutreDemandeRequest, page, limit });
            res.status(200).send(listAutreDemandes);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/autre-demandes", async (req: Request, res: Response) => {
        const validation = createAutreDemandeValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
        const autreDemandeRequest = validation.value;

        const autreDemandeRepo = AppDataSource.getRepository(AutreDemande);

        try {
            const autreDemandeCreated = await autreDemandeRepo.save(autreDemandeRequest);
            res.status(201).send(autreDemandeCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.delete("/autre-demandes/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = autreDemandeIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const autreDemandeId = validationResult.value;

            const autreDemandeRepository = AppDataSource.getRepository(AutreDemande);
            const autreDemande = await autreDemandeRepository.findOneBy({ id: autreDemandeId.id });
            if (autreDemande === null) {
                res.status(404).send({ "error": `AutreDemande ${autreDemandeId.id} not found` });
                return;
            }

            await autreDemandeRepository.remove(autreDemande);
            res.status(200).send("AutreDemande supprimée avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/autre-demandes/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = autreDemandeIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const autreDemandeId = validationResult.value;

            const autreDemandeUsecase = new AutreDemandeUsecase(AppDataSource);
            const autreDemande = await autreDemandeUsecase.getOneAutreDemande(autreDemandeId.id);
            if (autreDemande === null) {
                res.status(404).send({ "error": `AutreDemande ${autreDemandeId.id} not found` });
                return;
            }
            res.status(200).send(autreDemande);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.patch("/autre-demandes/:id", async (req: Request, res: Response) => {
        const validation = updateAutreDemandeValidation.validate({ ...req.params, ...req.body });

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const updateAutreDemandeRequest = validation.value;

        try {
            const autreDemandeUsecase = new AutreDemandeUsecase(AppDataSource);

            const validationResult = autreDemandeIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const updatedAutreDemande = await autreDemandeUsecase.updateAutreDemande(
                updateAutreDemandeRequest.id,
                { ...updateAutreDemandeRequest }
            );

            if (updatedAutreDemande === null) {
                res.status(404).send({ "error": `AutreDemande ${updateAutreDemandeRequest.id} not found` });
                return;
            }

            if (updatedAutreDemande === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }

            res.status(200).send(updatedAutreDemande);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};