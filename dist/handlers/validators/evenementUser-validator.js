"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEvenementUserValidation = exports.updateEvenementUserValidation = exports.evenementUserIdValidation = exports.createEvenementUserValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createEvenementUserValidation = joi_1.default.object({
    evenement: joi_1.default.number().required(),
    user: joi_1.default.number().required()
});
exports.evenementUserIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.updateEvenementUserValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    evenement: joi_1.default.number().optional(),
    user: joi_1.default.number().optional()
});
exports.listEvenementUserValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    evenement: joi_1.default.number().optional(),
    user: joi_1.default.number().optional()
});
