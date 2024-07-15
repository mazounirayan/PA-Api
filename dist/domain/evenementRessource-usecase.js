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
exports.EvenementRessourceUsecase = void 0;
const evenementRessource_1 = require("../database/entities/evenementRessource");
class EvenementRessourceUsecase {
    constructor(db) {
        this.db = db;
    }
    listEvenementRessources(listEvenementRessourceRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(evenementRessource_1.EvenementRessource, 'evenementRessource');
            if (listEvenementRessourceRequest.evenement) {
                query.andWhere("evenementRessource.evenementId = :evenement", { evenement: listEvenementRessourceRequest.evenement });
            }
            if (listEvenementRessourceRequest.ressource) {
                query.andWhere("evenementRessource.ressourceId = :ressource", { ressource: listEvenementRessourceRequest.ressource });
            }
            query.leftJoinAndSelect('evenementRessource.evenement', 'evenement')
                .leftJoinAndSelect('evenementRessource.ressource', 'ressource')
                .skip((listEvenementRessourceRequest.page - 1) * listEvenementRessourceRequest.limit)
                .take(listEvenementRessourceRequest.limit);
            const [EvenementRessources, totalCount] = yield query.getManyAndCount();
            return {
                EvenementRessources,
                totalCount
            };
        });
    }
    getOneEvenementRessource(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(evenementRessource_1.EvenementRessource, 'evenementRessource')
                .leftJoinAndSelect('evenementRessource.evenement', 'evenement')
                .leftJoinAndSelect('evenementRessource.ressource', 'ressource')
                .where("evenementRessource.id = :id", { id: id });
            const evenementRessource = yield query.getOne();
            if (!evenementRessource) {
                console.log({ error: `EvenementRessource ${id} not found` });
                return null;
            }
            return evenementRessource;
        });
    }
    updateEvenementRessource(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { evenement, ressource }) {
            const repo = this.db.getRepository(evenementRessource_1.EvenementRessource);
            const evenementRessourceFound = yield repo.findOneBy({ id });
            if (evenementRessourceFound === null)
                return null;
            if (evenement === undefined && ressource === undefined) {
                return "No changes";
            }
            if (evenement) {
                evenementRessourceFound.evenement = evenement;
            }
            if (ressource) {
                evenementRessourceFound.ressource = ressource;
            }
            const evenementRessourceUpdate = yield repo.save(evenementRessourceFound);
            return evenementRessourceUpdate;
        });
    }
}
exports.EvenementRessourceUsecase = EvenementRessourceUsecase;
