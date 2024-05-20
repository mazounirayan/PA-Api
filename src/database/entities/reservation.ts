import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne} from "typeorm"
import "reflect-metadata"
import { User } from "./user"
import { Ressource } from "./ressource"



@Entity()
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    dateDebut: Date;

    @Column()
    dateFin: Date;

    @Column()
    description: string

    @ManyToOne(() => Ressource, ressource => ressource.reservations)
    ressource: Ressource

    
    @ManyToOne(() => User, user => user.reservations)
    user: User



    constructor(id: number, description:string,dateDebut:Date,dateFin:Date,ressource:Ressource,user:User) {
        this.id = id;
        this.description = description;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.ressource = ressource;
        this.user = user;
    }




}