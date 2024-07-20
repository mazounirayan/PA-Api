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
exports.EvenementHandler = void 0;
const database_1 = require("../../database/database");
const evenement_1 = require("../../database/entities/evenement");
const evenement_usecase_1 = require("../../domain/evenement-usecase");
const evenement_validator_1 = require("../validators/evenement-validator");
const generate_validation_message_1 = require("../validators/generate-validation-message");
const EvenementHandler = (app) => {
    app.get("/evenements", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = evenement_validator_1.listEvenementValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listEvenementRequest = validation.value;
        let limit = 20;
        if (listEvenementRequest.limit) {
            limit = listEvenementRequest.limit;
        }
        const page = (_a = listEvenementRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const evenementUsecase = new evenement_usecase_1.EvenementUsecase(database_1.AppDataSource);
            const listEvenements = yield evenementUsecase.listEvenements(Object.assign(Object.assign({}, listEvenementRequest), { page, limit }));
            res.status(200).send(listEvenements);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/evenements", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = evenement_validator_1.createEvenementValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const evenementRequest = validation.value;
        const evenementRepo = database_1.AppDataSource.getRepository(evenement_1.Evenement);
        try {
            const evenementCreated = yield evenementRepo.save(evenementRequest);
            res.status(201).send(evenementCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/evenements/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = evenement_validator_1.evenementIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const evenementId = validationResult.value;
            const evenementRepository = database_1.AppDataSource.getRepository(evenement_1.Evenement);
            const evenement = yield evenementRepository.findOneBy({ id: evenementId.id });
            if (evenement === null) {
                res.status(404).send({ "error": `Evenement ${evenementId.id} not found` });
                return;
            }
            yield evenementRepository.remove(evenement);
            res.status(200).send("Evenement supprimé avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/evenements/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = evenement_validator_1.evenementIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const evenementId = validationResult.value;
            const evenementUsecase = new evenement_usecase_1.EvenementUsecase(database_1.AppDataSource);
            const evenement = yield evenementUsecase.getOneEvenement(evenementId.id);
            if (evenement === null) {
                res.status(404).send({ "error": `Evenement ${evenementId.id} not found` });
                return;
            }
            res.status(200).send(evenement);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/evenements/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = evenement_validator_1.updateEvenementValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const updateEvenementRequest = validation.value;
        try {
            const evenementUsecase = new evenement_usecase_1.EvenementUsecase(database_1.AppDataSource);
            const validationResult = evenement_validator_1.evenementIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updatedEvenement = yield evenementUsecase.updateEvenement(updateEvenementRequest.id, Object.assign({}, updateEvenementRequest));
            if (updatedEvenement === null) {
                res.status(404).send({ "error": `Evenement ${updateEvenementRequest.id} not found` });
                return;
            }
            if (updatedEvenement === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }
            res.status(200).send(updatedEvenement);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.EvenementHandler = EvenementHandler;
