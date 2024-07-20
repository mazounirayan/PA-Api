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
exports.EvenementRessourceHandler = void 0;
const database_1 = require("../../database/database");
const evenementRessource_1 = require("../../database/entities/evenementRessource");
const evenementRessource_usecase_1 = require("../../domain/evenementRessource-usecase");
const evenementRessource_validator_1 = require("../validators/evenementRessource-validator");
const generate_validation_message_1 = require("../validators/generate-validation-message");
const EvenementRessourceHandler = (app) => {
    app.get("/evenement-ressources", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = evenementRessource_validator_1.listEvenementRessourceValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listEvenementRessourceRequest = validation.value;
        let limit = 20;
        if (listEvenementRessourceRequest.limit) {
            limit = listEvenementRessourceRequest.limit;
        }
        const page = (_a = listEvenementRessourceRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const evenementRessourceUsecase = new evenementRessource_usecase_1.EvenementRessourceUsecase(database_1.AppDataSource);
            const listEvenementRessources = yield evenementRessourceUsecase.listEvenementRessources(Object.assign(Object.assign({}, listEvenementRessourceRequest), { page, limit }));
            res.status(200).send(listEvenementRessources);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/evenement-ressources", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = evenementRessource_validator_1.createEvenementRessourceValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const evenementRessourceRequest = validation.value;
        const evenementRessourceRepo = database_1.AppDataSource.getRepository(evenementRessource_1.EvenementRessource);
        try {
            const evenementRessourceCreated = yield evenementRessourceRepo.save(evenementRessourceRequest);
            res.status(201).send(evenementRessourceCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/evenement-ressources/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = evenementRessource_validator_1.evenementRessourceIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const evenementRessourceId = validationResult.value;
            const evenementRessourceRepository = database_1.AppDataSource.getRepository(evenementRessource_1.EvenementRessource);
            const evenementRessource = yield evenementRessourceRepository.findOneBy({ id: evenementRessourceId.id });
            if (evenementRessource === null) {
                res.status(404).send({ "error": `EvenementRessource ${evenementRessourceId.id} not found` });
                return;
            }
            yield evenementRessourceRepository.remove(evenementRessource);
            res.status(200).send("EvenementRessource supprimé avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/evenement-ressources/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = evenementRessource_validator_1.evenementRessourceIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const evenementRessourceId = validationResult.value;
            const evenementRessourceUsecase = new evenementRessource_usecase_1.EvenementRessourceUsecase(database_1.AppDataSource);
            const evenementRessource = yield evenementRessourceUsecase.getOneEvenementRessource(evenementRessourceId.id);
            if (evenementRessource === null) {
                res.status(404).send({ "error": `EvenementRessource ${evenementRessourceId.id} not found` });
                return;
            }
            res.status(200).send(evenementRessource);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/evenement-ressources/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = evenementRessource_validator_1.updateEvenementRessourceValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const updateEvenementRessourceRequest = validation.value;
        try {
            const evenementRessourceUsecase = new evenementRessource_usecase_1.EvenementRessourceUsecase(database_1.AppDataSource);
            const validationResult = evenementRessource_validator_1.evenementRessourceIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updatedEvenementRessource = yield evenementRessourceUsecase.updateEvenementRessource(updateEvenementRessourceRequest.id, Object.assign({}, updateEvenementRessourceRequest));
            if (updatedEvenementRessource === null) {
                res.status(404).send({ "error": `EvenementRessource ${updateEvenementRessourceRequest.id} not found` });
                return;
            }
            if (updatedEvenementRessource === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }
            res.status(200).send(updatedEvenementRessource);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.EvenementRessourceHandler = EvenementRessourceHandler;
