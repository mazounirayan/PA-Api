import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { EvenementDemande } from "./evenementDemande";
import { AideProjetDemande } from "./aideProjetDemande";
import { ParrainageDemande } from "./parrainageDemande";
import { Visiteur } from "./visiteur";



export enum TypeDemande {
    Projet = "Projet",
    Evenement = "Evénement",
    Parrainage = "Parrainage",
    Autre = "Autre"
}

export enum StatutDemande {
    EnAttente = "En attente",
    Acceptee = "Acceptée",
    Refusee = "Refusée"
}
 
@Entity()
export class Demande {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: TypeDemande;


    @Column()
    dateDemande: Date;

    @Column()
    statut: StatutDemande;

    @ManyToOne(() => Visiteur, visiteur => visiteur.demandes)
    visiteur: Visiteur;

    @OneToMany(() => EvenementDemande, evenementDemande => evenementDemande.demande)
    evenementDemandes: EvenementDemande[];

    @OneToMany(() => AideProjetDemande, aideProjetDemande => aideProjetDemande.demande)
    aideProjetDemandes: AideProjetDemande[];

    @OneToMany(() => ParrainageDemande, parrainageDemande => parrainageDemande.demande)
    parrainageDemandes: ParrainageDemande[];

    constructor(id: number, type: TypeDemande,dateDemande :Date,statut:StatutDemande ,visiteur: Visiteur, evenementDemandes: EvenementDemande[], aideProjetDemandes:AideProjetDemande[], parrainageDemandes:ParrainageDemande[]) {
        this.id = id
        this.type = type
        this.dateDemande = dateDemande
        this.statut = statut
        this.visiteur = visiteur
        this.evenementDemandes = evenementDemandes
        this.aideProjetDemandes = aideProjetDemandes
        this.parrainageDemandes = parrainageDemandes


    }
}