import { DataSource } from "typeorm";
import { User } from "../database/entities/user";

export interface ListUserFilter {
    limit: number
    page: number
    name?:string
    type?:string
    access_disabled?:boolean
    maintenance_status?:boolean
    capacityMax?: number
}

export interface UpdateUserParams {
     nom?: string
}




export class UserUsecase {
    constructor(private readonly db: DataSource) { }

    async listUser(listUserFilter: ListUserFilter): Promise<{ users: User[]; totalCount: number; }> {
        console.log(listUserFilter)
        const query = this.db.createQueryBuilder(User, 'user')
        if (listUserFilter.capacityMax) {
            query.andWhere('user.capacity <= :capacityMax', { capacityMax: listUserFilter.capacityMax })
        }
        query.leftJoinAndSelect('user.parrain', 'parrain')
        .skip((listUserFilter.page - 1) * listUserFilter.limit)
        .take(listUserFilter.limit)

        const [users, totalCount] = await query.getManyAndCount()
        return {
            users,
            totalCount
        }
    }

    async updateUser(id: number, { nom }: UpdateUserParams): Promise<User | null> {
        const repo = this.db.getRepository(User)
        const userfound = await repo.findOneBy({ id })
        if (userfound === null) return null

        if (nom) {
            userfound.nom = nom
        }

        const userUpdate = await repo.save(userfound)
        return userUpdate
    }


}