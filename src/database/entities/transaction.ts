import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne} from "typeorm"
import "reflect-metadata"
import { User } from "./user"
import { Evenement } from "./evenement"
import { Visiteur } from "./visiteur"

export enum TypeTransaction {
    Don = "Don",
    PaiementCotisations = "Cotisation",
    Inscription = "Inscription"
}


@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    emailVisiteur: string


    @ManyToOne(() => Evenement, evenement => evenement.transactions)
    evenement:Evenement

    @Column()
    montant: number

    @Column({
        type: "enum",
        enum: TypeTransaction,
    })
    type: TypeTransaction;

    @CreateDateColumn({type: "datetime"})
    dateTransaction?:Date
    

    constructor(id: number, montant:number,type:TypeTransaction,dateTransaction:Date,emailVisiteur:string,evenement:Evenement) {
        this.id = id;
        this.montant = montant;
        this.type = type;
        this.emailVisiteur = emailVisiteur;
        this.evenement = evenement;
    }
}