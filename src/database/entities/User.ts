import {
    Entity,
    BaseEntity,
    PrimaryColumn,
    Column,
    OneToMany,
} from "typeorm";
import { PostEntity } from './Post';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
    @PrimaryColumn()
    id?: number;

    @Column({ name: 'first_name' })
    firstName: string;

    @Column({ name: 'last_name' })
    lastName: string;

    @Column()
    gender: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ name: 'birth_date' })
    birthDate: Date;

    @OneToMany(type => PostEntity, post => post.user)
    posts?: PostEntity[];

    constructor(
        firstName: string,
        lastName: string,
        gender: string,
        email: string,
        password: string,
        birthDate: Date
     ) {
        super();
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.email = email;
        this.password = password;
        this.birthDate = birthDate;

    }
}
