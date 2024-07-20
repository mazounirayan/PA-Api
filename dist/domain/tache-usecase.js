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
exports.TacheUsecase = void 0;
const tache_1 = require("../database/entities/tache");
class TacheUsecase {
    constructor(db) {
        this.db = db;
    }
    listShowtime(listTacheRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(tache_1.Tache, 'tache');
            if (listTacheRequest.dateDebut) {
                query.andWhere("tache.dateDebut = :dateDebut", { dateDebut: listTacheRequest.dateDebut });
            }
            if (listTacheRequest.dateFin) {
                query.andWhere("tache.dateFin = :dateFin", { dateFin: listTacheRequest.dateFin });
            }
            if (listTacheRequest.description) {
                query.andWhere("tache.description = :description", { description: listTacheRequest.description });
            }
            if (listTacheRequest.responsable) {
                query.andWhere("tache.responsable = :responsable", { responsable: listTacheRequest.responsable });
            }
            if (listTacheRequest.statut) {
                query.andWhere("tache.statut = :statut", { statut: listTacheRequest.statut });
            }
            query.leftJoinAndSelect('tache.responsable', 'responsable')
                .skip((listTacheRequest.page - 1) * listTacheRequest.limit)
                .take(listTacheRequest.limit);
            const [Taches, totalCount] = yield query.getManyAndCount();
            return {
                Taches,
                totalCount
            };
        });
    }
    getOneTache(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(tache_1.Tache, 'tache');
            query.leftJoinAndSelect('tache.responsable', 'responsable')
                .where("tache.id = :id", { id: id });
            const tache = yield query.getOne();
            // Vérifier si le ticket existe
            if (!tache) {
                console.log({ error: `Tache ${id} not found` });
                return null;
            }
            return tache;
        });
    }
    updateTache(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { dateDebut, dateFin, description, statut, responsable }) {
            const repo = this.db.getRepository(tache_1.Tache);
            const TacheFound = yield repo.findOneBy({ id });
            if (TacheFound === null)
                return null;
            if (dateDebut === undefined && dateFin === undefined && description === undefined && statut === undefined && responsable === undefined) {
                return "No changes";
            }
            if (dateDebut) {
                TacheFound.dateDebut = dateDebut;
            }
            if (dateFin) {
                TacheFound.dateFin = dateFin;
            }
            if (description) {
                TacheFound.description = description;
            }
            if (statut) {
                TacheFound.statut = statut;
            }
            if (responsable) {
                TacheFound.responsable = responsable;
            }
            const ShowtimeUpdate = yield repo.save(TacheFound);
            return ShowtimeUpdate;
        });
    }
}
exports.TacheUsecase = TacheUsecase;
