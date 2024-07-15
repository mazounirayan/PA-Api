"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteHandler = void 0;
const database_1 = require("../../database/database");
const vote_1 = require("../../database/entities/vote");
const vote_usecase_1 = require("../../domain/vote-usecase");
const generate_validation_message_1 = require("../validators/generate-validation-message");
const vote_validator_1 = require("../validators/vote-validator");
const VoteHandler = (app) => {
    app.get("/votes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = vote_validator_1.listVoteValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listVoteRequest = validation.value;
        let limit = 20;
        if (listVoteRequest.limit) {
            limit = listVoteRequest.limit;
        }
        const page = (_a = listVoteRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const voteUsecase = new vote_usecase_1.VoteUsecase(database_1.AppDataSource);
            const listVotes = yield voteUsecase.listVotes(Object.assign(Object.assign({}, listVoteRequest), { page, limit }));
            res.status(200).send(listVotes);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/votes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = vote_validator_1.createVoteValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const voteRequest = validation.value;
        const voteRepo = database_1.AppDataSource.getRepository(vote_1.Vote);
        try {
            const voteCreated = yield voteRepo.save(voteRequest);
            res.status(201).send(voteCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/votes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = vote_validator_1.voteIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const voteId = validationResult.value;
            const voteRepository = database_1.AppDataSource.getRepository(vote_1.Vote);
            const vote = yield voteRepository.findOneBy({ id: voteId.id });
            if (vote === null) {
                res.status(404).send({ "error": `Vote ${voteId.id} not found` });
                return;
            }
            yield voteRepository.remove(vote);
            res.status(200).send("Vote supprimé avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/votes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = vote_validator_1.voteIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const voteId = validationResult.value;
            const voteUsecase = new vote_usecase_1.VoteUsecase(database_1.AppDataSource);
            const vote = yield voteUsecase.getOneVote(voteId.id);
            if (vote === null) {
                res.status(404).send({ "error": `Vote ${voteId.id} not found` });
                return;
            }
            res.status(200).send(vote);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/votes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = vote_validator_1.updateVoteValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const updateVoteRequest = validation.value;
        try {
            const voteUsecase = new vote_usecase_1.VoteUsecase(database_1.AppDataSource);
            const validationResult = vote_validator_1.voteIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updatedVote = yield voteUsecase.updateVote(updateVoteRequest.id, Object.assign({}, updateVoteRequest));
            if (updatedVote === null) {
                res.status(404).send({ "error": `Vote ${updateVoteRequest.id} not found` });
                return;
            }
            if (updatedVote === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }
            res.status(200).send(updatedVote);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.VoteHandler = VoteHandler;
