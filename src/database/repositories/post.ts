import { PostEntity } from '../entities';
import { PostDTO } from '../../dto';
import { notFoundContentMessage, successProccessMessage } from '../../constants';

export class PostRepository {
    async find() {
        const posts = await PostEntity.find();

        return posts;
    }

    async findOne(id: number) {
        const post = await PostEntity.findOne(id);

        if (!post) return notFoundContentMessage;

        return post;
    }

    async create(postDTO: PostDTO) {

        const post = new PostEntity(postDTO.userId, postDTO.postHeader, postDTO.postContent, postDTO.postPrivacity);
        await post.save();

        return post;
    }

    async update(postDTO: PostDTO) {
        const post = await PostEntity.findOne(postDTO.id);

        if (post) {
            post.postHeader = postDTO.postHeader;
            post.postContent = postDTO.postContent;
            post.postPrivacity = postDTO.postPrivacity;
            await post.save();
        }

        return post;
    }

    async delete(postId: number) {
        const post = await PostEntity.findOne(postId);

        
        if (post) {
            await PostEntity.delete(postId);
            return successProccessMessage;
        }
        
        return notFoundContentMessage;
    }
}