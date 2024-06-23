import { DataSource } from "typeorm";
import { Demande } from "../database/entities/demande";
import { AideProjetDemande } from "../database/entities/aideProjetDemande";

export interface ListAideProjetDemandeRequest {
    page: number
    limit: number
    titre?: string
    descriptionProjet?: string
    budget?: number
    deadline?: Date
    demande?: number
}

export interface UpdateAideProjetDemandeParams {
    titre?: string
    descriptionProjet?: string
    budget?: number
    deadline?: Date
    demande?: Demande
}

export class AideProjetDemandeUsecase {
    constructor(private readonly db: DataSource) { }

    async listAideProjetDemandes(listAideProjetDemandeRequest: ListAideProjetDemandeRequest): Promise<{ AideProjetDemandes: AideProjetDemande[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(AideProjetDemande, 'aideProjetDemande');
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

        const [AideProjetDemandes, totalCount] = await query.getManyAndCount();
        return {
            AideProjetDemandes,
            totalCount
        };
    }

    async getOneAideProjetDemande(id: number): Promise<AideProjetDemande | null> {
        const query = this.db.createQueryBuilder(AideProjetDemande, 'aideProjetDemande')
            .leftJoinAndSelect('aideProjetDemande.demande', 'demande')
            .where("aideProjetDemande.id = :id", { id: id });

        const aideProjetDemande = await query.getOne();

        if (!aideProjetDemande) {
            console.log({ error: `AideProjetDemande ${id} not found` });
            return null;
        }
        return aideProjetDemande;
    }

    async updateAideProjetDemande(id: number, { titre, descriptionProjet, budget, deadline, demande }: UpdateAideProjetDemandeParams): Promise<AideProjetDemande | string | null> {
        const repo = this.db.getRepository(AideProjetDemande);
        const aideProjetDemandeFound = await repo.findOneBy({ id });
        if (aideProjetDemandeFound === null) return null;

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

        const aideProjetDemandeUpdate = await repo.save(aideProjetDemandeFound);
        return aideProjetDemandeUpdate;
    }
}
