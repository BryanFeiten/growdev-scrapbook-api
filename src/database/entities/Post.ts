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
export class PostEntity extends BaseEntity {
    @PrimaryColumn()
    id?: number;

    @Column({ name: 'user_id' })
    userId: number;

    @Column({ name: 'post_header' })
    postHeader: string;

    @Column({ name: 'post_content' })
    postContent: string;

    @Column({ name: 'post_privacity' })
    postPrivacity: string;

    @ManyToOne(type => UserEntity, user => user.posts)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user?: UserEntity;

    constructor(userId: number, postHeader: string, postContent: string, postPrivacity: string) {
        super();
        this.userId = userId;
        this.postHeader = postHeader;
        this.postContent = postContent;
        this.postPrivacity = postPrivacity
    }
}
