import express, { Request, Response } from "express";
import { AppDataSource } from "../../database/database";
import { Vote } from "../../database/entities/vote";
import { VoteUsecase } from "../../domain/vote-usecase";
import { generateValidationErrorMessage } from "../validators/generate-validation-message";
import { listVoteValidation, createVoteValidation, voteIdValidation, updateVoteValidation } from "../validators/vote-validator";

export const VoteHandler = (app: express.Express) => {
    app.get("/votes", async (req: Request, res: Response) => {
        const validation = listVoteValidation.validate(req.query);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const listVoteRequest = validation.value;
        let limit = 20;
        if (listVoteRequest.limit) {
            limit = listVoteRequest.limit;
        }
        const page = listVoteRequest.page ?? 1;

        try {
            const voteUsecase = new VoteUsecase(AppDataSource);
            const listVotes = await voteUsecase.listVotes({ ...listVoteRequest, page, limit });
            res.status(200).send(listVotes);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/votes", async (req: Request, res: Response) => {
        const validation = createVoteValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
        const voteRequest = validation.value;

        const voteRepo = AppDataSource.getRepository(Vote);

        try {
            const voteCreated = await voteRepo.save(voteRequest);
            res.status(201).send(voteCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.delete("/votes/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = voteIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const voteId = validationResult.value;

            const voteRepository = AppDataSource.getRepository(Vote);
            const vote = await voteRepository.findOneBy({ id: voteId.id });
            if (vote === null) {
                res.status(404).send({ "error": `Vote ${voteId.id} not found` });
                return;
            }

            await voteRepository.remove(vote);
            res.status(200).send("Vote supprimé avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/votes/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = voteIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const voteId = validationResult.value;

            const voteUsecase = new VoteUsecase(AppDataSource);
            const vote = await voteUsecase.getOneVote(voteId.id);
            if (vote === null) {
                res.status(404).send({ "error": `Vote ${voteId.id} not found` });
                return;
            }
            res.status(200).send(vote);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.patch("/votes/:id", async (req: Request, res: Response) => {
        const validation = updateVoteValidation.validate({ ...req.params, ...req.body });

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const updateVoteRequest = validation.value;

        try {
            const voteUsecase = new VoteUsecase(AppDataSource);

            const validationResult = voteIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const updatedVote = await voteUsecase.updateVote(
                updateVoteRequest.id,
                { ...updateVoteRequest }
            );

            if (updatedVote === null) {
                res.status(404).send({ "error": `Vote ${updateVoteRequest.id} not found` });
                return;
            }

            if (updatedVote === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }

            res.status(200).send(updatedVote);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};