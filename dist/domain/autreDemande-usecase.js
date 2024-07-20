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
exports.AutreDemandeUsecase = void 0;
const autreDemande_1 = require("../database/entities/autreDemande");
class AutreDemandeUsecase {
    constructor(db) {
        this.db = db;
    }
    listAutreDemandes(listAutreDemandeRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(autreDemande_1.AutreDemande, 'autreDemande');
            if (listAutreDemandeRequest.titre) {
                query.andWhere("autreDemande.titre = :titre", { titre: listAutreDemandeRequest.titre });
            }
            if (listAutreDemandeRequest.description) {
                query.andWhere("autreDemande.description = :description", { description: listAutreDemandeRequest.description });
            }
            if (listAutreDemandeRequest.demande) {
                query.andWhere("autreDemande.demandeId = :demande", { demande: listAutreDemandeRequest.demande });
            }
            query.leftJoinAndSelect('autreDemande.demande', 'demande')
                .skip((listAutreDemandeRequest.page - 1) * listAutreDemandeRequest.limit)
                .take(listAutreDemandeRequest.limit);
            const [AutreDemandes, totalCount] = yield query.getManyAndCount();
            return {
                AutreDemandes,
                totalCount
            };
        });
    }
    getOneAutreDemande(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(autreDemande_1.AutreDemande, 'autreDemande')
                .leftJoinAndSelect('autreDemande.demande', 'demande')
                .where("autreDemande.id = :id", { id: id });
            const autreDemande = yield query.getOne();
            if (!autreDemande) {
                console.log({ error: `AutreDemande ${id} not found` });
                return null;
            }
            return autreDemande;
        });
    }
    updateAutreDemande(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { titre, description, demande }) {
            const repo = this.db.getRepository(autreDemande_1.AutreDemande);
            const autreDemandeFound = yield repo.findOneBy({ id });
            if (autreDemandeFound === null)
                return null;
            if (titre === undefined && description === undefined && demande === undefined) {
                return "No changes";
            }
            if (titre) {
                autreDemandeFound.titre = titre;
            }
            if (description) {
                autreDemandeFound.description = description;
            }
            if (demande) {
                autreDemandeFound.demande = demande;
            }
            const autreDemandeUpdate = yield repo.save(autreDemandeFound);
            return autreDemandeUpdate;
        });
    }
}
exports.AutreDemandeUsecase = AutreDemandeUsecase;
