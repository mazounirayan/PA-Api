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
exports.PropositionHandler = void 0;
const database_1 = require("../../database/database");
const proposition_1 = require("../../database/entities/proposition");
const proposition_usecase_1 = require("../../domain/proposition-usecase");
const generate_validation_message_1 = require("../validators/generate-validation-message");
const proposition_validator_1 = require("../validators/proposition-validator");
const PropositionHandler = (app) => {
    app.get("/propositions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = proposition_validator_1.listPropositionValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listPropositionRequest = validation.value;
        let limit = 20;
        if (listPropositionRequest.limit) {
            limit = listPropositionRequest.limit;
        }
        const page = (_a = listPropositionRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const propositionUsecase = new proposition_usecase_1.PropositionUsecase(database_1.AppDataSource);
            const listPropositions = yield propositionUsecase.listPropositions(Object.assign(Object.assign({}, listPropositionRequest), { page, limit }));
            res.status(200).send(listPropositions);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/propositions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = proposition_validator_1.createPropositionValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const propositionRequest = validation.value;
        const propositionRepo = database_1.AppDataSource.getRepository(proposition_1.Proposition);
        try {
            const propositionCreated = yield propositionRepo.save(propositionRequest);
            res.status(201).send(propositionCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/propositions/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = proposition_validator_1.propositionIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const propositionId = validationResult.value;
            const propositionRepository = database_1.AppDataSource.getRepository(proposition_1.Proposition);
            const proposition = yield propositionRepository.findOneBy({ id: propositionId.id });
            if (proposition === null) {
                res.status(404).send({ "error": `Proposition ${propositionId.id} not found` });
                return;
            }
            yield propositionRepository.remove(proposition);
            res.status(200).send("Proposition supprimée avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/propositions/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = proposition_validator_1.propositionIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const propositionId = validationResult.value;
            const propositionUsecase = new proposition_usecase_1.PropositionUsecase(database_1.AppDataSource);
            const proposition = yield propositionUsecase.getOneProposition(propositionId.id);
            if (proposition === null) {
                res.status(404).send({ "error": `Proposition ${propositionId.id} not found` });
                return;
            }
            res.status(200).send(proposition);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/propositions/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = proposition_validator_1.updatePropositionValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const updatePropositionRequest = validation.value;
        try {
            const propositionUsecase = new proposition_usecase_1.PropositionUsecase(database_1.AppDataSource);
            const validationResult = proposition_validator_1.propositionIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updatedProposition = yield propositionUsecase.updateProposition(updatePropositionRequest.id, Object.assign({}, updatePropositionRequest));
            if (updatedProposition === null) {
                res.status(404).send({ "error": `Proposition ${updatePropositionRequest.id} not found` });
                return;
            }
            if (updatedProposition === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }
            res.status(200).send(updatedProposition);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.PropositionHandler = PropositionHandler;
