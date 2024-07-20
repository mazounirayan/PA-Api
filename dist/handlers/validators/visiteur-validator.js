"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifVisiteur = exports.listVisiteurValidation = exports.updateVisiteurValidation = exports.visiteurEmailValidation = exports.createVisiteurValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createVisiteurValidation = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    nom: joi_1.default.string().required(),
    prenom: joi_1.default.string().required(),
    age: joi_1.default.number().integer().required(),
    numTel: joi_1.default.string().required(),
    adresse: joi_1.default.string().required(),
    profession: joi_1.default.string().required(),
    estBenevole: joi_1.default.boolean().required(),
    parrain: joi_1.default.number().optional()
}).options({ abortEarly: false });
exports.visiteurEmailValidation = joi_1.default.object({
    email: joi_1.default.string().email().required(),
});
exports.updateVisiteurValidation = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    nom: joi_1.default.string().optional(),
    prenom: joi_1.default.string().optional(),
    age: joi_1.default.number().integer().optional(),
    numTel: joi_1.default.string().optional(),
    adresse: joi_1.default.string().optional(),
    profession: joi_1.default.string().optional(),
    estBenevole: joi_1.default.boolean().optional(),
    parrain: joi_1.default.number().optional()
});
exports.listVisiteurValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    email: joi_1.default.string().email().optional(),
    nom: joi_1.default.string().optional(),
    prenom: joi_1.default.string().optional(),
    age: joi_1.default.number().integer().optional(),
    numTel: joi_1.default.string().optional(),
    adresse: joi_1.default.string().optional(),
    profession: joi_1.default.string().optional(),
    dateInscription: joi_1.default.date().optional(),
    estBenevole: joi_1.default.boolean().optional(),
    parrain: joi_1.default.number().optional()
});
exports.verifVisiteur = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    numTel: joi_1.default.string().required(),
}).options({ abortEarly: false });
