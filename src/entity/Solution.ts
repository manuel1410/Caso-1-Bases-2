import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn} from "typeorm";
import { Design } from "./Design";

@Entity({name:"sd_solutions"})
export class Solution {

    @PrimaryGeneratedColumn()
    solutionid: number;

    @Column()
    problemid: number;

    @Column()
    designid: number;

    @Column()
    comments: string;

    @Column()
    posttime: string;

    @Column()
    active: number;

    // Como se realizó una relación 1 a N entre designs y solution, 
    // es necesario utilizar la relacion N a 1 desde solution hasta design.

    // Según la documentacion de typeorm, si se desea utilizar @OneToMany,
    // se requiere @ManyToOne. Sin embargo, no se requiere lo inverso (si solo le importa
    // la relación @ManyToOne, puede definirla sin tener @OneToMany en la entidad relacionada.)

    @ManyToOne(()=>Design, (design:Design)=> design.solucion)
    @JoinColumn({ name: 'designid'})
    design : Design;


}