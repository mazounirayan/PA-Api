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
exports.AgUsecase = void 0;
const ag_1 = require("../database/entities/ag");
class AgUsecase {
    constructor(db) {
        this.db = db;
    }
    listAgs(listAgRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(ag_1.Ag, 'ag');
            if (listAgRequest.nom) {
                query.andWhere("ag.nom = :nom", { nom: listAgRequest.nom });
            }
            if (listAgRequest.date) {
                query.andWhere("ag.date = :date", { date: listAgRequest.date });
            }
            if (listAgRequest.description) {
                query.andWhere("ag.description = :description", { description: listAgRequest.description });
            }
            if (listAgRequest.type) {
                query.andWhere("ag.type = :type", { type: listAgRequest.type });
            }
            if (listAgRequest.quorum !== undefined) {
                query.andWhere("ag.quorum = :quorum", { quorum: listAgRequest.quorum });
            }
            query.leftJoinAndSelect('ag.participations', 'participations')
                .leftJoinAndSelect('ag.propositions', 'propositions')
                .skip((listAgRequest.page - 1) * listAgRequest.limit)
                .take(listAgRequest.limit);
            const [Ags, totalCount] = yield query.getManyAndCount();
            return {
                Ags,
                totalCount
            };
        });
    }
    getOneAg(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(ag_1.Ag, 'ag')
                .leftJoinAndSelect('ag.participations', 'participations')
                .leftJoinAndSelect('ag.propositions', 'propositions')
                .where("ag.id = :id", { id: id });
            const ag = yield query.getOne();
            if (!ag) {
                console.log({ error: `Ag ${id} not found` });
                return null;
            }
            return ag;
        });
    }
    updateAg(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { nom, date, description, type, quorum }) {
            const repo = this.db.getRepository(ag_1.Ag);
            const agFound = yield repo.findOneBy({ id });
            if (agFound === null)
                return null;
            if (nom === undefined && date === undefined && description === undefined && type === undefined && quorum === undefined) {
                return "No changes";
            }
            if (nom) {
                agFound.nom = nom;
            }
            if (date) {
                agFound.date = date;
            }
            if (description) {
                agFound.description = description;
            }
            if (type) {
                agFound.type = type;
            }
            if (quorum !== undefined) {
                agFound.quorum = quorum;
            }
            const agUpdate = yield repo.save(agFound);
            return agUpdate;
        });
    }
}
exports.AgUsecase = AgUsecase;
