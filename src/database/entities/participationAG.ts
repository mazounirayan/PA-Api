import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Ag } from './ag';
import { User } from './user';


@Entity()
export class ParticipationAG {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.participationsAg)
    user: User;

    @ManyToOne(() => Ag, ag => ag.participations, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    ag: Ag;

    constructor(id:number,user: User, ag: Ag) {
        this.id = id;
        this.user = user;
        this.ag = ag;
    }
}
