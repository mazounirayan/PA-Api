"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEvenementValidation = exports.updateEvenementValidation = exports.evenementIdValidation = exports.createEvenementValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createEvenementValidation = joi_1.default.object({
    nom: joi_1.default.string().required(),
    date: joi_1.default.date().required(),
    description: joi_1.default.string().required(),
    lieu: joi_1.default.string().required(),
    estReserve: joi_1.default.boolean().required(),
    nbPlace: joi_1.default.number().integer().required()
});
exports.evenementIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.updateEvenementValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    nom: joi_1.default.string().optional(),
    date: joi_1.default.date().optional(),
    description: joi_1.default.string().optional(),
    lieu: joi_1.default.string().optional(),
    estReserve: joi_1.default.boolean().optional(),
    nbPlace: joi_1.default.number().integer().optional()
});
exports.listEvenementValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    nom: joi_1.default.string().optional(),
    date: joi_1.default.date().optional(),
    description: joi_1.default.string().optional(),
    lieu: joi_1.default.string().optional(),
    estReserve: joi_1.default.boolean().optional(),
    nbPlace: joi_1.default.number().integer().optional()
});
