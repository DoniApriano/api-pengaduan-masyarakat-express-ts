import express, { Router, Request, Response } from 'express';
import Validation from '../../middleware/validator/validation';
import AuthMiddleware from '../../middleware/auth/auth.middleware';
import TanggapanController from '../../controllers/admin/tanggapan.controller';

export default class TanggapanRouter {
    private router: Router;
    private validation: Validation;
    private authMiddleware: AuthMiddleware;
    private tanggapanController: TanggapanController;

    constructor() {
        this.authMiddleware = new AuthMiddleware();
        this.tanggapanController = new TanggapanController();
        this.validation = new Validation();
        this.router = express.Router();
        this.setupRoutes();
    }

    private setupRoutes() {
        this.router.post('/:id',
            this.authMiddleware.authenticated,
            this.authMiddleware.adminAuthenticated,
            this.tanggapanController.createTanggapan
        );
        this.router.delete('/:id',
            this.authMiddleware.authenticated,
            this.authMiddleware.adminAuthenticated,
            this.tanggapanController.cancelTanggapan,
        );
        this.router.patch('/:id',
            this.authMiddleware.authenticated,
            this.authMiddleware.adminAuthenticated,
            this.tanggapanController.updateTanggapan,
        );
        this.router.get('/:id',
            this.authMiddleware.authenticated,
            this.authMiddleware.adminAuthenticated,
            this.tanggapanController.findTanggapanById,
        );
        this.router.get('/',
            this.authMiddleware.authenticated,
            this.authMiddleware.adminAuthenticated,
            this.tanggapanController.findAllTanggapan,
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}
