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
exports.DemandeHandler = void 0;
const database_1 = require("../../database/database");
const demande_1 = require("../../database/entities/demande");
const demande_usecase_1 = require("../../domain/demande-usecase");
const demande_validator_1 = require("../validators/demande-validator");
const generate_validation_message_1 = require("../validators/generate-validation-message");
const DemandeHandler = (app) => {
    app.get("/demandes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = demande_validator_1.listDemandeValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listDemandeRequest = validation.value;
        let limit = 20;
        if (listDemandeRequest.limit) {
            limit = listDemandeRequest.limit;
        }
        const page = (_a = listDemandeRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const demandeUsecase = new demande_usecase_1.DemandeUsecase(database_1.AppDataSource);
            const listDemandes = yield demandeUsecase.listDemandes(Object.assign(Object.assign({}, listDemandeRequest), { page, limit }));
            res.status(200).send(listDemandes);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/demandes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = demande_validator_1.createDemandeValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const demandeRequest = validation.value;
        const demandeRepo = database_1.AppDataSource.getRepository(demande_1.Demande);
        try {
            const demandeCreated = yield demandeRepo.save(demandeRequest);
            res.status(201).send(demandeCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/demandes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = demande_validator_1.demandeIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const demandeId = validationResult.value;
            const demandeRepository = database_1.AppDataSource.getRepository(demande_1.Demande);
            const demande = yield demandeRepository.findOneBy({ id: demandeId.id });
            if (demande === null) {
                res.status(404).send({ "error": `Demande ${demandeId.id} not found` });
                return;
            }
            yield demandeRepository.remove(demande);
            res.status(200).send("Demande supprimée avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/demandes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = demande_validator_1.demandeIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const demandeId = validationResult.value;
            const demandeUsecase = new demande_usecase_1.DemandeUsecase(database_1.AppDataSource);
            const demande = yield demandeUsecase.getOneDemande(demandeId.id);
            if (demande === null) {
                res.status(404).send({ "error": `Demande ${demandeId.id} not found` });
                return;
            }
            res.status(200).send(demande);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/demandes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = demande_validator_1.updateDemandeValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const updateDemandeRequest = validation.value;
        try {
            const demandeUsecase = new demande_usecase_1.DemandeUsecase(database_1.AppDataSource);
            const validationResult = demande_validator_1.demandeIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updatedDemande = yield demandeUsecase.updateDemande(updateDemandeRequest.id, Object.assign({}, updateDemandeRequest));
            if (updatedDemande === null) {
                res.status(404).send({ "error": `Demande ${updateDemandeRequest.id} not found` });
                return;
            }
            if (updatedDemande === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }
            res.status(200).send(updatedDemande);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.DemandeHandler = DemandeHandler;
