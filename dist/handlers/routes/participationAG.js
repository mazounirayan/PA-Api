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
exports.ParticipationAGHandler = void 0;
const database_1 = require("../../database/database");
const participationAG_1 = require("../../database/entities/participationAG");
const participationAG_usecase_1 = require("../../domain/participationAG-usecase");
const generate_validation_message_1 = require("../validators/generate-validation-message");
const participationAG_validator_1 = require("../validators/participationAG-validator");
const ParticipationAGHandler = (app) => {
    app.get("/participationsAG", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = participationAG_validator_1.listParticipationAGValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listParticipationAGRequest = validation.value;
        let limit = 20;
        if (listParticipationAGRequest.limit) {
            limit = listParticipationAGRequest.limit;
        }
        const page = (_a = listParticipationAGRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const participationAGUsecase = new participationAG_usecase_1.ParticipationAGUsecase(database_1.AppDataSource);
            const listParticipationAGs = yield participationAGUsecase.listParticipationAGs(Object.assign(Object.assign({}, listParticipationAGRequest), { page, limit }));
            res.status(200).send(listParticipationAGs);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/participationsAG", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = participationAG_validator_1.createParticipationAGValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const participationAGRequest = validation.value;
        const participationAGRepo = database_1.AppDataSource.getRepository(participationAG_1.ParticipationAG);
        try {
            const participationAGCreated = yield participationAGRepo.save(participationAGRequest);
            res.status(201).send(participationAGCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/participationsAG/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = participationAG_validator_1.participationAGIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const participationAGId = validationResult.value;
            const participationAGRepository = database_1.AppDataSource.getRepository(participationAG_1.ParticipationAG);
            const participationAG = yield participationAGRepository.findOneBy({ id: participationAGId.id });
            if (participationAG === null) {
                res.status(404).send({ "error": `ParticipationAG ${participationAGId.id} not found` });
                return;
            }
            yield participationAGRepository.remove(participationAG);
            res.status(200).send("ParticipationAG supprimée avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/participationsAG/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = participationAG_validator_1.participationAGIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const participationAGId = validationResult.value;
            const participationAGUsecase = new participationAG_usecase_1.ParticipationAGUsecase(database_1.AppDataSource);
            const participationAG = yield participationAGUsecase.getOneParticipationAG(participationAGId.id);
            if (participationAG === null) {
                res.status(404).send({ "error": `ParticipationAG ${participationAGId.id} not found` });
                return;
            }
            res.status(200).send(participationAG);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/participationsAG/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = participationAG_validator_1.updateParticipationAGValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const updateParticipationAGRequest = validation.value;
        try {
            const participationAGUsecase = new participationAG_usecase_1.ParticipationAGUsecase(database_1.AppDataSource);
            const validationResult = participationAG_validator_1.participationAGIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updatedParticipationAG = yield participationAGUsecase.updateParticipationAG(updateParticipationAGRequest.id, Object.assign({}, updateParticipationAGRequest));
            if (updatedParticipationAG === null) {
                res.status(404).send({ "error": `ParticipationAG ${updateParticipationAGRequest.id} not found` });
                return;
            }
            if (updatedParticipationAG === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }
            res.status(200).send(updatedParticipationAG);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.ParticipationAGHandler = ParticipationAGHandler;
