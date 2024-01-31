import e, { Request, Response } from 'express';
import AuthService from '../services/auth.service';

export default class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
    }

    async register(req: Request, res: Response) {
        try {
            const { email, nama, password } = req.body;
            if (!email || !nama || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Email, nama, dan password harus diisi."
                });
            }



            const pengguna = await this.authService.create(email, nama, password);

            return res.status(201).json({
                success: true,
                message: "Berhasil Melakukan Registrasi",
                data: pengguna
            });
        } catch (error) {
            console.error("Error :", error);
            return res.status(500).json({
                success: false,
                message: "Terjadi kesalahan saat melakukan registrasi."
            });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const findPengguna = await this.authService.findUserDataForAuth(email, password);
            if (!findPengguna) return res.status(404).json({
                success: false,
                message: "Email atau Password Tidak Cocok",
            });

            const accessToken = await this.authService.generateAccessToken(email, password);
            res.cookie('access-token', accessToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            });
            
            return res.status(200).json({
                success: true,
                message: "Berhasil Melakukan Registrasi",
                data: {
                    id: findPengguna.id,
                    nama: findPengguna.nama,
                    email: findPengguna.email,
                    accessToken: accessToken,
                }
            });
        } catch (error) {
            console.error("Error :", error);
            return res.status(500).json({
                success: false,
                message: "Terjadi kesalahan saat melakukan registrasi."
            });
        }
    }

    async logout(req: Request, res: Response) {
        res.clearCookie('access-token');
        res.json({ message: 'Logout berhasil' });
    }
}
