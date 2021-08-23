import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({name:"sd_problemlinks"})
export class ProblemLink {

    @Column()
    problemid: number;

    @Column()
    linkid: number;

    @Column()
    deleted: number;

    @PrimaryGeneratedColumn()
    Problemlinkid: number;
}