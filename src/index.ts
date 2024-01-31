import express, { Application, Request, Response } from 'express';
import AuthRouter from './router/auth.router';
import cookieParser from 'cookie-parser';


class App {
    private app: Application;
    private PORT: number;
    private authRouter: AuthRouter;

    constructor() {
        this.app = express();
        this.PORT = 8080;
        this.authRouter = new AuthRouter();

        this.setupMiddleware();
        this.setupRoutes();
        this.startServer();
    }

    private setupMiddleware(){
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
    }

    private setupRoutes(){
        this.app.use('/auth', this.authRouter.getRouter());
    }

    private startServer(){
        this.app.listen(this.PORT,()=> {
            console.log(`⚡ Server Start on PORT ${this.PORT}`);
        });
    }
}

new App();