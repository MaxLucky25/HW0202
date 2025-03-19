import { commentRepository } from "../repositories/commentRepository";
import { CreateCommentDto, UpdateCommentDto } from "../models/commentModels";
import { postRepository } from "../repositories/postRepository";

export const commentService = {
    async createComment(postId: string,
                        input: CreateCommentDto, commentatorInfo:
                        { userId: string, userLogin: string }) {
        // Проверяем, существует ли пост
        const post = await postRepository.getById(postId);
        if (!post) return null;
        return await commentRepository.create(postId, input, commentatorInfo);
    },

    async updateComment(commentId: string,
                        input: UpdateCommentDto, userId: string): Promise<{ status: number, error?: string }> {
        const comment = await commentRepository.getCommentById(commentId);
        if (!comment)
            return {status: 404, error: 'Comment not found'};
        if (comment.commentatorInfo.userId !== userId)
            return {status: 403, error: 'Forbidden'};
        const updated = await commentRepository.update(commentId, input);
        return updated ? {status: 204} : {status: 400, error: 'Update failed'};
    },

    async deleteComment(commentId: string, userId: string): Promise<{ status: number, error?: string }> {
        const comment = await commentRepository.getCommentById(commentId);
        if (!comment)
            return { status: 404, error: 'Comment not found' };
        if (comment.commentatorInfo.userId !== userId)
            return { status: 403, error: 'Forbidden' };
        const deleted = await commentRepository.delete(commentId);
        return deleted ? { status: 204 } : { status: 400, error: 'Delete failed' };
    },

    async getCommentById(commentId: string) {
        return await commentRepository.getCommentById(commentId);
    },

    async getCommentsByPostId(postId: string, query: any) {
        // При желании можно проверить существование поста
        const post = await postRepository.getById(postId);
        if (!post) return null;
        return await commentRepository.getCommentsByPostId(postId, query);
    }
};
