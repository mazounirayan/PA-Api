import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Dossier } from "./dossier";

@Entity()
export class Token {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:"varchar", length:255})
    token: string;

    @Column({ type: "varchar", length: 255 })
    blobName: string;

    @ManyToOne(() => User, user => user.tokens)
    user: User;

    @OneToMany(() => Dossier, dossier => dossier.token)
    dossiers: Dossier[];

    constructor(id: number, token: string, blobName:string ,user: User, dossiers: Dossier[]) {
        this.id = id
        this.token = token
        this.blobName = blobName
        this.user = user
        this.dossiers = dossiers
    }
}