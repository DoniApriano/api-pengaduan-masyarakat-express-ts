import { Request, Response, NextFunction } from "express";
import AuthService from "../../services/auth.service";

export default class AuthMiddleware {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService;
        this.authenticated = this.authenticated.bind(this);
    }

    async authenticated(req: Request, res: Response, next: NextFunction) {
        try {
            const authToken = req.headers['authorization'];
            const token = authToken && authToken.split(" ")[1];
            if (!token) return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });

            const accessToken = await this.authService.extractAccessToken(token);
            if (!accessToken) return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });

            res.locals.email = accessToken.email;
            res.locals.roleId = accessToken.roleId;

            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error
            });
        }
    }

    async adminAuthenticated(req: Request, res: Response, next: NextFunction) {
        const roleId = res.locals.roleId;
        const adminRoleId = process.env.ROLE_ID_ADMIN as string;
        if (roleId !== adminRoleId) return res.status(403).json({
            success: false,
            message: "Forbidden"
        });

        next();
    }
    
    async masyarakatAuthenticated(req: Request, res: Response, next: NextFunction) {
        const roleId = res.locals.roleId;
        const masyarakatRoleId = process.env.ROLE_ID_MASYARAKAT as string;
        if (roleId !== masyarakatRoleId) return res.status(403).json({
            success: false,
            message: "Forbidden"
        });

        next();
    }

}