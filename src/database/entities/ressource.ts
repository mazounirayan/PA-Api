import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne} from "typeorm"
import "reflect-metadata"

import { Reservation } from "./reservation"

export enum TypeRessource{
    Vetement = "Vetement",
    Argent = "Argent",
    Alimentaire = "Alimentaire",
    MaterielMaisonDivers = "Matériel maison divers",
    Materiel = "Materiel",
    Autre = "Autre"
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

    @Column()
    quantite: number



    @Column()
    emplacement: string




    constructor(id: number, nom:string,type:TypeRessource,emplacement:string, quantite:number ,reservations:Reservation[]) {
        this.id = id;
        this.nom = nom;
        this.type = type;
        this.quantite = quantite;
        this.emplacement = emplacement;
    }
}