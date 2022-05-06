import { forbidenContentMessage, notFoundContentMessage } from '../constants';
import { PostRepository } from '../database/repositories';
import { PostDTO } from '../dto';

export class PostService {
    async find(userId: number) {
        const repository = new PostRepository();
        const posts = (await repository.find()).filter(post => {
            return post.userId === userId || post.postPrivacity === 'public' ? post : null;
        });;

        return posts;
    }

    async findOne(id: number, userId: number) {
        const repository = new PostRepository();
        const post = await repository.findOne(id);

        if (post === notFoundContentMessage) return notFoundContentMessage;

        if (post) {
            return post.userId === userId || post.postPrivacity === 'public' ? post : forbidenContentMessage;
        }

        return notFoundContentMessage;
    }

    async create(postDTO: PostDTO) {
        const repository = new PostRepository();
        const post = await repository.create(postDTO);

        return post;
    }

    async update(postDTO: PostDTO) {
        const repository = new PostRepository();
        const currentPost = await repository.findOne(postDTO.id!);

        if (currentPost === notFoundContentMessage) return notFoundContentMessage;
        if (currentPost.userId !== postDTO.userId) return forbidenContentMessage;

        const post = await repository.update(postDTO);

        if (!post) return notFoundContentMessage;

        return post;
    }

    async delete(postId: number, userId: number) {
        const repository = new PostRepository();
        const currentPost = await repository.findOne(postId);

        if (currentPost === notFoundContentMessage) return notFoundContentMessage;
        if (currentPost.userId !== userId) return forbidenContentMessage;

        return await repository.delete(postId);
    }
}