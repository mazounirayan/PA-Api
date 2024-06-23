import { DataSource } from "typeorm";
import { Demande } from "../database/entities/demande";
import { EvenementDemande } from "../database/entities/evenementDemande";

export interface ListEvenementDemandeRequest {
    page: number
    limit: number
    titre?: string
    date?: Date
    description?: string
    lieu?: string
    demande?: number
}

export interface UpdateEvenementDemandeParams {
    titre?: string
    date?: Date
    description?: string
    lieu?: string
    demande?: Demande
}

export class EvenementDemandeUsecase {
    constructor(private readonly db: DataSource) { }

    async listEvenementDemandes(listEvenementDemandeRequest: ListEvenementDemandeRequest): Promise<{ EvenementDemandes: EvenementDemande[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(EvenementDemande, 'evenementDemande');
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

        const [EvenementDemandes, totalCount] = await query.getManyAndCount();
        return {
            EvenementDemandes,
            totalCount
        };
    }

    async getOneEvenementDemande(id: number): Promise<EvenementDemande | null> {
        const query = this.db.createQueryBuilder(EvenementDemande, 'evenementDemande')
            .leftJoinAndSelect('evenementDemande.demande', 'demande')
            .where("evenementDemande.id = :id", { id: id });

        const evenementDemande = await query.getOne();

        if (!evenementDemande) {
            console.log({ error: `EvenementDemande ${id} not found` });
            return null;
        }
        return evenementDemande;
    }

    async updateEvenementDemande(id: number, { titre, date, description, lieu, demande }: UpdateEvenementDemandeParams): Promise<EvenementDemande | string | null> {
        const repo = this.db.getRepository(EvenementDemande);
        const evenementDemandeFound = await repo.findOneBy({ id });
        if (evenementDemandeFound === null) return null;

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

        const evenementDemandeUpdate = await repo.save(evenementDemandeFound);
        return evenementDemandeUpdate;
    }
}
