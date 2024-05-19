import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne} from "typeorm"
import { Token } from "./token"
import "reflect-metadata"
import { Transaction } from "./transaction"
import { Tache } from "./tache"
import { Reservation } from "./reservation"

export enum TypeRessource{
    Salle = "Salle",
    Matériel = "Matériel",
    Alimentaire = "Alimentaire"
}

export enum TypeStatut{
    Disponnible = "Disponible",
    Reserve = "Réservé"
}


@Entity()
export class Ressource {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nom: string

    @Column({
        type: "enum",
        enum: TypeRessource,
    })
    type: TypeRessource;

    @Column({
        type: "enum",
        enum: TypeStatut,
    })
    statut: TypeStatut;

    @Column()
    emplacement: string


    @OneToMany(() => Reservation, reservation => reservation.ressource)
    reservations: Reservation[];



    constructor(id: number, nom:string,type:TypeRessource,statut:TypeStatut,emplacement:string, reservations:Reservation[]) {
        this.id = id;
        this.nom = nom;
        this.type = type;
        this.statut = statut;
        this.emplacement = emplacement;
        this.reservations = reservations
    }
}