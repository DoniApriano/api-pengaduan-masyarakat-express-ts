import express, { Router, Request, Response } from 'express';
import Validation from '../../middleware/validator/validation';
import AuthMiddleware from '../../middleware/auth/auth.middleware';
import KategoriController from '../../controllers/admin/kategori.controller';

export default class KategoriRouter {
    private router: Router;
    private validation: Validation;
    private kategoriController: KategoriController;
    private authMiddleware: AuthMiddleware;

    constructor() {
        this.kategoriController = new KategoriController();
        this.authMiddleware = new AuthMiddleware();
        this.validation = new Validation();
        this.router = express.Router();
        this.setupRoutes();
    }

    private setupRoutes() {
        this.router.post('/',
            this.authMiddleware.authenticated,
            this.authMiddleware.adminAuthenticated,
            this.validation.createKategoriValidation,
            this.kategoriController.createKategori
        );
        this.router.delete('/:id',
            this.authMiddleware.authenticated,
            this.authMiddleware.adminAuthenticated,
            this.kategoriController.deleteKategori
        );
        this.router.patch('/:id',
            this.authMiddleware.authenticated,
            this.authMiddleware.adminAuthenticated,
            this.kategoriController.updateKategori
        );
        this.router.get('/:id',
            this.authMiddleware.authenticated,
            this.authMiddleware.adminAuthenticated,
            this.kategoriController.findOneKategori
        );
        this.router.get('/',
            this.authMiddleware.authenticated,
            this.authMiddleware.adminAuthenticated,
            this.kategoriController.findAllKategori
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}
