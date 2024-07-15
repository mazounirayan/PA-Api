"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAgValidation = exports.updateAgValidation = exports.agIdValidation = exports.createAgValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createAgValidation = joi_1.default.object({
    nom: joi_1.default.string().max(255).required(),
    date: joi_1.default.date().required(),
    description: joi_1.default.string().required(),
    type: joi_1.default.string().max(50).required(),
    quorum: joi_1.default.number().integer().required()
}).options({ abortEarly: false });
exports.agIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.updateAgValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    nom: joi_1.default.string().max(255).optional(),
    date: joi_1.default.date().optional(),
    description: joi_1.default.string().optional(),
    type: joi_1.default.string().max(50).optional(),
    quorum: joi_1.default.number().integer().optional()
});
exports.listAgValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    nom: joi_1.default.string().optional(),
    date: joi_1.default.date().optional(),
    description: joi_1.default.string().optional(),
    type: joi_1.default.string().optional(),
    quorum: joi_1.default.number().integer().optional()
});
