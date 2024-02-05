import { NextFunction, Request, Response } from "express";
import Validator from "validatorjs";
import AuthService from "../../services/auth.service";

export default class Validation {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
        this.registerValidation = this.registerValidation.bind(this);
    }

    async registerValidation(req: Request, res: Response, next: NextFunction) {
        const { email, nama, password } = req.body;

        const data = {
            email, nama, password
        };

        const rules: Validator.Rules = {
            'email': 'required|email',
            'nama': 'required|string',
            'password': 'required',
        };

        const validate = new Validator(data, rules);
        if (validate.fails()) return res.status(400).json({
            success: false,
            message: validate.errors
        });

        const findEmail = await this.authService.findUser(email);
        if (findEmail) return res.status(400).json({
            success: false,
            message: "Email sudah digunakan",
        });

        next();
    }

    async loginValidation(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        const data = {
            email, password
        };

        const rules: Validator.Rules = {
            'email': 'required|email',
            'password': 'required',
        };

        const validate = new Validator(data, rules);
        if (validate.fails()) return res.status(400).json({
            success: false,
            message: validate.errors
        });

        next();
    }

    async createPengaduanValidation(req: Request, res: Response, next: NextFunction) {
        const { judul, deskripsi, foto, kategoriId } = req.body;

        const data = {
            judul, deskripsi, foto, kategoriId
        };

        const rules: Validator.Rules = {
            'judul': 'required',
            'deskripsi': 'required',
            // Nggak tau validasi foto nya
            'foto': '',
            'kategoriId': 'required',
        };

        const validate = new Validator(data, rules);
        if (validate.fails()) return res.status(400).json({
            success: false,
            message: validate.errors
        });

        next();
    }
    
    async createKategoriValidation(req: Request, res: Response, next: NextFunction) {
        const { nama } = req.body;

        const data = {
            nama,
        };

        const rules: Validator.Rules = {
            'nama': 'required',
        };

        const validate = new Validator(data, rules);
        if (validate.fails()) return res.status(400).json({
            success: false,
            message: validate.errors
        });

        next();
    }






}