import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import "reflect-metadata";
import { Token } from "./token";
import { Tache } from "./tache";
import { ParrainageDemande } from "./parrainageDemande";
import { Visiteur } from "./visiteur";
import { ParticipationAG } from "./participationAG";
import { Vote } from "./vote";
import { Dossier } from "./dossier";
import { EvenementUser } from "./evenementUser"; // Importez la nouvelle entité

export enum UserRole {
    Visiteur = "Visiteur",
    Administrateur = "Administrateur",
    Adherent = "Adherent"
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nom: string;

    @Column()
    prenom: string;

    @Column({
        unique: true
    })
    email: string;

    @Column()
    motDePasse: string;

    @Column()
    numTel: string;

    @Column()
    profession: string;

    @Column({
        type: "enum",
        enum: UserRole,
    })
    role: UserRole;

    @CreateDateColumn({ type: "datetime" })
    dateInscription: Date;

    @Column()
    estBenevole: boolean;

    @Column()
    estEnLigne: boolean;

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

    @OneToMany(() => EvenementUser, evenementUser => evenementUser.user)
    evenementUsers: EvenementUser[]; 

    constructor(id: number, nom: string, prenom: string, email: string, numTel: string, motDePasse: string, profession: string, role: UserRole, dateInscription: Date, estBenevole: boolean, taches: Tache[], parrainageDemandes: ParrainageDemande[], parraine: Visiteur[], tokens: Token[], participationsAg: ParticipationAG[], votes: Vote[], dossiers: Dossier[], evenementUsers: EvenementUser[]) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.motDePasse = motDePasse;
        this.role = role;
        this.dateInscription = dateInscription;
        this.estBenevole = estBenevole;
        this.numTel = numTel;
        this.profession = profession;
        this.estEnLigne = false;
        this.parrainageDemandes = parrainageDemandes;
        this.parraine = parraine;
        this.taches = taches;
        this.tokens = tokens;
        this.participationsAg = participationsAg;
        this.votes = votes;
        this.dossiers = dossiers;
        this.evenementUsers = evenementUsers;
    }
}
