import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Solution } from "./Solution";

@Entity({name:"sd_designs"})
export class Design {
    static findAll(arg0: { where: { project: { name: string; initials: string; }; }; relations: string[]; }) {
        throw new Error("Method not implemented.");
    }

    @PrimaryGeneratedColumn()
    designid: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    ownerid: number;

    @Column()
    creationdate: string;

    @Column()
    publishdate: string;

    @Column()
    active: number;

    // realizo la relacion 1 a n con la entity de solutions,
    // ya que un diseño puede tener muchas soluciones
    
    //Nota-> dentro de los paramentros de OnetoMany se puede utilizar eager(que carga 
    // las relaciones cada vez que se cargan entidades a la base de datos)  o lazy (las 
    // relaciones se cargan una vez que acceda a ellas)

    @OneToMany('Solution', (solucion:Solution) => solucion.design, {eager:true})
    solucion: Array<Solution>;


}