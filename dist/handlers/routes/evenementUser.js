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
exports.EvenementUserHandler = void 0;
const database_1 = require("../../database/database");
const evenementUser_1 = require("../../database/entities/evenementUser");
const evenementUser_usecase_1 = require("../../domain/evenementUser-usecase");
const evenementUser_validator_1 = require("../validators/evenementUser-validator");
const generate_validation_message_1 = require("../validators/generate-validation-message");
const EvenementUserHandler = (app) => {
    app.get("/evenement-users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = evenementUser_validator_1.listEvenementUserValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listEvenementUserRequest = validation.value;
        let limit = 20;
        if (listEvenementUserRequest.limit) {
            limit = listEvenementUserRequest.limit;
        }
        const page = (_a = listEvenementUserRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const evenementUserUsecase = new evenementUser_usecase_1.EvenementUserUsecase(database_1.AppDataSource);
            const listEvenementUsers = yield evenementUserUsecase.listEvenementUsers(Object.assign(Object.assign({}, listEvenementUserRequest), { page, limit }));
            res.status(200).send(listEvenementUsers);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/evenement-users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = evenementUser_validator_1.createEvenementUserValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const evenementUserRequest = validation.value;
        const evenementUserRepo = database_1.AppDataSource.getRepository(evenementUser_1.EvenementUser);
        try {
            const evenementUserCreated = yield evenementUserRepo.save(evenementUserRequest);
            res.status(201).send(evenementUserCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/evenement-users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = evenementUser_validator_1.evenementUserIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const evenementUserId = validationResult.value;
            const evenementUserRepository = database_1.AppDataSource.getRepository(evenementUser_1.EvenementUser);
            const evenementUser = yield evenementUserRepository.findOneBy({ id: evenementUserId.id });
            if (evenementUser === null) {
                res.status(404).send({ "error": `EvenementUser ${evenementUserId.id} not found` });
                return;
            }
            yield evenementUserRepository.remove(evenementUser);
            res.status(200).send("EvenementUser supprimé avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/evenement-users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = evenementUser_validator_1.evenementUserIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const evenementUserId = validationResult.value;
            const evenementUserUsecase = new evenementUser_usecase_1.EvenementUserUsecase(database_1.AppDataSource);
            const evenementUser = yield evenementUserUsecase.getOneEvenementUser(evenementUserId.id);
            if (evenementUser === null) {
                res.status(404).send({ "error": `EvenementUser ${evenementUserId.id} not found` });
                return;
            }
            res.status(200).send(evenementUser);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/evenement-users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = evenementUser_validator_1.updateEvenementUserValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const updateEvenementUserRequest = validation.value;
        try {
            const evenementUserUsecase = new evenementUser_usecase_1.EvenementUserUsecase(database_1.AppDataSource);
            const validationResult = evenementUser_validator_1.evenementUserIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updatedEvenementUser = yield evenementUserUsecase.updateEvenementUser(updateEvenementUserRequest.id, Object.assign({}, updateEvenementUserRequest));
            if (updatedEvenementUser === null) {
                res.status(404).send({ "error": `EvenementUser ${updateEvenementUserRequest.id} not found` });
                return;
            }
            if (updatedEvenementUser === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }
            res.status(200).send(updatedEvenementUser);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.EvenementUserHandler = EvenementUserHandler;
