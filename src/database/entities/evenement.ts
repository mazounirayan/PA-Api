import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany} from "typeorm"
import "reflect-metadata"
import { Transaction } from "./transaction"
import { Inscription } from "./inscription"


@Entity()
export class Evenement {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nom: string

    @CreateDateColumn({type: "datetime"})
    date:Date
    
    @Column()
    description: string

    @Column()
    lieu:string


    @OneToMany(() => Transaction, transactions => transactions.evenement)
    transactions: Transaction[]

    @OneToMany(() => Inscription, inscriptions => inscriptions.visiteur)
    inscriptions: Inscription[];


    constructor(id: number, nom:string,date:Date,description:string,lieu:string, transactions:Transaction[], inscriptions:Inscription[]) {
        this.id = id;
        this.nom = nom;
        this.date = date;
        this.description = description;
        this.lieu = lieu;
        this.transactions = transactions
        this.inscriptions = inscriptions;
    }


}