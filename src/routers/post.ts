import { Router } from 'express';
import { HttpRouter } from '../contracts';
import { checkToken } from '../middlewares/user';
import PostController from '../controllers/post';
import postValidation from '../middlewares/post';

export default class PostRoutes implements HttpRouter {
    init() {
        const routes = Router();
        const controller = new PostController();

        routes.get('/post', checkToken, controller.index);
        routes.get('/post/:id', checkToken, controller.show);
        routes.post('/post', [checkToken, postValidation], controller.store);
        routes.put('/post/:id', [checkToken, postValidation], controller.update);
        routes.delete('/post/:id', checkToken, controller.delete);

        return routes;
    }
}