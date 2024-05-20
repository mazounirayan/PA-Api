import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne} from "typeorm"
import "reflect-metadata"
import { User } from "./user"
import { Evenement } from "./evenement"


export enum StatutTache {
    Fini = "Fini",
    EnCours = "En cours"
}

@Entity()
export class Tache {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    description: string

    @Column()
    dateDebut: Date

    @Column()
    dateFin: Date


    @Column({
        type: "enum",
        enum: StatutTache,
    })

    statut: StatutTache;

    
    @ManyToOne(() => User, user => user.transactions)
    responsable: User



    constructor(id: number, description:string,dateDebut:Date,dateFin:Date,statut:StatutTache,responsable:User) {
        this.id = id;
        this.description = description;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.statut = statut;
        this.responsable = responsable;
    }




}