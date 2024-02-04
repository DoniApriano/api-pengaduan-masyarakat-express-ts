import express, { Router, Request, Response } from 'express';
import Validation from '../../middleware/validator/validation';
import PengaduanController from '../../controllers/masyarakat/pengaduan.controller';
import AuthMiddleware from '../../middleware/auth/auth.middleware';

export default class PengaduanRouter {
    private router: Router;
    private validation: Validation;
    private pengaduanController: PengaduanController;
    private authMiddleware: AuthMiddleware;

    constructor() {
        this.pengaduanController = new PengaduanController();
        this.authMiddleware = new AuthMiddleware();
        this.validation = new Validation();
        this.router = express.Router();
        this.setupRoutes();
    }

    private setupRoutes() {
        this.router.post('/',
            this.authMiddleware.authenticated,
            this.authMiddleware.masyarakatAuthenticated,
            this.validation.createPengaduanValidation,
            this.pengaduanController.createPengaduan
        );
        this.router.delete('/:id',
            this.authMiddleware.authenticated,
            this.authMiddleware.masyarakatAuthenticated,
            this.pengaduanController.deletePengaduan
        );
        this.router.patch('/:id',
            this.authMiddleware.authenticated,
            this.authMiddleware.masyarakatAuthenticated,
            this.pengaduanController.updatePengaduan
        );
        this.router.get('/:id',
            this.authMiddleware.authenticated,
            this.authMiddleware.masyarakatAuthenticated,
            this.pengaduanController.findOnePengaduan
        );
        this.router.get('/',
            this.authMiddleware.authenticated,
            this.authMiddleware.masyarakatAuthenticated,
            this.pengaduanController.findAllPengaduan
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}
