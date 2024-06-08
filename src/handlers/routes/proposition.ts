import express, { Request, Response } from "express";
import { AppDataSource } from "../../database/database";
import { Proposition } from "../../database/entities/proposition";
import { PropositionUsecase } from "../../domain/proposition-usecase";
import { generateValidationErrorMessage } from "../validators/generate-validation-message";
import { listPropositionValidation, createPropositionValidation, propositionIdValidation, updatePropositionValidation } from "../validators/proposition-validator";

export const PropositionHandler = (app: express.Express) => {
    app.get("/propositions", async (req: Request, res: Response) => {
        const validation = listPropositionValidation.validate(req.query);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const listPropositionRequest = validation.value;
        let limit = 20;
        if (listPropositionRequest.limit) {
            limit = listPropositionRequest.limit;
        }
        const page = listPropositionRequest.page ?? 1;

        try {
            const propositionUsecase = new PropositionUsecase(AppDataSource);
            const listPropositions = await propositionUsecase.listPropositions({ ...listPropositionRequest, page, limit });
            res.status(200).send(listPropositions);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/propositions", async (req: Request, res: Response) => {
        const validation = createPropositionValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
        const propositionRequest = validation.value;

        const propositionRepo = AppDataSource.getRepository(Proposition);

        try {
            const propositionCreated = await propositionRepo.save(propositionRequest);
            res.status(201).send(propositionCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.delete("/propositions/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = propositionIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const propositionId = validationResult.value;

            const propositionRepository = AppDataSource.getRepository(Proposition);
            const proposition = await propositionRepository.findOneBy({ id: propositionId.id });
            if (proposition === null) {
                res.status(404).send({ "error": `Proposition ${propositionId.id} not found` });
                return;
            }

            await propositionRepository.remove(proposition);
            res.status(200).send("Proposition supprimée avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/propositions/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = propositionIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const propositionId = validationResult.value;

            const propositionUsecase = new PropositionUsecase(AppDataSource);
            const proposition = await propositionUsecase.getOneProposition(propositionId.id);
            if (proposition === null) {
                res.status(404).send({ "error": `Proposition ${propositionId.id} not found` });
                return;
            }
            res.status(200).send(proposition);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.patch("/propositions/:id", async (req: Request, res: Response) => {
        const validation = updatePropositionValidation.validate({ ...req.params, ...req.body });

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const updatePropositionRequest = validation.value;

        try {
            const propositionUsecase = new PropositionUsecase(AppDataSource);

            const validationResult = propositionIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const updatedProposition = await propositionUsecase.updateProposition(
                updatePropositionRequest.id,
                { ...updatePropositionRequest }
            );

            if (updatedProposition === null) {
                res.status(404).send({ "error": `Proposition ${updatePropositionRequest.id} not found` });
                return;
            }

            if (updatedProposition === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }

            res.status(200).send(updatedProposition);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};