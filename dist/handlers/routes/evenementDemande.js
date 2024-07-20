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
exports.EvenementDemandeHandler = void 0;
const database_1 = require("../../database/database");
const evenementDemande_1 = require("../../database/entities/evenementDemande");
const evenementDemande_usecase_1 = require("../../domain/evenementDemande-usecase");
const evenementDemande_validator_1 = require("../validators/evenementDemande-validator");
const generate_validation_message_1 = require("../validators/generate-validation-message");
const EvenementDemandeHandler = (app) => {
    app.get("/evenement-demandes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = evenementDemande_validator_1.listEvenementDemandeValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listEvenementDemandeRequest = validation.value;
        let limit = 20;
        if (listEvenementDemandeRequest.limit) {
            limit = listEvenementDemandeRequest.limit;
        }
        const page = (_a = listEvenementDemandeRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const evenementDemandeUsecase = new evenementDemande_usecase_1.EvenementDemandeUsecase(database_1.AppDataSource);
            const listEvenementDemandes = yield evenementDemandeUsecase.listEvenementDemandes(Object.assign(Object.assign({}, listEvenementDemandeRequest), { page, limit }));
            res.status(200).send(listEvenementDemandes);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/evenement-demandes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = evenementDemande_validator_1.createEvenementDemandeValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const evenementDemandeRequest = validation.value;
        const evenementDemandeRepo = database_1.AppDataSource.getRepository(evenementDemande_1.EvenementDemande);
        try {
            const evenementDemandeCreated = yield evenementDemandeRepo.save(evenementDemandeRequest);
            res.status(201).send(evenementDemandeCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/evenement-demandes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = evenementDemande_validator_1.evenementDemandeIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const evenementDemandeId = validationResult.value;
            const evenementDemandeRepository = database_1.AppDataSource.getRepository(evenementDemande_1.EvenementDemande);
            const evenementDemande = yield evenementDemandeRepository.findOneBy({ id: evenementDemandeId.id });
            if (evenementDemande === null) {
                res.status(404).send({ "error": `EvenementDemande ${evenementDemandeId.id} not found` });
                return;
            }
            yield evenementDemandeRepository.remove(evenementDemande);
            res.status(200).send("EvenementDemande supprimé avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/evenement-demandes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = evenementDemande_validator_1.evenementDemandeIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const evenementDemandeId = validationResult.value;
            const evenementDemandeUsecase = new evenementDemande_usecase_1.EvenementDemandeUsecase(database_1.AppDataSource);
            const evenementDemande = yield evenementDemandeUsecase.getOneEvenementDemande(evenementDemandeId.id);
            if (evenementDemande === null) {
                res.status(404).send({ "error": `EvenementDemande ${evenementDemandeId.id} not found` });
                return;
            }
            res.status(200).send(evenementDemande);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/evenement-demandes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = evenementDemande_validator_1.updateEvenementDemandeValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const updateEvenementDemandeRequest = validation.value;
        try {
            const evenementDemandeUsecase = new evenementDemande_usecase_1.EvenementDemandeUsecase(database_1.AppDataSource);
            const validationResult = evenementDemande_validator_1.evenementDemandeIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updatedEvenementDemande = yield evenementDemandeUsecase.updateEvenementDemande(updateEvenementDemandeRequest.id, Object.assign({}, updateEvenementDemandeRequest));
            if (updatedEvenementDemande === null) {
                res.status(404).send({ "error": `EvenementDemande ${updateEvenementDemandeRequest.id} not found` });
                return;
            }
            if (updatedEvenementDemande === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }
            res.status(200).send(updatedEvenementDemande);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.EvenementDemandeHandler = EvenementDemandeHandler;
