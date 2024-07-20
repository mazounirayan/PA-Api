"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listReservationValidation = exports.updateReservationValidation = exports.reservationIdValidation = exports.createReservationValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createReservationValidation = joi_1.default.object({
    dateDebut: joi_1.default.date().required(),
    dateFin: joi_1.default.date().required(),
    description: joi_1.default.string().required(),
    ressource: joi_1.default.number().required(),
    user: joi_1.default.number().required()
}).options({ abortEarly: false });
exports.reservationIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.updateReservationValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    dateDebut: joi_1.default.date().optional(),
    dateFin: joi_1.default.date().optional(),
    description: joi_1.default.string().optional(),
    ressource: joi_1.default.number().optional(),
    user: joi_1.default.number().optional()
});
exports.listReservationValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    dateDebut: joi_1.default.date().optional(),
    dateFin: joi_1.default.date().optional(),
    description: joi_1.default.string().optional(),
    ressource: joi_1.default.number().optional(),
    user: joi_1.default.number().optional()
});
