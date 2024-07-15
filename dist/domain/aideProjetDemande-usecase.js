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
exports.AideProjetDemandeUsecase = void 0;
const aideProjetDemande_1 = require("../database/entities/aideProjetDemande");
class AideProjetDemandeUsecase {
    constructor(db) {
        this.db = db;
    }
    listAideProjetDemandes(listAideProjetDemandeRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(aideProjetDemande_1.AideProjetDemande, 'aideProjetDemande');
            if (listAideProjetDemandeRequest.titre) {
                query.andWhere("aideProjetDemande.titre = :titre", { titre: listAideProjetDemandeRequest.titre });
            }
            if (listAideProjetDemandeRequest.descriptionProjet) {
                query.andWhere("aideProjetDemande.descriptionProjet = :descriptionProjet", { descriptionProjet: listAideProjetDemandeRequest.descriptionProjet });
            }
            if (listAideProjetDemandeRequest.budget) {
                query.andWhere("aideProjetDemande.budget = :budget", { budget: listAideProjetDemandeRequest.budget });
            }
            if (listAideProjetDemandeRequest.deadline) {
                query.andWhere("aideProjetDemande.deadline = :deadline", { deadline: listAideProjetDemandeRequest.deadline });
            }
            if (listAideProjetDemandeRequest.demande) {
                query.andWhere("aideProjetDemande.demandeId = :demande", { demande: listAideProjetDemandeRequest.demande });
            }
            query.leftJoinAndSelect('aideProjetDemande.demande', 'demande')
                .skip((listAideProjetDemandeRequest.page - 1) * listAideProjetDemandeRequest.limit)
                .take(listAideProjetDemandeRequest.limit);
            const [AideProjetDemandes, totalCount] = yield query.getManyAndCount();
            return {
                AideProjetDemandes,
                totalCount
            };
        });
    }
    getOneAideProjetDemande(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(aideProjetDemande_1.AideProjetDemande, 'aideProjetDemande')
                .leftJoinAndSelect('aideProjetDemande.demande', 'demande')
                .where("aideProjetDemande.id = :id", { id: id });
            const aideProjetDemande = yield query.getOne();
            if (!aideProjetDemande) {
                console.log({ error: `AideProjetDemande ${id} not found` });
                return null;
            }
            return aideProjetDemande;
        });
    }
    updateAideProjetDemande(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { titre, descriptionProjet, budget, deadline, demande }) {
            const repo = this.db.getRepository(aideProjetDemande_1.AideProjetDemande);
            const aideProjetDemandeFound = yield repo.findOneBy({ id });
            if (aideProjetDemandeFound === null)
                return null;
            if (titre === undefined && descriptionProjet === undefined && budget === undefined && deadline === undefined && demande === undefined) {
                return "No changes";
            }
            if (titre) {
                aideProjetDemandeFound.titre = titre;
            }
            if (descriptionProjet) {
                aideProjetDemandeFound.descriptionProjet = descriptionProjet;
            }
            if (budget) {
                aideProjetDemandeFound.budget = budget;
            }
            if (deadline) {
                aideProjetDemandeFound.deadline = deadline;
            }
            if (demande) {
                aideProjetDemandeFound.demande = demande;
            }
            const aideProjetDemandeUpdate = yield repo.save(aideProjetDemandeFound);
            return aideProjetDemandeUpdate;
        });
    }
}
exports.AideProjetDemandeUsecase = AideProjetDemandeUsecase;
