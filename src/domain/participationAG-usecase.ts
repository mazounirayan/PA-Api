import { DataSource } from "typeorm";
import { ParticipationAG } from "../database/entities/participationAG";
import { Ag } from "../database/entities/ag";
import { User } from "../database/entities/user";

export interface ListParticipationAGRequest {
    page: number
    limit: number
    user?: number
    ag?: number
}

export interface UpdateParticipationAGParams {
    user?: User
    ag?: Ag
}

export class ParticipationAGUsecase {
    constructor(private readonly db: DataSource) { }

    async listParticipationAGs(listParticipationAGRequest: ListParticipationAGRequest): Promise<{ ParticipationAGs: ParticipationAG[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(ParticipationAG, 'participationAG');
        if (listParticipationAGRequest.user) {
            query.andWhere("participationAG.userId = :user", { user: listParticipationAGRequest.user });
        }

        if (listParticipationAGRequest.ag) {
            query.andWhere("participationAG.agId = :ag", { ag: listParticipationAGRequest.ag });
        }

        query.leftJoinAndSelect('participationAG.user', 'user')
            .leftJoinAndSelect('participationAG.ag', 'ag')
            .skip((listParticipationAGRequest.page - 1) * listParticipationAGRequest.limit)
            .take(listParticipationAGRequest.limit);

        const [ParticipationAGs, totalCount] = await query.getManyAndCount();
        return {
            ParticipationAGs,
            totalCount
        };
    }

    async getOneParticipationAG(id: number): Promise<ParticipationAG | null> {
        const query = this.db.createQueryBuilder(ParticipationAG, 'participationAG')
            .leftJoinAndSelect('participationAG.user', 'user')
            .leftJoinAndSelect('participationAG.ag', 'ag')
            .where("participationAG.id = :id", { id: id });

        const participationAG = await query.getOne();

        if (!participationAG) {
            console.log({ error: `ParticipationAG ${id} not found` });
            return null;
        }
        return participationAG;
    }

    async updateParticipationAG(id: number, { user, ag }: UpdateParticipationAGParams): Promise<ParticipationAG | string | null> {
        const repo = this.db.getRepository(ParticipationAG);
        const participationAGFound = await repo.findOneBy({ id });
        if (participationAGFound === null) return null;

        if (user === undefined && ag === undefined) {
            return "No changes";
        }

        if (user) {
            participationAGFound.user = user;
        }
        if (ag) {
            participationAGFound.ag = ag;
        }

        const participationAGUpdate = await repo.save(participationAGFound);
        return participationAGUpdate;
    }
}
