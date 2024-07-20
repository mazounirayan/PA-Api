"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTacheValidation = exports.updateTacheValidation = exports.tacheIdValidation = exports.createTacheValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createTacheValidation = joi_1.default.object({
    dateDebut: joi_1.default.date().required(),
    dateFin: joi_1.default.date().required(),
    description: joi_1.default.string().required(),
    responsable: joi_1.default.number().required(),
    statut: joi_1.default.string().valid('Fini', 'En cours').required(),
}).options({ abortEarly: false });
exports.tacheIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.updateTacheValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    dateDebut: joi_1.default.date().optional(),
    dateFin: joi_1.default.date().optional(),
    description: joi_1.default.string().optional(),
    responsable: joi_1.default.number().optional(),
    statut: joi_1.default.string().valid('Fini', 'En cours').optional(),
});
exports.listTacheValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    dateDebut: joi_1.default.date().optional(),
    dateFin: joi_1.default.date().optional(),
    description: joi_1.default.string().optional(),
    responsable: joi_1.default.number().optional(),
    statut: joi_1.default.string().valid('Fini', 'En cours').optional(),
});
