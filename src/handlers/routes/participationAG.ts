import express, { Request, Response } from 'express';
import { AppDataSource } from "../../database/database";
import { ParticipationAG } from "../../database/entities/participationAG";
import { ParticipationAGUsecase } from "../../domain/participationAG-usecase";
import { generateValidationErrorMessage } from "../validators/generate-validation-message";
import { listParticipationAGValidation, createParticipationAGValidation, participationAGIdValidation, updateParticipationAGValidation } from "../validators/participationAG-validator";

export const ParticipationAGHandler = (app: express.Express) => {
    app.get("/participationsAG", async (req: Request, res: Response) => {
        const validation = listParticipationAGValidation.validate(req.query);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const listParticipationAGRequest = validation.value;
        let limit = 20;
        if (listParticipationAGRequest.limit) {
            limit = listParticipationAGRequest.limit;
        }
        const page = listParticipationAGRequest.page ?? 1;

        try {
            const participationAGUsecase = new ParticipationAGUsecase(AppDataSource);
            const listParticipationAGs = await participationAGUsecase.listParticipationAGs({ ...listParticipationAGRequest, page, limit });
            res.status(200).send(listParticipationAGs);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/participationsAG", async (req: Request, res: Response) => {
        const validation = createParticipationAGValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
        const participationAGRequest = validation.value;

        const participationAGRepo = AppDataSource.getRepository(ParticipationAG);

        try {
            const participationAGCreated = await participationAGRepo.save(participationAGRequest);
            res.status(201).send(participationAGCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.delete("/participationsAG/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = participationAGIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const participationAGId = validationResult.value;

            const participationAGRepository = AppDataSource.getRepository(ParticipationAG);
            const participationAG = await participationAGRepository.findOneBy({ id: participationAGId.id });
            if (participationAG === null) {
                res.status(404).send({ "error": `ParticipationAG ${participationAGId.id} not found` });
                return;
            }

            await participationAGRepository.remove(participationAG);
            res.status(200).send("ParticipationAG supprimée avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/participationsAG/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = participationAGIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const participationAGId = validationResult.value;

            const participationAGUsecase = new ParticipationAGUsecase(AppDataSource);
            const participationAG = await participationAGUsecase.getOneParticipationAG(participationAGId.id);
            if (participationAG === null) {
                res.status(404).send({ "error": `ParticipationAG ${participationAGId.id} not found` });
                return;
            }
            res.status(200).send(participationAG);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.patch("/participationsAG/:id", async (req: Request, res: Response) => {
        const validation = updateParticipationAGValidation.validate({ ...req.params, ...req.body });

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const updateParticipationAGRequest = validation.value;

        try {
            const participationAGUsecase = new ParticipationAGUsecase(AppDataSource);

            const validationResult = participationAGIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const updatedParticipationAG = await participationAGUsecase.updateParticipationAG(
                updateParticipationAGRequest.id,
                { ...updateParticipationAGRequest }
            );

            if (updatedParticipationAG === null) {
                res.status(404).send({ "error": `ParticipationAG ${updateParticipationAGRequest.id} not found` });
                return;
            }

            if (updatedParticipationAG === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }

            res.status(200).send(updatedParticipationAG);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};