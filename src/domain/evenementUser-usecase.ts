import { DataSource } from "typeorm";
import { EvenementUser } from "../database/entities/evenementUser";
import { Evenement } from "../database/entities/evenement";
import { User } from "../database/entities/user";

export interface ListEvenementUserRequest {
    page: number
    limit: number
    evenement?: number
    user?: number
}

export interface UpdateEvenementUserParams {
    evenement?: Evenement
    user?: User
}

export class EvenementUserUsecase {
    constructor(private readonly db: DataSource) { }

    async listEvenementUsers(listEvenementUserRequest: ListEvenementUserRequest): Promise<{ EvenementUsers: EvenementUser[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(EvenementUser, 'evenementUser');
        if (listEvenementUserRequest.evenement) {
            query.andWhere("evenementUser.evenementId = :evenement", { evenement: listEvenementUserRequest.evenement });
        }

        if (listEvenementUserRequest.user) {
            query.andWhere("evenementUser.userId = :user", { user: listEvenementUserRequest.user });
        }

        query.leftJoinAndSelect('evenementUser.evenement', 'evenement')
            .leftJoinAndSelect('evenementUser.user', 'user')
            .skip((listEvenementUserRequest.page - 1) * listEvenementUserRequest.limit)
            .take(listEvenementUserRequest.limit);

        const [EvenementUsers, totalCount] = await query.getManyAndCount();
        return {
            EvenementUsers,
            totalCount
        };
    }

    async getOneEvenementUser(id: number): Promise<EvenementUser | null> {
        const query = this.db.createQueryBuilder(EvenementUser, 'evenementUser')
            .leftJoinAndSelect('evenementUser.evenement', 'evenement')
            .leftJoinAndSelect('evenementUser.user', 'user')
            .where("evenementUser.id = :id", { id: id });

        const evenementUser = await query.getOne();

        if (!evenementUser) {
            console.log({ error: `EvenementUser ${id} not found` });
            return null;
        }
        return evenementUser;
    }

    async updateEvenementUser(id: number, { evenement, user }: UpdateEvenementUserParams): Promise<EvenementUser | string | null> {
        const repo = this.db.getRepository(EvenementUser);
        const evenementUserFound = await repo.findOneBy({ id });
        if (evenementUserFound === null) return null;

        if (evenement === undefined && user === undefined) {
            return "No changes";
        }

        if (evenement) {
            evenementUserFound.evenement = evenement;
        }
        if (user) {
            evenementUserFound.user = user;
        }

        const evenementUserUpdate = await repo.save(evenementUserFound);
        return evenementUserUpdate;
    }
}
