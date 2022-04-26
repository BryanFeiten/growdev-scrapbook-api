import {
    Entity,
    BaseEntity,
    PrimaryColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { UserEntity } from "./User";

@Entity({ name: 'post' })
export class PostEntity extends BaseEntity{
    @PrimaryColumn()
    id?: number;

    @Column()
    userId: string;

    @Column()
    postHeader: string;

    @Column()
    postContent: string;

    @Column()
    postPrivacity: string;

    @ManyToOne(type => UserEntity, user => user.posts)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user?: UserEntity;

    constructor(userId: string, postHeader: string, postContent: string, postPrivacity: string) {
        super();
        this.userId = userId;
        this.postHeader = postHeader;
        this.postContent = postContent;
        this.postPrivacity = postPrivacity
    }
}
