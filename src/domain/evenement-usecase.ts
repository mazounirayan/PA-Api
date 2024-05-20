import { DataSource } from "typeorm";
import { Evenement } from "../database/entities/evenement";
import { Transaction } from "../database/entities/transaction";

export interface ListEvenementRequest {
    page: number
    limit: number
    nom?: string
    date?: Date
    description?: string
    lieu?: string
}

export interface UpdateEvenementParams {
    nom?: string
    date?: Date
    description?: string
    lieu?: string
}

export class EvenementUsecase {
    constructor(private readonly db: DataSource) { }

    async listEvenements(listEvenementRequest: ListEvenementRequest): Promise<{ Evenements: Evenement[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Evenement, 'evenement');
        if (listEvenementRequest.nom) {
            query.andWhere("evenement.nom = :nom", { nom: listEvenementRequest.nom });
        }

        if (listEvenementRequest.date) {
            query.andWhere("evenement.date = :date", { date: listEvenementRequest.date });
        }

        if (listEvenementRequest.description) {
            query.andWhere("evenement.description = :description", { description: listEvenementRequest.description });
        }

        if (listEvenementRequest.lieu) {
            query.andWhere("evenement.lieu = :lieu", { lieu: listEvenementRequest.lieu });
        }

        query.leftJoinAndSelect('evenement.transactions', 'transactions')
            .skip((listEvenementRequest.page - 1) * listEvenementRequest.limit)
            .take(listEvenementRequest.limit);

        const [Evenements, totalCount] = await query.getManyAndCount();
        return {
            Evenements,
            totalCount
        };
    }

    async getOneEvenement(id: number): Promise<Evenement | null> {
        const query = this.db.createQueryBuilder(Evenement, 'evenement')
            .leftJoinAndSelect('evenement.transactions', 'transactions')
            .where("evenement.id = :id", { id: id });

        const evenement = await query.getOne();

        if (!evenement) {
            console.log({ error: `Evenement ${id} not found` });
            return null;
        }
        return evenement;
    }

    async updateEvenement(id: number, { nom, date, description, lieu }: UpdateEvenementParams): Promise<Evenement | string | null> {
        const repo = this.db.getRepository(Evenement);
        const evenementFound = await repo.findOneBy({ id });
        if (evenementFound === null) return null;

        if (nom === undefined && date === undefined && description === undefined && lieu === undefined) {
            return "No changes";
        }

        if (nom) {
            evenementFound.nom = nom;
        }
        if (date) {
            evenementFound.date = date;
        }
        if (description) {
            evenementFound.description = description;
        }
        if (lieu) {
            evenementFound.lieu = lieu;
        }

        const evenementUpdate = await repo.save(evenementFound);
        return evenementUpdate;
    }
}
