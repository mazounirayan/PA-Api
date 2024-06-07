import { DataSource } from "typeorm";
import { Inscription } from "../database/entities/inscription";
import { User } from "../database/entities/user";
import { Evenement } from "../database/entities/evenement";

export interface ListInscriptionRequest {
    page: number
    limit: number
    user?: number
    evenement?: number
}

export interface UpdateInscriptionParams {
    user?: User
    evenement?: Evenement
}

export class InscriptionUsecase {
    constructor(private readonly db: DataSource) { }

    async listInscriptions(listInscriptionRequest: ListInscriptionRequest): Promise<{ Inscriptions: Inscription[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Inscription, 'inscription');
        if (listInscriptionRequest.user) {
            query.andWhere("inscription.userId = :user", { user: listInscriptionRequest.user });
        }

        if (listInscriptionRequest.evenement) {
            query.andWhere("inscription.evenementId = :evenement", { evenement: listInscriptionRequest.evenement });
        }

        query.leftJoinAndSelect('inscription.user', 'user')
            .leftJoinAndSelect('inscription.evenement', 'evenement')
            .skip((listInscriptionRequest.page - 1) * listInscriptionRequest.limit)
            .take(listInscriptionRequest.limit);

        const [Inscriptions, totalCount] = await query.getManyAndCount();
        return {
            Inscriptions,
            totalCount
        };
    }

    async getOneInscription(id: number): Promise<Inscription | null> {
        const query = this.db.createQueryBuilder(Inscription, 'inscription')
            .leftJoinAndSelect('inscription.user', 'user')
            .leftJoinAndSelect('inscription.evenement', 'evenement')
            .where("inscription.id = :id", { id: id });

        const inscription = await query.getOne();

        if (!inscription) {
            console.log({ error: `Inscription ${id} not found` });
            return null;
        }
        return inscription;
    }

    async updateInscription(id: number, { user, evenement }: UpdateInscriptionParams): Promise<Inscription | string | null> {
        const repo = this.db.getRepository(Inscription);
        const inscriptionFound = await repo.findOneBy({ id });
        if (inscriptionFound === null) return null;

        if (user === undefined && evenement === undefined) {
            return "No changes";
        }

        if (user) {
            inscriptionFound.user = user;
        }
        if (evenement) {
            inscriptionFound.evenement = evenement;
        }

        const inscriptionUpdate = await repo.save(inscriptionFound);
        return inscriptionUpdate;
    }
}
