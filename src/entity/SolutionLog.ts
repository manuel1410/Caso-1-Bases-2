import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({name:"sd_solutionslog"})
export class SolutionLog {

    @PrimaryGeneratedColumn()
    solutionlogid: number;

    @Column()
    posttime: string;

    @Column()
    actiontypeid: number;

    @Column()
    solutionid: number;
}