import express from 'express';
import { blogsRouter } from './routers/blogRouters';
import { postsRouter } from './routers/postRouters';
import { testingRouter } from './routers/testingRouter';
import {userRouter} from "./routers/userRoutes";
import {authRouter} from "./routers/authRoutes";
import cors from 'cors';
import {commentRouter} from "./routers/commentRouters";




const app = express();
app.use(express.json());
app.use(cors());

app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
app.use('/testing', testingRouter);
app.use('/users', userRouter)
app.use('/auth', authRouter);
app.use('/comments', commentRouter);
export default app;