import { DataSource } from "typeorm";
import { Sondage } from "../database/entities/sondage";

export interface ListSondageRequest {
    page: number
    limit: number
    nom?: string
    date?: Date
    description?: string
    type?: string
}

export interface UpdateSondageParams {
    nom?: string
    date?: Date
    description?: string
    type?: string
}

export class SondageUsecase {
    constructor(private readonly db: DataSource) { }

    async listSondages(listSondageRequest: ListSondageRequest): Promise<{ Sondages: Sondage[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Sondage, 'sondage');
        if (listSondageRequest.nom) {
            query.andWhere("sondage.nom = :nom", { nom: listSondageRequest.nom });
        }

        if (listSondageRequest.date) {
            query.andWhere("sondage.date = :date", { date: listSondageRequest.date });
        }

        if (listSondageRequest.description) {
            query.andWhere("sondage.description = :description", { description: listSondageRequest.description });
        }

        if (listSondageRequest.type) {
            query.andWhere("sondage.type = :type", { type: listSondageRequest.type });
        }

        query.leftJoinAndSelect('sondage.propositions', 'propositions')
            .skip((listSondageRequest.page - 1) * listSondageRequest.limit)
            .take(listSondageRequest.limit);

        const [Sondages, totalCount] = await query.getManyAndCount();
        return {
            Sondages,
            totalCount
        };
    }

    async getOneSondage(id: number): Promise<Sondage | null> {
        const query = this.db.createQueryBuilder(Sondage, 'sondage')
            .leftJoinAndSelect('sondage.propositions', 'propositions')
            .where("sondage.id = :id", { id: id });

        const sondage = await query.getOne();

        if (!sondage) {
            console.log({ error: `Sondage ${id} not found` });
            return null;
        }
        return sondage;
    }

    async updateSondage(id: number, { nom, date, description, type }: UpdateSondageParams): Promise<Sondage | string | null> {
        const repo = this.db.getRepository(Sondage);
        const sondageFound = await repo.findOneBy({ id });
        if (sondageFound === null) return null;

        if (nom === undefined && date === undefined && description === undefined && type === undefined) {
            return "No changes";
        }

        if (nom) {
            sondageFound.nom = nom;
        }
        if (date) {
            sondageFound.date = date;
        }
        if (description) {
            sondageFound.description = description;
        }
        if (type) {
            sondageFound.type = type;
        }

        const sondageUpdate = await repo.save(sondageFound);
        return sondageUpdate;
    }
}