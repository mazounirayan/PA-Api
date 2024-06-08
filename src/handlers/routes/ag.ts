import express, { Request, Response } from 'express';
import { AppDataSource } from "../../database/database";
import { Ag } from "../../database/entities/ag";
import { AgUsecase } from "../../domain/ag-usecase";
import { listAgValidation, createAgValidation, agIdValidation, updateAgValidation } from "../validators/ag-validator";
import { generateValidationErrorMessage } from "../validators/generate-validation-message";

export const AgHandler = (app: express.Express) => {
    app.get("/ags", async (req: Request, res: Response) => {
        const validation = listAgValidation.validate(req.query);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const listAgRequest = validation.value;
        let limit = 20;
        if (listAgRequest.limit) {
            limit = listAgRequest.limit;
        }
        const page = listAgRequest.page ?? 1;

        try {
            const agUsecase = new AgUsecase(AppDataSource);
            const listAgs = await agUsecase.listAgs({ ...listAgRequest, page, limit });
            res.status(200).send(listAgs);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/ags", async (req: Request, res: Response) => {
        const validation = createAgValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
        const agRequest = validation.value;

        const agRepo = AppDataSource.getRepository(Ag);

        try {
            const agCreated = await agRepo.save(agRequest);
            res.status(201).send(agCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.delete("/ags/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = agIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const agId = validationResult.value;

            const agRepository = AppDataSource.getRepository(Ag);
            const ag = await agRepository.findOneBy({ id: agId.id });
            if (ag === null) {
                res.status(404).send({ "error": `Ag ${agId.id} not found` });
                return;
            }

            await agRepository.remove(ag);
            res.status(200).send("Ag supprimé avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/ags/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = agIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const agId = validationResult.value;

            const agUsecase = new AgUsecase(AppDataSource);
            const ag = await agUsecase.getOneAg(agId.id);
            if (ag === null) {
                res.status(404).send({ "error": `Ag ${agId.id} not found` });
                return;
            }
            res.status(200).send(ag);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.patch("/ags/:id", async (req: Request, res: Response) => {
        const validation = updateAgValidation.validate({ ...req.params, ...req.body });

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const updateAgRequest = validation.value;

        try {
            const agUsecase = new AgUsecase(AppDataSource);

            const validationResult = agIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const updatedAg = await agUsecase.updateAg(
                updateAgRequest.id,
                { ...updateAgRequest }
            );

            if (updatedAg === null) {
                res.status(404).send({ "error": `Ag ${updateAgRequest.id} not found` });
                return;
            }

            if (updatedAg === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }

            res.status(200).send(updatedAg);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};