import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne} from "typeorm"
import { Token } from "./token"
import "reflect-metadata"
import { Transaction } from "./transaction"
import { Tache } from "./tache"
import { Reservation } from "./reservation"
import { Demande } from "./demande"
import { EvenementDemande } from "./evenementDemande"
import { ParrainageDemande } from "./parrainageDemande"
import { Inscription } from "./inscription"
import { Visiteur } from "./visiteur"
import { ParticipationAG } from "./participationAG"
import { Vote } from "./vote"
import { Dossier } from "./dossier"

export enum UserRole {
    Visiteur = "Visiteur",
    Administrateur = "Administrateur",
    Adherent = "Adherent"
}


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nom: string

    @Column()
    prenom: string

    @Column({
        unique: true
    })
    email: string

    @Column()
    motDePasse: string

    @Column()
    numTel: string

    @Column()
    profession: string

    @Column({
        type: "enum",
        enum: UserRole,
    })
    role: UserRole;

    @Column()
    @CreateDateColumn({type: "datetime"})
    dateInscription: Date

    @Column()
    estBenevole: boolean

    @Column()
    estEnLigne: boolean

    @OneToMany(() => Tache, tache => tache.responsable)
    taches: Tache[];

    @OneToMany(() => ParrainageDemande, parrainageDemandes => parrainageDemandes.parrain)
    parrainageDemandes: ParrainageDemande[];

    @OneToMany(() => Visiteur, visiteurs => visiteurs.parrain)
    parraine: Visiteur[];

    @OneToMany(() => Token, token => token.user)
    tokens: Token[];

    @OneToMany(() => ParticipationAG, participationAG => participationAG.user)
    participationsAg: ParticipationAG[];

    @OneToMany(() => Vote, vote => vote.user)
    votes: Vote[];

    @OneToMany(() => Dossier, dossier => dossier.user)
    dossiers: Dossier[];



    constructor(id: number, nom:string, prenom:string,email: string, numTel:string ,motDePasse: string,profession:string, role: UserRole, dateInscription:Date, estBenevole: boolean,inscriptions:Inscription[], parraine:Visiteur[],tokens: Token[], participations: ParticipationAG[],taches: Tache[], votes: Vote[], parrainageDemandes:ParrainageDemande[], dossiers: Dossier[]) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.motDePasse = motDePasse;
        this.role = role;
        this.dateInscription = dateInscription;
        this.estBenevole = estBenevole;
        this.numTel = numTel;
        this.parrainageDemandes = parrainageDemandes;
        this.profession = profession
        this.estEnLigne = false;
        this.parraine = parraine
        this.taches = taches;
        this.tokens = tokens;
        this.participationsAg = participations;
        this.votes = votes;
        this.dossiers = dossiers;

    }
}