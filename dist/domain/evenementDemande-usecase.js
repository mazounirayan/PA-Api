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
exports.EvenementDemandeUsecase = void 0;
const evenementDemande_1 = require("../database/entities/evenementDemande");
class EvenementDemandeUsecase {
    constructor(db) {
        this.db = db;
    }
    listEvenementDemandes(listEvenementDemandeRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(evenementDemande_1.EvenementDemande, 'evenementDemande');
            if (listEvenementDemandeRequest.titre) {
                query.andWhere("evenementDemande.titre = :titre", { titre: listEvenementDemandeRequest.titre });
            }
            if (listEvenementDemandeRequest.date) {
                query.andWhere("evenementDemande.date = :date", { date: listEvenementDemandeRequest.date });
            }
            if (listEvenementDemandeRequest.description) {
                query.andWhere("evenementDemande.description = :description", { description: listEvenementDemandeRequest.description });
            }
            if (listEvenementDemandeRequest.lieu) {
                query.andWhere("evenementDemande.lieu = :lieu", { lieu: listEvenementDemandeRequest.lieu });
            }
            if (listEvenementDemandeRequest.demande) {
                query.andWhere("evenementDemande.demandeId = :demande", { demande: listEvenementDemandeRequest.demande });
            }
            query.leftJoinAndSelect('evenementDemande.demande', 'demande')
                .skip((listEvenementDemandeRequest.page - 1) * listEvenementDemandeRequest.limit)
                .take(listEvenementDemandeRequest.limit);
            const [EvenementDemandes, totalCount] = yield query.getManyAndCount();
            return {
                EvenementDemandes,
                totalCount
            };
        });
    }
    getOneEvenementDemande(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(evenementDemande_1.EvenementDemande, 'evenementDemande')
                .leftJoinAndSelect('evenementDemande.demande', 'demande')
                .where("evenementDemande.id = :id", { id: id });
            const evenementDemande = yield query.getOne();
            if (!evenementDemande) {
                console.log({ error: `EvenementDemande ${id} not found` });
                return null;
            }
            return evenementDemande;
        });
    }
    updateEvenementDemande(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { titre, date, description, lieu, demande }) {
            const repo = this.db.getRepository(evenementDemande_1.EvenementDemande);
            const evenementDemandeFound = yield repo.findOneBy({ id });
            if (evenementDemandeFound === null)
                return null;
            if (titre === undefined && date === undefined && description === undefined && lieu === undefined && demande === undefined) {
                return "No changes";
            }
            if (titre) {
                evenementDemandeFound.titre = titre;
            }
            if (date) {
                evenementDemandeFound.date = date;
            }
            if (description) {
                evenementDemandeFound.description = description;
            }
            if (lieu) {
                evenementDemandeFound.lieu = lieu;
            }
            if (demande) {
                evenementDemandeFound.demande = demande;
            }
            const evenementDemandeUpdate = yield repo.save(evenementDemandeFound);
            return evenementDemandeUpdate;
        });
    }
}
exports.EvenementDemandeUsecase = EvenementDemandeUsecase;
