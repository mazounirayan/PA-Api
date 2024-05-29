import { DataSource, DeleteResult } from "typeorm";
import { User, UserRole } from "../database/entities/user";
import { Transaction } from "../database/entities/transaction";
import { Tache } from "../database/entities/tache";
import { Reservation } from "../database/entities/reservation";
import { Token } from "../database/entities/token";
import { Demande } from "../database/entities/demande";

export interface ListUserRequest {
    page: number
    limit: number
    nom?: string
    prenom?: string
    email?: string
    role?: UserRole
    estBenevole?: boolean
}

export interface UpdateUserParams {
    nom?: string
    prenom?: string
    email?: string
    motDePasse?: string
    role?: UserRole
    estBenevole?: boolean
}

export class UserUsecase {
    constructor(private readonly db: DataSource) { }

    async deleteToken(id: number): Promise<DeleteResult> {

        const TokenDelete = await this.db.createQueryBuilder().delete().from(Token).where("userId = :id", { id: id }).execute();

        return TokenDelete;

    }

    async listUsers(listUserRequest: ListUserRequest): Promise<{ Users: User[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(User, 'user');
        if (listUserRequest.nom) {
            query.andWhere("user.nom = :nom", { nom: listUserRequest.nom });
        }

        if (listUserRequest.prenom) {
            query.andWhere("user.prenom = :prenom", { prenom: listUserRequest.prenom });
        }

        if (listUserRequest.email) {
            query.andWhere("user.email = :email", { email: listUserRequest.email });
        }

        if (listUserRequest.role) {
            query.andWhere("user.role = :role", { role: listUserRequest.role });
        }

        if (listUserRequest.estBenevole !== undefined) {
            query.andWhere("user.estBenevole = :estBenevole", { estBenevole: listUserRequest.estBenevole });
        }

        query.leftJoinAndSelect('user.transactions', 'transactions')
            .leftJoinAndSelect('user.taches', 'taches')
            .leftJoinAndSelect('user.reservations', 'reservations')
            .leftJoinAndSelect('user.tokens', 'tokens')
            .leftJoinAndSelect('user.demandes', 'demandes')
            .leftJoinAndSelect('user.parrainageDemandes', 'parrainageDemandes')
            .skip((listUserRequest.page - 1) * listUserRequest.limit)
            .take(listUserRequest.limit);

        const [Users, totalCount] = await query.getManyAndCount();
        return {
            Users,
            totalCount
        };
    }

    async getOneUser(id: number): Promise<User | null> {
        const query = this.db.createQueryBuilder(User, 'user')
            .leftJoinAndSelect('user.transactions', 'transactions')
            .leftJoinAndSelect('user.taches', 'taches')
            .leftJoinAndSelect('user.reservations', 'reservations')
            .leftJoinAndSelect('user.tokens', 'tokens')
            .leftJoinAndSelect('user.demandes', 'demandes')
            .leftJoinAndSelect('user.parrainageDemandes', 'parrainageDemandes')
            .where("user.id = :id", { id: id });

        const user = await query.getOne();

        if (!user) {
            console.log({ error: `User ${id} not found` });
            return null;
        }
        return user;
    }

    async updateUser(id: number, { nom, prenom, email, motDePasse, role, estBenevole }: UpdateUserParams): Promise<User | string | null> {
        const repo = this.db.getRepository(User);
        const userFound = await repo.findOneBy({ id });
        if (userFound === null) return null;

        if (nom === undefined && prenom === undefined && email === undefined && motDePasse === undefined && role === undefined && estBenevole === undefined) {
            return "No changes";
        }

        if (nom) {
            userFound.nom = nom;
        }
        if (prenom) {
            userFound.prenom = prenom;
        }
        if (email) {
            userFound.email = email;
        }
        if (motDePasse) {
            userFound.motDePasse = motDePasse;
        }
        if (role) {
            userFound.role = role;
        }
        if (estBenevole !== undefined) {
            userFound.estBenevole = estBenevole;
        }

        const userUpdate = await repo.save(userFound);
        return userUpdate;
    }
}
