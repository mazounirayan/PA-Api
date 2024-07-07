import { DataSource } from "typeorm";
import { Inscription } from "../database/entities/inscription";
import { Evenement } from "../database/entities/evenement";
import { Visiteur } from "../database/entities/visiteur";

export interface ListInscriptionRequest {
    page: number
    limit: number
    emailVisiteur?: string
    evenement?: number
}

export interface UpdateInscriptionParams {
    emailVisiteur?: string
    evenement?: Evenement
}

export class InscriptionUsecase {
    constructor(private readonly db: DataSource) { }


    async deleteInscription(email:string, idEvent:number): Promise<any | null> {

        const entityManager = this.db.getRepository(Inscription);

        const sqlQuery = `delete from inscription where emailVisiteur like ? and evenementId = ?;`;

        const deleteInscription = await entityManager.query(sqlQuery, [email,idEvent]);

        return deleteInscription;
    }

    async verifEmail(email:string, id: number): Promise<any | null> {

        const entityManager = this.db.getRepository(Inscription);

        const sqlQuery = `select count(*) from inscription where emailVisiteur=? and evenementId=?;`;

        const verifEmail = await entityManager.query(sqlQuery, [email,id]);

        return verifEmail;
    }

    async nbPlace(id: number): Promise<any | null> {

        const entityManager = this.db.getRepository(Inscription);

        const sqlQuery = `select nbPlace from evenement where id=?;`;

        const nbPlace = await entityManager.query(sqlQuery, [id]);

        return nbPlace;
    }

    async listInscriptions(listInscriptionRequest: ListInscriptionRequest): Promise<{ Inscriptions: Inscription[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Inscription, 'inscription');
        if (listInscriptionRequest.emailVisiteur) {
            query.andWhere("inscription.emailVisiteur = :emailVisiteur", { emailVisiteur: listInscriptionRequest.emailVisiteur });
        }

        if (listInscriptionRequest.evenement) {
            query.andWhere("inscription.evenementId = :evenement", { evenement: listInscriptionRequest.evenement });
        }

        query.leftJoinAndSelect('inscription.evenement', 'evenement')
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
            .leftJoinAndSelect('inscription.evenement', 'evenement')
            .where("inscription.id = :id", { id: id });

        const inscription = await query.getOne();

        if (!inscription) {
            console.log({ error: `Inscription ${id} not found` });
            return null;
        }
        return inscription;
    }

    async updateInscription(id: number, { emailVisiteur, evenement }: UpdateInscriptionParams): Promise<Inscription | string | null> {
        const repo = this.db.getRepository(Inscription);
        const inscriptionFound = await repo.findOneBy({ id });
        if (inscriptionFound === null) return null;

        if (emailVisiteur === undefined && evenement === undefined) {
            return "No changes";
        }

        if (emailVisiteur) {
            inscriptionFound.emailVisiteur = emailVisiteur;
        }
        if (evenement) {
            inscriptionFound.evenement = evenement;
        }

        const inscriptionUpdate = await repo.save(inscriptionFound);
        return inscriptionUpdate;
    }
}