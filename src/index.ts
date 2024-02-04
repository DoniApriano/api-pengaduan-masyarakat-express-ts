import express, { Application, Request, Response } from 'express';
import AuthRouter from './router/auth.router';
import cookieParser from 'cookie-parser';
import PengaduanRouter from './router/masyarakat/pengaduan.router';
import { upload } from './config/multer';


class App {
    private app: Application;
    private PORT: number;
    private authRouter: AuthRouter;
    private pengaduanRouter: PengaduanRouter;

    constructor() {
        this.app = express();
        this.PORT = 8080;
        this.authRouter = new AuthRouter();
        this.pengaduanRouter = new PengaduanRouter();

        this.setupMiddleware();
        this.setupRoutes();
        this.startServer();
    }

    private setupMiddleware() {
        this.app.use(express.json());
        this.app.use(upload.single('foto'));
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
    }

    private setupRoutes() {
        this.app.use('/auth', this.authRouter.getRouter());
        this.app.use('/pengaduan', this.pengaduanRouter.getRouter());
    }

    private startServer() {
        this.app.listen(this.PORT, () => {
            console.log(`⚡ Server Start on PORT ${this.PORT}`);
        });
    }
}

new App();