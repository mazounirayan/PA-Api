import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne} from "typeorm"
import "reflect-metadata"

import { Reservation } from "./reservation"
import { Evenement } from "./evenement"
import { EvenementUser } from "./evenementUser"

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

    @OneToMany(() => Evenement, evenement => evenement.ressource)
    evenements: Evenement[]

    @OneToMany(() => EvenementUser, evenementUser => evenementUser.user)
    evenementUsers: EvenementUser[]; 


    constructor(id: number, nom:string,type:TypeRessource,emplacement:string, quantite:number ,evenements:Evenement[], evenementUsers:EvenementUser[]){ 
        this.id = id;
        this.nom = nom;
        this.type = type;
        this.quantite = quantite;
        this.emplacement = emplacement;
        this.evenements = evenements;
        this.evenementUsers = evenementUsers;
    }
}