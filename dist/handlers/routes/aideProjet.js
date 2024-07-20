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
exports.AideProjetHandler = void 0;
const database_1 = require("../../database/database");
const aideProjet_1 = require("../../database/entities/aideProjet");
const aideProjet_usecase_1 = require("../../domain/aideProjet-usecase");
const aideProjet_validator_1 = require("../validators/aideProjet-validator");
const generate_validation_message_1 = require("../validators/generate-validation-message");
const AideProjetHandler = (app) => {
    app.get("/aide-projets", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = aideProjet_validator_1.listAideProjetValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listAideProjetRequest = validation.value;
        let limit = 20;
        if (listAideProjetRequest.limit) {
            limit = listAideProjetRequest.limit;
        }
        const page = (_a = listAideProjetRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const aideProjetUsecase = new aideProjet_usecase_1.AideProjetUsecase(database_1.AppDataSource);
            const listAideProjets = yield aideProjetUsecase.listAideProjets(Object.assign(Object.assign({}, listAideProjetRequest), { page, limit }));
            res.status(200).send(listAideProjets);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/aide-projets", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = aideProjet_validator_1.createAideProjetValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const aideProjetRequest = validation.value;
        const aideProjetRepo = database_1.AppDataSource.getRepository(aideProjet_1.AideProjet);
        try {
            const aideProjetCreated = yield aideProjetRepo.save(aideProjetRequest);
            res.status(201).send(aideProjetCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/aide-projets/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = aideProjet_validator_1.aideProjetIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const aideProjetId = validationResult.value;
            const aideProjetRepository = database_1.AppDataSource.getRepository(aideProjet_1.AideProjet);
            const aideProjet = yield aideProjetRepository.findOneBy({ id: aideProjetId.id });
            if (aideProjet === null) {
                res.status(404).send({ "error": `AideProjet ${aideProjetId.id} not found` });
                return;
            }
            yield aideProjetRepository.remove(aideProjet);
            res.status(200).send("AideProjet supprimé avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/aide-projets/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = aideProjet_validator_1.aideProjetIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const aideProjetId = validationResult.value;
            const aideProjetUsecase = new aideProjet_usecase_1.AideProjetUsecase(database_1.AppDataSource);
            const aideProjet = yield aideProjetUsecase.getOneAideProjet(aideProjetId.id);
            if (aideProjet === null) {
                res.status(404).send({ "error": `AideProjet ${aideProjetId.id} not found` });
                return;
            }
            res.status(200).send(aideProjet);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/aide-projets/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = aideProjet_validator_1.updateAideProjetValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const updateAideProjetRequest = validation.value;
        try {
            const aideProjetUsecase = new aideProjet_usecase_1.AideProjetUsecase(database_1.AppDataSource);
            const validationResult = aideProjet_validator_1.aideProjetIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updatedAideProjet = yield aideProjetUsecase.updateAideProjet(updateAideProjetRequest.id, Object.assign({}, updateAideProjetRequest));
            if (updatedAideProjet === null) {
                res.status(404).send({ "error": `AideProjet ${updateAideProjetRequest.id} not found` });
                return;
            }
            if (updatedAideProjet === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }
            res.status(200).send(updatedAideProjet);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.AideProjetHandler = AideProjetHandler;
