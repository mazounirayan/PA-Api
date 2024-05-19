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

    @Column()
    montant: number

    @Column({
        type: "enum",
        enum: TypeTransaction,
    })
    type: TypeTransaction;

    @CreateDateColumn({type: "datetime"})
    date:Date
    
    @ManyToOne(() => User, user => user.transactions)
    user: User


    @ManyToOne(() => Evenement, evenement => evenement.transactions)
    evenement:Evenement

    constructor(id: number, montant:number,type:TypeTransaction,date:Date,user:User,evenement:Evenement) {
        this.id = id;
        this.montant = montant;
        this.type = type;
        this.date = date;
        this.user = user;
        this.evenement = evenement;
    }





}