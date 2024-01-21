import {Column, Entity, JoinColumn, JoinTable, ManyToMany} from "typeorm";
import {Base} from "./base.entity";
import {Permission} from "./permission.entity";

@Entity()
export class Role extends Base {
    @Column()
    name: string

    // many to many relationship because 1 role can have many permissions and many permissions can be to many roles
    // If we delete a row in ManyToMany table will delete all roles inside that table
    @ManyToMany(()=> Permission, {cascade: true})
    @JoinTable({
        name: 'role_permission',
        joinColumn: {
            name: 'role_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'permission_id',
            referencedColumnName: 'id'
        }
    })
    permissions: Permission[]
}