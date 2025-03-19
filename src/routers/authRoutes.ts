import { Router, Request, Response } from "express";
import { loginValidators } from "../validators/loginValidators";
import { inputCheckErrorsMiddleware } from "../middlewares/validationMiddleware";
import { userService } from "../services/userService";
import jwt from 'jsonwebtoken';
import { jwtAuthMiddleware } from "../middlewares/jwtAuthMiddleware";

const JWT_SECRET= process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES_IN= process.env.JWT_EXPIRES_IN || '1h';

export const authRouter = Router();

// возвращает JWT accessToken
authRouter.post('/login',
    loginValidators,
    inputCheckErrorsMiddleware,
    async (req: Request, res: Response) => {
        const { loginOrEmail, password } = req.body;
        const user = await userService.findUserByLoginOrEmail(loginOrEmail);
        if (!user) {
            res.sendStatus(401);
            return;
        }
        const isValid = await userService.verifyPassword(user, password);
        if (!isValid) {
            res.sendStatus(401);
            return;
        }
        // Генерация JWT-токена
        const token = jwt.sign(
            { userId: user.id, login: user.login, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
        );
        res.status(200).json({ accessToken: token });
    }
);

// получение информации о текущем пользователе
authRouter.get('/me',
    jwtAuthMiddleware,
    async (req: Request, res: Response) => {
    if (!req.userId) {
        res.sendStatus(401);
        return
    }
    res.status(200).json({
        userId: req.userId,
        login: req.userLogin,
        email: req.userEmail
    });
});


