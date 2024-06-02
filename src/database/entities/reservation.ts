import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm"
import "reflect-metadata"
import { User } from "./user"



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


    




    constructor(id: number, description:string,dateDebut:Date,dateFin:Date,) {
        this.id = id;
        this.description = description;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
    }




}