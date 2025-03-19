import { Router, Request, Response } from 'express';
import { jwtAuthMiddleware } from '../middlewares/jwtAuthMiddleware';
import { inputCheckErrorsMiddleware } from '../middlewares/validationMiddleware';
import { commentService } from '../services/commentService';
import { commentValidators } from '../validators/commentValidators';



export const commentRouter = Router();

//обновление комментария
commentRouter.put('/:commentId',
    jwtAuthMiddleware,
    commentValidators,
    inputCheckErrorsMiddleware,
    async (req: Request, res: Response) => {
        const { commentId } = req.params;
        const userId = req.userId!;
        const result = await commentService.updateComment(commentId, { content: req.body.content }, userId);
        if (result.status === 204) {
            res.sendStatus(204);
        } else if (result.status === 403) {
            res.sendStatus(403);
        } else if (result.status === 404) {
            res.sendStatus(404);
        } else {
            res.status(400).json({
                errorsMessages: [{ field: 'content', message: result.error || 'Bad Request' }]
            });
        }
    }
);

//удаление комментария
commentRouter.delete('/:commentId',
    jwtAuthMiddleware,
    async (req: Request, res: Response) => {
        const { commentId } = req.params;
        const userId = req.userId!;
        const result = await commentService.deleteComment(commentId, userId);
        if (result.status === 204) {
            res.sendStatus(204);
        } else if (result.status === 403) {
            res.sendStatus(403);
        } else if (result.status === 404) {
            res.sendStatus(404);
        } else {
            res.sendStatus(400);
        }
    }
);

// получение комментария по id
commentRouter.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const comment = await commentService.getCommentById(id);
    comment ? res.status(200).json(comment) : res.sendStatus(404);
});
