import {
    Entity,
    BaseEntity,
    PrimaryColumn,
    Column,
    OneToMany,
    BeforeInsert,
    BeforeUpdate,
    AfterLoad,
} from "typeorm";
import { PostEntity } from './Post';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
    @PrimaryColumn()
    id?: number;

    @Column()
    username: string;

    @Column({ name: 'full_name' })
    fullName: string;

    @Column()
    gender: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ name: 'birth_date' })
    birthDate: string;

    @Column({ name: 'auto_token' })
    autoToken?: string;

    @OneToMany(type => PostEntity, post => post.user)
    posts?: PostEntity[];

    private tempPassword?: string;

    @AfterLoad()
    loadTempPassword(): void {
        this.tempPassword = this.password;
    }

    @BeforeInsert()
    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 10);
    }

    @BeforeUpdate()
    encryptPassword(): void {
        if (this.tempPassword !== this.password) {
            this.hashPassword();
        }
    }

    async checkValidLogin(email: string, password: string) {
        return this.email === email && await bcrypt.compare(password, this.password);
    }

    constructor(
        username: string,
        fullName: string,
        gender: string,
        email: string,
        password: string,
        birthDate: string,
        autoToken?: string,
    ) {
        super();
        this.username = username;
        this.fullName = fullName;
        this.gender = gender;
        this.email = email;
        this.password = password;
        this.birthDate = birthDate;
        this.autoToken = autoToken;
    }
}
