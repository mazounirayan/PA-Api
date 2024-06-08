import { DataSource } from "typeorm";
import { Proposition, TypeProposition } from "../database/entities/proposition";
import { Ag } from "../database/entities/ag";
import { Sondage } from "../database/entities/sondage";

export interface ListPropositionRequest {
    page: number
    limit: number
    description?: string
    type?: TypeProposition
    ag?: number
    sondage?: number
}

export interface UpdatePropositionParams {
    description?: string
    type?: TypeProposition
    ag?: Ag
    sondage?: Sondage
}

export class PropositionUsecase {
    constructor(private readonly db: DataSource) { }

    async listPropositions(listPropositionRequest: ListPropositionRequest): Promise<{ Propositions: Proposition[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Proposition, 'proposition');
        if (listPropositionRequest.description) {
            query.andWhere("proposition.description = :description", { description: listPropositionRequest.description });
        }

        if (listPropositionRequest.type) {
            query.andWhere("proposition.type = :type", { type: listPropositionRequest.type });
        }

        if (listPropositionRequest.ag) {
            query.andWhere("proposition.agId = :ag", { ag: listPropositionRequest.ag });
        }

        if (listPropositionRequest.sondage) {
            query.andWhere("proposition.sondageId = :sondage", { sondage: listPropositionRequest.sondage });
        }

        query.leftJoinAndSelect('proposition.ag', 'ag')
            .leftJoinAndSelect('proposition.sondage', 'sondage')
            .leftJoinAndSelect('proposition.votes', 'votes')
            .skip((listPropositionRequest.page - 1) * listPropositionRequest.limit)
            .take(listPropositionRequest.limit);

        const [Propositions, totalCount] = await query.getManyAndCount();
        return {
            Propositions,
            totalCount
        };
    }

    async getOneProposition(id: number): Promise<Proposition | null> {
        const query = this.db.createQueryBuilder(Proposition, 'proposition')
            .leftJoinAndSelect('proposition.ag', 'ag')
            .leftJoinAndSelect('proposition.sondage', 'sondage')
            .leftJoinAndSelect('proposition.votes', 'votes')
            .where("proposition.id = :id", { id: id });

        const proposition = await query.getOne();

        if (!proposition) {
            console.log({ error: `Proposition ${id} not found` });
            return null;
        }
        return proposition;
    }

    async updateProposition(id: number, { description, type, ag, sondage }: UpdatePropositionParams): Promise<Proposition | string | null> {
        const repo = this.db.getRepository(Proposition);
        const propositionFound = await repo.findOneBy({ id });
        if (propositionFound === null) return null;

        if (description === undefined && type === undefined && ag === undefined && sondage === undefined) {
            return "No changes";
        }

        if (description) {
            propositionFound.description = description;
        }
        if (type) {
            propositionFound.type = type;
        }
        if (ag) {
            propositionFound.ag = ag;
        }
        if (sondage) {
            propositionFound.sondage = sondage;
        }

        const propositionUpdate = await repo.save(propositionFound);
        return propositionUpdate;
    }
}
