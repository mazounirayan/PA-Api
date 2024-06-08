import { DataSource } from "typeorm"
import { Visiteur } from "../database/entities/visiteur"

export interface ListVisiteurRequest {
    page: number
    limit: number
    nom?: string
    prenom?: string
    email?: string
    age?: number
    numTel?: string
    adresse?: string
    profession?: string
    estBenevole?: boolean
}

export interface UpdateVisiteurParams {
    nom?: string
    prenom?: string
    email?: string
    age?: number
    numTel?: string
    adresse?: string
    profession?: string
    estBenevole?: boolean
}

export class VisiteurUsecase {
    constructor(private readonly db: DataSource) { }

    async listVisiteurs(listVisiteurRequest: ListVisiteurRequest): Promise<{ Visiteurs: Visiteur[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Visiteur, 'visiteur');
        if (listVisiteurRequest.nom) {
            query.andWhere("visiteur.nom = :nom", { nom: listVisiteurRequest.nom });
        }

        if (listVisiteurRequest.prenom) {
            query.andWhere("visiteur.prenom = :prenom", { prenom: listVisiteurRequest.prenom });
        }

        if (listVisiteurRequest.email) {
            query.andWhere("visiteur.email = :email", { email: listVisiteurRequest.email });
        }

        if (listVisiteurRequest.age !== undefined) {
            query.andWhere("visiteur.age = :age", { age: listVisiteurRequest.age });
        }

        if (listVisiteurRequest.numTel) {
            query.andWhere("visiteur.numTel = :numTel", { numTel: listVisiteurRequest.numTel });
        }

        if (listVisiteurRequest.adresse) {
            query.andWhere("visiteur.adresse = :adresse", { adresse: listVisiteurRequest.adresse });
        }

        if (listVisiteurRequest.profession) {
            query.andWhere("visiteur.profession = :profession", { profession: listVisiteurRequest.profession });
        }

        if (listVisiteurRequest.estBenevole !== undefined) {
            query.andWhere("visiteur.estBenevole = :estBenevole", { estBenevole: listVisiteurRequest.estBenevole });
        }

        query.leftJoinAndSelect('visiteur.parrain', 'parrain')
            .leftJoinAndSelect('visiteur.transactions', 'transactions')
            .leftJoinAndSelect('visiteur.inscriptions', 'inscriptions')
            .leftJoinAndSelect('visiteur.demandes', 'demandes')
            .skip((listVisiteurRequest.page - 1) * listVisiteurRequest.limit)
            .take(listVisiteurRequest.limit);

        const [Visiteurs, totalCount] = await query.getManyAndCount();
        return {
            Visiteurs,
            totalCount
        };
    }

    async getOneVisiteur(id: number): Promise<Visiteur | null> {
        const query = this.db.createQueryBuilder(Visiteur, 'visiteur')
            .leftJoinAndSelect('visiteur.parrain', 'parrain')
            .leftJoinAndSelect('visiteur.transactions', 'transactions')
            .leftJoinAndSelect('visiteur.inscriptions', 'inscriptions')
            .leftJoinAndSelect('visiteur.demandes', 'demandes')
            .where("visiteur.id = :id", { id: id });

        const visiteur = await query.getOne();

        if (!visiteur) {
            console.log({ error: `Visiteur ${id} not found` });
            return null;
        }
        return visiteur;
    }

    async updateVisiteur(id: number, { nom, prenom, email, age, numTel, adresse, profession, estBenevole }: UpdateVisiteurParams): Promise<Visiteur | string | null> {
        const repo = this.db.getRepository(Visiteur);
        const visiteurFound = await repo.findOneBy({ id });
        if (visiteurFound === null) return null;

        if (nom === undefined && prenom === undefined && email === undefined && age === undefined && numTel === undefined && adresse === undefined && profession === undefined && estBenevole === undefined) {
            return "No changes";
        }

        if (nom) {
            visiteurFound.nom = nom;
        }
        if (prenom) {
            visiteurFound.prenom = prenom;
        }
        if (email) {
            visiteurFound.email = email;
        }
        if (age !== undefined) {
            visiteurFound.age = age;
        }
        if (numTel) {
            visiteurFound.numTel = numTel;
        }
        if (adresse) {
            visiteurFound.adresse = adresse;
        }
        if (profession) {
            visiteurFound.profession = profession;
        }
        if (estBenevole !== undefined) {
            visiteurFound.estBenevole = estBenevole;
        }

        const visiteurUpdate = await repo.save(visiteurFound);
        return visiteurUpdate;
    }
}