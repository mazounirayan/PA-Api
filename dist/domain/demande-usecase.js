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
exports.DemandeUsecase = void 0;
const demande_1 = require("../database/entities/demande");
class DemandeUsecase {
    constructor(db) {
        this.db = db;
    }
    listDemandes(listDemandeRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(demande_1.Demande, 'demande');
            if (listDemandeRequest.type) {
                query.andWhere("demande.type = :type", { type: listDemandeRequest.type });
            }
            if (listDemandeRequest.dateDemande) {
                query.andWhere("demande.dateDemande = :dateDemande", { dateDemande: listDemandeRequest.dateDemande });
            }
            if (listDemandeRequest.statut) {
                query.andWhere("demande.statut = :statut", { statut: listDemandeRequest.statut });
            }
            if (listDemandeRequest.emailVisiteur) {
                query.andWhere("demande.emailVisiteur = :emailVisiteur", { emailVisiteur: listDemandeRequest.emailVisiteur });
            }
            query.leftJoinAndSelect('demande.evenementDemandes', 'evenementDemandes')
                .leftJoinAndSelect('demande.aideProjetDemandes', 'aideProjetDemandes')
                .leftJoinAndSelect('demande.parrainageDemandes', 'parrainageDemandes')
                .leftJoinAndSelect('demande.autreDemandes', 'autreDemandes')
                .skip((listDemandeRequest.page - 1) * listDemandeRequest.limit)
                .take(listDemandeRequest.limit);
            const [Demandes, totalCount] = yield query.getManyAndCount();
            return {
                Demandes,
                totalCount
            };
        });
    }
    getOneDemande(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(demande_1.Demande, 'demande')
                .leftJoinAndSelect('demande.evenementDemandes', 'evenementDemandes')
                .leftJoinAndSelect('demande.aideProjetDemandes', 'aideProjetDemandes')
                .leftJoinAndSelect('demande.parrainageDemandes', 'parrainageDemandes')
                .leftJoinAndSelect('demande.autreDemandes', 'autreDemandes')
                .where("demande.id = :id", { id: id });
            const demande = yield query.getOne();
            if (!demande) {
                console.log({ error: `Demande ${id} not found` });
                return null;
            }
            return demande;
        });
    }
    updateDemande(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { type, dateDemande, statut, emailVisiteur }) {
            const repo = this.db.getRepository(demande_1.Demande);
            const demandeFound = yield repo.findOneBy({ id });
            if (demandeFound === null)
                return null;
            if (type === undefined && dateDemande === undefined && statut === undefined && emailVisiteur === undefined) {
                return "No changes";
            }
            if (type) {
                demandeFound.type = type;
            }
            if (dateDemande) {
                demandeFound.dateDemande = dateDemande;
            }
            if (statut) {
                demandeFound.statut = statut;
            }
            if (emailVisiteur) {
                demandeFound.emailVisiteur = emailVisiteur;
            }
            const demandeUpdate = yield repo.save(demandeFound);
            return demandeUpdate;
        });
    }
}
exports.DemandeUsecase = DemandeUsecase;
