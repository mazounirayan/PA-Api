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
exports.SondageUsecase = void 0;
const sondage_1 = require("../database/entities/sondage");
class SondageUsecase {
    constructor(db) {
        this.db = db;
    }
    listSondages(listSondageRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(sondage_1.Sondage, 'sondage');
            if (listSondageRequest.nom) {
                query.andWhere("sondage.nom = :nom", { nom: listSondageRequest.nom });
            }
            if (listSondageRequest.date) {
                query.andWhere("sondage.date = :date", { date: listSondageRequest.date });
            }
            if (listSondageRequest.description) {
                query.andWhere("sondage.description = :description", { description: listSondageRequest.description });
            }
            if (listSondageRequest.type) {
                query.andWhere("sondage.type = :type", { type: listSondageRequest.type });
            }
            query.leftJoinAndSelect('sondage.propositions', 'propositions')
                .skip((listSondageRequest.page - 1) * listSondageRequest.limit)
                .take(listSondageRequest.limit);
            const [Sondages, totalCount] = yield query.getManyAndCount();
            return {
                Sondages,
                totalCount
            };
        });
    }
    getOneSondage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(sondage_1.Sondage, 'sondage')
                .leftJoinAndSelect('sondage.propositions', 'propositions')
                .where("sondage.id = :id", { id: id });
            const sondage = yield query.getOne();
            if (!sondage) {
                console.log({ error: `Sondage ${id} not found` });
                return null;
            }
            return sondage;
        });
    }
    updateSondage(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { nom, date, description, type }) {
            const repo = this.db.getRepository(sondage_1.Sondage);
            const sondageFound = yield repo.findOneBy({ id });
            if (sondageFound === null)
                return null;
            if (nom === undefined && date === undefined && description === undefined && type === undefined) {
                return "No changes";
            }
            if (nom) {
                sondageFound.nom = nom;
            }
            if (date) {
                sondageFound.date = date;
            }
            if (description) {
                sondageFound.description = description;
            }
            if (type) {
                sondageFound.type = type;
            }
            const sondageUpdate = yield repo.save(sondageFound);
            return sondageUpdate;
        });
    }
}
exports.SondageUsecase = SondageUsecase;
