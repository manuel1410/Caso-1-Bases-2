import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({name:"sd_actiontypes"})
export class ActionType {

    @PrimaryGeneratedColumn()
    actiontypeid: number;

    @Column()
    name: string;

    @Column()
    iconurl: string;

}