import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne} from "typeorm"
import "reflect-metadata"
import { User } from "./user"
import { Evenement } from "./evenement"

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

    @ManyToOne(() => User, user => user.transactions)
    user: User


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
    

    constructor(id: number, montant:number,type:TypeTransaction,dateTransaction:Date,user:User,evenement:Evenement) {
        this.id = id;
        this.montant = montant;
        this.type = type;
        this.dateTransaction = dateTransaction;
        this.user = user;
        this.evenement = evenement;
    }





}