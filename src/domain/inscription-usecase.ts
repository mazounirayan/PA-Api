import { DataSource } from "typeorm";
import { Inscription } from "../database/entities/inscription";
import { Evenement } from "../database/entities/evenement";
import { Visiteur } from "../database/entities/visiteur";

export interface ListInscriptionRequest {
    page: number
    limit: number
    visiteur?: number
    evenement?: number
}

export interface UpdateInscriptionParams {
    visiteur?: Visiteur
    evenement?: Evenement
}

export class InscriptionUsecase {
    constructor(private readonly db: DataSource) { }

    async listInscriptions(listInscriptionRequest: ListInscriptionRequest): Promise<{ Inscriptions: Inscription[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Inscription, 'inscription');
        if (listInscriptionRequest.visiteur) {
            query.andWhere("inscription.visiteurId = :visiteur", { visiteur: listInscriptionRequest.visiteur });
        }

        if (listInscriptionRequest.evenement) {
            query.andWhere("inscription.evenementId = :evenement", { evenement: listInscriptionRequest.evenement });
        }

        query.leftJoinAndSelect('inscription.visiteur', 'visiteur')
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
            .leftJoinAndSelect('inscription.visiteur', 'visiteur')
            .leftJoinAndSelect('inscription.evenement', 'evenement')
            .where("inscription.id = :id", { id: id });

        const inscription = await query.getOne();

        if (!inscription) {
            console.log({ error: `Inscription ${id} not found` });
            return null;
        }
        return inscription;
    }

    async updateInscription(id: number, { visiteur, evenement }: UpdateInscriptionParams): Promise<Inscription | string | null> {
        const repo = this.db.getRepository(Inscription);
        const inscriptionFound = await repo.findOneBy({ id });
        if (inscriptionFound === null) return null;

        if (visiteur === undefined && evenement === undefined) {
            return "No changes";
        }

        if (visiteur) {
            inscriptionFound.visiteur = visiteur;
        }
        if (evenement) {
            inscriptionFound.evenement = evenement;
        }

        const inscriptionUpdate = await repo.save(inscriptionFound);
        return inscriptionUpdate;
    }
}
