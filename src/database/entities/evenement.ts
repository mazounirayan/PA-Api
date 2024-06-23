import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany} from "typeorm"
import "reflect-metadata"
import { Transaction } from "./transaction"
import { Inscription } from "./inscription"
import { Ressource } from "./ressource"


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
    estReserve:boolean

    @Column()
    nbPlace:number

    @ManyToOne(() => Ressource, ressource => ressource.evenements)
    ressource: Ressource;

    @OneToMany(() => Transaction, transactions => transactions.evenement)
    transactions: Transaction[]

    @OneToMany(() => Inscription, inscriptions => inscriptions.evenement)
    inscriptions: Inscription[];


    constructor(id: number, nom:string,date:Date,description:string,lieu:string, transactions:Transaction[], inscriptions:Inscription[], ressource:Ressource, estReserve:boolean, nbPlace:number) {
        this.id = id;
        this.nom = nom;
        this.date = date;
        this.description = description;
        this.lieu = lieu;
        this.estReserve = estReserve;
        this.nbPlace = nbPlace;
        this.transactions = transactions
        this.inscriptions = inscriptions;
        this.ressource = ressource;
    }
}