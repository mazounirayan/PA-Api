"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listParticipationAGValidation = exports.updateParticipationAGValidation = exports.participationAGIdValidation = exports.createParticipationAGValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createParticipationAGValidation = joi_1.default.object({
    user: joi_1.default.number().required(),
    ag: joi_1.default.number().required()
}).options({ abortEarly: false });
exports.participationAGIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.updateParticipationAGValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    user: joi_1.default.number().optional(),
    ag: joi_1.default.number().optional()
});
exports.listParticipationAGValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    user: joi_1.default.number().optional(),
    ag: joi_1.default.number().optional()
});
