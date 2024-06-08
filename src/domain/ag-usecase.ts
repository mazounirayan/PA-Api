import { DataSource } from "typeorm";
import { Ag } from "../database/entities/ag";

export interface ListAgRequest {
    page: number
    limit: number
    nom?: string
    date?: Date
    description?: string
    type?: string
    quorum?: number
}

export interface UpdateAgParams {
    nom?: string
    date?: Date
    description?: string
    type?: string
    quorum?: number
}

export class AgUsecase {
    constructor(private readonly db: DataSource) { }

    async listAgs(listAgRequest: ListAgRequest): Promise<{ Ags: Ag[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Ag, 'ag');
        if (listAgRequest.nom) {
            query.andWhere("ag.nom = :nom", { nom: listAgRequest.nom });
        }

        if (listAgRequest.date) {
            query.andWhere("ag.date = :date", { date: listAgRequest.date });
        }

        if (listAgRequest.description) {
            query.andWhere("ag.description = :description", { description: listAgRequest.description });
        }

        if (listAgRequest.type) {
            query.andWhere("ag.type = :type", { type: listAgRequest.type });
        }

        if (listAgRequest.quorum !== undefined) {
            query.andWhere("ag.quorum = :quorum", { quorum: listAgRequest.quorum });
        }

        query.leftJoinAndSelect('ag.participations', 'participations')
            .leftJoinAndSelect('ag.propositions', 'propositions')
            .skip((listAgRequest.page - 1) * listAgRequest.limit)
            .take(listAgRequest.limit);

        const [Ags, totalCount] = await query.getManyAndCount();
        return {
            Ags,
            totalCount
        };
    }

    async getOneAg(id: number): Promise<Ag | null> {
        const query = this.db.createQueryBuilder(Ag, 'ag')
            .leftJoinAndSelect('ag.participations', 'participations')
            .leftJoinAndSelect('ag.propositions', 'propositions')
            .where("ag.id = :id", { id: id });

        const ag = await query.getOne();

        if (!ag) {
            console.log({ error: `Ag ${id} not found` });
            return null;
        }
        return ag;
    }

    async updateAg(id: number, { nom, date, description, type, quorum }: UpdateAgParams): Promise<Ag | string | null> {
        const repo = this.db.getRepository(Ag);
        const agFound = await repo.findOneBy({ id });
        if (agFound === null) return null;

        if (nom === undefined && date === undefined && description === undefined && type === undefined && quorum === undefined) {
            return "No changes";
        }

        if (nom) {
            agFound.nom = nom;
        }
        if (date) {
            agFound.date = date;
        }
        if (description) {
            agFound.description = description;
        }
        if (type) {
            agFound.type = type;
        }
        if (quorum !== undefined) {
            agFound.quorum = quorum;
        }

        const agUpdate = await repo.save(agFound);
        return agUpdate;
    }
}
