import express, { Router, Request, Response } from 'express';
import AuthController from '../controllers/auth.controller';
import AuthMiddleware from '../middleware/auth/auth.middleware';
import Validation from '../middleware/validator/validation';

export default class AuthRouter {
    private router: Router;
    private authController: AuthController;
    private authMiddleware: AuthMiddleware;
    private validation: Validation;

    constructor() {
        this.authController = new AuthController();
        this.authMiddleware = new AuthMiddleware();
        this.validation = new Validation();
        this.router = express.Router();
        this.setupRoutes();
    }

    private setupRoutes() {
        this.router.post('/register', this.validation.registerValidation, this.authController.register);
        this.router.post('/login', this.validation.loginValidation,this.authController.login);
        this.router.delete('/logout', this.authMiddleware.authenticated, this.authController.logout);
    }

    public getRouter(): Router {
        return this.router;
    }
}
