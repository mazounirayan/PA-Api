import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany} from "typeorm"
import "reflect-metadata"
import { Transaction } from "./transaction"


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

    @Column()
    estProposition:boolean

    @OneToMany(() => Transaction, transactions => transactions.evenement)
    transactions: Transaction[]


    constructor(id: number, nom:string,date:Date,description:string,lieu:string,estProposition:boolean, transactions:Transaction[]) {
        this.id = id;
        this.nom = nom;
        this.date = date;
        this.description = description;
        this.lieu = lieu;
        this.estProposition = estProposition;
        this.transactions = transactions
    }





}