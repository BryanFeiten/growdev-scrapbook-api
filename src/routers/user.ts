import { Router } from 'express';
import UserController from '../controllers/user';
import { HttpRouter } from '../contracts';
import { loginFieldsValidator, createUserFieldValidator, checkToken } from '../middlewares/user';

export default class UserRoutes implements HttpRouter {
    init() {
        const routes = Router();
        const controller = new UserController();

        routes.get('/user', checkToken, controller.index);
        routes.get('/user/:id', checkToken, controller.show);
        routes.post('/user', createUserFieldValidator, controller.store);
        routes.put('/user/:id', checkToken, controller.update);
        routes.delete('/user/:id', checkToken, controller.delete);
        routes.post('/user/login', loginFieldsValidator, controller.login);

        return routes;
    }
}