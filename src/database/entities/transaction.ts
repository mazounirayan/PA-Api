import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne} from "typeorm"
import "reflect-metadata"
import { User } from "./user"
import { Evenement } from "./evenement"
import { Visiteur } from "./visiteur"

export enum TypeTransaction {
    Don = "Don",
    PaiementCotisations = "Cotisation",
    PaiementEvenement = "Paiement evenement",
    Inscription = "Inscription"
}


@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Visiteur, visiteur => visiteur.transactions)
    visiteur: Visiteur


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
    dateTransaction:Date
    

    constructor(id: number, montant:number,type:TypeTransaction,dateTransaction:Date,visiteur:Visiteur,evenement:Evenement) {
        this.id = id;
        this.montant = montant;
        this.type = type;
        this.dateTransaction = dateTransaction;
        this.visiteur = visiteur;
        this.evenement = evenement;
    }





}