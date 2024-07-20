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
exports.ParrainageDemandeUsecase = void 0;
const parrainageDemande_1 = require("../database/entities/parrainageDemande");
class ParrainageDemandeUsecase {
    constructor(db) {
        this.db = db;
    }
    listParrainageDemandes(listParrainageDemandeRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(parrainageDemande_1.ParrainageDemande, 'parrainageDemande');
            if (listParrainageDemandeRequest.detailsParrainage) {
                query.andWhere("parrainageDemande.detailsParrainage = :detailsParrainage", { detailsParrainage: listParrainageDemandeRequest.detailsParrainage });
            }
            if (listParrainageDemandeRequest.parrain) {
                query.andWhere("parrainageDemande.parrainId = :parrain", { parrain: listParrainageDemandeRequest.parrain });
            }
            if (listParrainageDemandeRequest.demande) {
                query.andWhere("parrainageDemande.demandeId = :demande", { demande: listParrainageDemandeRequest.demande });
            }
            query.leftJoinAndSelect('parrainageDemande.parrain', 'parrain')
                .leftJoinAndSelect('parrainageDemande.demande', 'demande')
                .skip((listParrainageDemandeRequest.page - 1) * listParrainageDemandeRequest.limit)
                .take(listParrainageDemandeRequest.limit);
            const [ParrainageDemandes, totalCount] = yield query.getManyAndCount();
            return {
                ParrainageDemandes,
                totalCount
            };
        });
    }
    getOneParrainageDemande(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(parrainageDemande_1.ParrainageDemande, 'parrainageDemande')
                .leftJoinAndSelect('parrainageDemande.parrain', 'parrain')
                .leftJoinAndSelect('parrainageDemande.demande', 'demande')
                .where("parrainageDemande.id = :id", { id: id });
            const parrainageDemande = yield query.getOne();
            if (!parrainageDemande) {
                console.log({ error: `ParrainageDemande ${id} not found` });
                return null;
            }
            return parrainageDemande;
        });
    }
    updateParrainageDemande(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { detailsParrainage, parrain, demande }) {
            const repo = this.db.getRepository(parrainageDemande_1.ParrainageDemande);
            const parrainageDemandeFound = yield repo.findOneBy({ id });
            if (parrainageDemandeFound === null)
                return null;
            if (detailsParrainage === undefined && parrain === undefined && demande === undefined) {
                return "No changes";
            }
            if (detailsParrainage) {
                parrainageDemandeFound.detailsParrainage = detailsParrainage;
            }
            if (parrain) {
                parrainageDemandeFound.parrain = parrain;
            }
            if (demande) {
                parrainageDemandeFound.demande = demande;
            }
            const parrainageDemandeUpdate = yield repo.save(parrainageDemandeFound);
            return parrainageDemandeUpdate;
        });
    }
}
exports.ParrainageDemandeUsecase = ParrainageDemandeUsecase;
